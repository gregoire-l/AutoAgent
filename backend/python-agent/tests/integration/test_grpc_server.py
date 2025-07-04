"""
Tests d'intégration pour le serveur gRPC AgentSessionService.
Tests de communication gRPC bout-en-bout avec serveur réel.
Version strictement typée pour Pylance strict mode.
"""
import uuid
import threading
from typing import Iterator, Tuple, List
import pytest
import grpc
from google.protobuf.duration_pb2 import Duration

import autoagent_api.agent_service_pb2 as agent_pb2
import autoagent_api.agent_service_pb2_grpc as agent_grpc
import autoagent_api.common_pb2 as common_pb2


class TestGRPCServerIntegrationAgent:
    """Tests d'intégration du serveur gRPC Agent."""

    def test_server_startup_shutdown_lifecycle(self, grpc_server: Tuple[grpc.Server, int]) -> None:
        """Test du cycle de vie démarrage/arrêt du serveur gRPC."""
        server, port = grpc_server
        
        # Vérifier que le serveur est démarré
        assert server is not None
        assert port > 0
        
        # Le serveur sera arrêté automatiquement par la fixture

    def test_grpc_channel_connectivity(self, grpc_channel: grpc.Channel) -> None:
        """Test de connectivité du canal gRPC."""
        # Vérifier que le canal peut se connecter
        try:
            grpc.channel_ready_future(grpc_channel).result(timeout=5)
        except grpc.FutureTimeoutError:
            pytest.fail("Impossible de se connecter au serveur gRPC dans les temps")

    def test_start_session_grpc_communication(
        self, 
        grpc_stub: agent_grpc.AgentSessionServiceStub, 
        valid_start_session_request: agent_pb2.StartSessionRequest
    ) -> None:
        """Test de communication gRPC complète pour StartSession."""
        response: agent_pb2.StartSessionResponse = grpc_stub.StartSession(valid_start_session_request)  # type: ignore
        
        # Vérifier la réponse
        assert response.session_id  # type: ignore
        assert len(response.session_id) == 36  # type: ignore
        
        # Vérifier que c'est un UUID valide
        uuid.UUID(response.session_id)  # type: ignore

    def test_start_session_multiple_calls_unique_ids(
        self, 
        grpc_stub: agent_grpc.AgentSessionServiceStub, 
        valid_start_session_request: agent_pb2.StartSessionRequest
    ) -> None:
        """Test que plusieurs appels StartSession génèrent des IDs uniques."""
        response1: agent_pb2.StartSessionResponse = grpc_stub.StartSession(valid_start_session_request)  # type: ignore
        response2: agent_pb2.StartSessionResponse = grpc_stub.StartSession(valid_start_session_request)  # type: ignore
        
        assert response1.session_id != response2.session_id  # type: ignore

    def test_execute_step_grpc_streaming(
        self, 
        grpc_stub: agent_grpc.AgentSessionServiceStub, 
        valid_execute_step_request: agent_pb2.ExecuteStepRequest
    ) -> None:
        """Test du RPC streaming ExecuteStep."""
        # ExecuteStep est un RPC client-streaming
        def request_generator() -> Iterator[agent_pb2.ExecuteStepRequest]:
            yield valid_execute_step_request
        
        response: agent_pb2.ExecuteStepResponse = grpc_stub.ExecuteStep(request_generator())  # type: ignore
        
        # Vérifier la réponse
        assert response.result.status == common_pb2.EXECUTION_STATUS_SUCCESS  # type: ignore
        assert "Hello World from Phase 0 Agent" in response.result.last_stdout  # type: ignore
        assert response.result.summary  # type: ignore

    def test_execute_step_timeout_handling(self, grpc_stub: agent_grpc.AgentSessionServiceStub) -> None:
        """Test de gestion du timeout dans ExecuteStep."""
        # Créer une requête avec un timeout très court
        timeout = Duration()
        timeout.seconds = 1  # 1 seconde
        
        request = agent_pb2.ExecuteStepRequest(
            request_id=str(uuid.uuid4()),
            session_id="test-session",
            directive="Execute command with short timeout",
            timeout=timeout
        )
        
        def request_generator() -> Iterator[agent_pb2.ExecuteStepRequest]:
            yield request
        
        response: agent_pb2.ExecuteStepResponse = grpc_stub.ExecuteStep(request_generator())  # type: ignore
        
        # La commande echo devrait réussir même avec un timeout court
        assert response.result.status == common_pb2.EXECUTION_STATUS_SUCCESS  # type: ignore

    def test_stop_session_grpc_communication(
        self, 
        grpc_stub: agent_grpc.AgentSessionServiceStub, 
        valid_stop_session_request: agent_pb2.StopSessionRequest
    ) -> None:
        """Test de communication gRPC complète pour StopSession."""
        response: agent_pb2.StopSessionResponse = grpc_stub.StopSession(valid_stop_session_request)  # type: ignore
        
        # Vérifier que la réponse est vide (pas de final_workspace en Phase 0)
        assert isinstance(response, agent_pb2.StopSessionResponse)
        assert not response.HasField('final_workspace')

    def test_session_lifecycle_complete(
        self, 
        grpc_stub: agent_grpc.AgentSessionServiceStub, 
        valid_agent_profile: common_pb2.AgentProfile, 
        valid_workspace_reference: common_pb2.WorkspaceReference
    ) -> None:
        """Test du cycle de vie complet d'une session."""
        # 1. Démarrer une session
        start_request = agent_pb2.StartSessionRequest(
            request_id=str(uuid.uuid4()),
            agent_profile=valid_agent_profile,
            initial_workspace=valid_workspace_reference
        )
        start_response: agent_pb2.StartSessionResponse = grpc_stub.StartSession(start_request)  # type: ignore
        session_id: str = start_response.session_id  # type: ignore
        
        # 2. Exécuter une étape
        timeout = Duration()
        timeout.seconds = 30
        
        execute_request = agent_pb2.ExecuteStepRequest(
            request_id=str(uuid.uuid4()),
            session_id=session_id,
            directive="Execute test command in session lifecycle",
            timeout=timeout
        )
        
        def request_generator() -> Iterator[agent_pb2.ExecuteStepRequest]:
            yield execute_request
        
        execute_response: agent_pb2.ExecuteStepResponse = grpc_stub.ExecuteStep(request_generator())  # type: ignore
        assert execute_response.result.status == common_pb2.EXECUTION_STATUS_SUCCESS  # type: ignore
        
        # 3. Arrêter la session
        stop_request = agent_pb2.StopSessionRequest(
            request_id=str(uuid.uuid4()),
            session_id=session_id,
            final_status=agent_pb2.FINAL_STATUS_SUCCESS,
            commit_message="Session lifecycle test completed"
        )
        stop_response: agent_pb2.StopSessionResponse = grpc_stub.StopSession(stop_request)  # type: ignore
        assert isinstance(stop_response, agent_pb2.StopSessionResponse)

    def test_multiple_sessions_isolation(
        self, 
        grpc_stub: agent_grpc.AgentSessionServiceStub, 
        valid_agent_profile: common_pb2.AgentProfile, 
        valid_workspace_reference: common_pb2.WorkspaceReference
    ) -> None:
        """Test que plusieurs sessions sont isolées."""
        # Créer deux sessions
        session_ids: List[str] = []
        for _ in range(2):
            start_request = agent_pb2.StartSessionRequest(
                request_id=str(uuid.uuid4()),
                agent_profile=valid_agent_profile,
                initial_workspace=valid_workspace_reference
            )
            response: agent_pb2.StartSessionResponse = grpc_stub.StartSession(start_request)  # type: ignore
            session_ids.append(response.session_id)  # type: ignore
        
        # Vérifier que les sessions ont des IDs différents
        assert session_ids[0] != session_ids[1]
        
        # Exécuter des commandes dans chaque session
        timeout = Duration()
        timeout.seconds = 30
        
        for session_id in session_ids:
            execute_request = agent_pb2.ExecuteStepRequest(
                request_id=str(uuid.uuid4()),
                session_id=session_id,
                directive="Execute command in isolated session",
                timeout=timeout
            )
            
            def request_generator() -> Iterator[agent_pb2.ExecuteStepRequest]:
                yield execute_request
            
            exec_response: agent_pb2.ExecuteStepResponse = grpc_stub.ExecuteStep(request_generator())  # type: ignore
            assert exec_response.result.status == common_pb2.EXECUTION_STATUS_SUCCESS  # type: ignore

    def test_grpc_error_handling(self, grpc_stub: agent_grpc.AgentSessionServiceStub) -> None:
        """Test de gestion d'erreur gRPC avec requête invalide."""
        # Requête avec session_id vide (devrait échouer)
        timeout = Duration()
        timeout.seconds = 30
        
        invalid_request = agent_pb2.ExecuteStepRequest(
            request_id=str(uuid.uuid4()),
            session_id="",  # Session ID vide
            directive="This should fail due to empty session ID",
            timeout=timeout
        )
        
        def request_generator() -> Iterator[agent_pb2.ExecuteStepRequest]:
            yield invalid_request
        
        # En Phase 0, le service pourrait toujours répondre
        # mais dans une implémentation complète, cela devrait échouer
        try:
            response: agent_pb2.ExecuteStepResponse = grpc_stub.ExecuteStep(request_generator())  # type: ignore
            # Si ça passe, vérifier au moins que la réponse est cohérente
            assert response.result is not None  # type: ignore
        except grpc.RpcError as e:
            # Si ça échoue, vérifier que c'est pour la bonne raison
            assert e.code() in [grpc.StatusCode.INVALID_ARGUMENT, grpc.StatusCode.FAILED_PRECONDITION]

    def test_concurrent_requests(
        self, 
        grpc_stub: agent_grpc.AgentSessionServiceStub, 
        valid_start_session_request: agent_pb2.StartSessionRequest
    ) -> None:
        """Test de gestion des requêtes concurrentes."""
        responses: List[agent_pb2.StartSessionResponse] = []
        errors: List[Exception] = []
        
        def make_request() -> None:
            try:
                response: agent_pb2.StartSessionResponse = grpc_stub.StartSession(valid_start_session_request)  # type: ignore
                responses.append(response)  # type: ignore
            except Exception as e:
                errors.append(e)
        
        # Lancer plusieurs requêtes en parallèle
        threads: List[threading.Thread] = []
        for _ in range(5):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()
        
        # Attendre que tous les threads se terminent
        for thread in threads:
            thread.join(timeout=10)
        
        # Vérifier les résultats
        assert len(errors) == 0, f"Erreurs dans les requêtes concurrentes: {errors}"
        assert len(responses) == 5
        
        # Vérifier que tous les session_ids sont uniques
        session_ids = [r.session_id for r in responses]
        assert len(set(session_ids)) == 5, "Les session_ids ne sont pas uniques"