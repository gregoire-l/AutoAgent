"""
Tests d'intégration pour le serveur gRPC ReasoningService.
Tests de communication gRPC bout-en-bout avec serveur réel.
Version strictement typée pour Pylance strict mode.
"""
import uuid
import threading
from typing import List, Tuple, Any
import pytest
import grpc

import autoagent_api.reasoning_service_pb2 as reasoning_pb2
import autoagent_api.reasoning_service_pb2_grpc as reasoning_grpc
import autoagent_api.common_pb2 as common_pb2


class TestGRPCServerIntegrationReasoning:
    """Tests d'intégration du serveur gRPC Reasoning."""

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

    def test_generate_options_grpc_communication(
        self, 
        grpc_stub: reasoning_grpc.ReasoningServiceStub, 
        valid_generate_options_request: reasoning_pb2.GenerateOptionsRequest
    ) -> None:
        """Test de communication gRPC complète pour GenerateOptions."""
        response = grpc_stub.GenerateOptions(valid_generate_options_request)
        
        # Vérifier la réponse selon l'implémentation Phase 0
        assert len(response.potential_tasks) == 2
        
        # Vérifier le contenu des tâches hardcodées
        task_prompts: List[str] = [task.prompt for task in response.potential_tasks]
        assert "Write a 'hello_world.py' script." in task_prompts
        assert "List files in the current directory." in task_prompts
        
        # Vérifier que chaque tâche a un UUID valide
        for task in response.potential_tasks:
            uuid.UUID(task.id)

    def test_generate_options_multiple_calls_unique_ids(
        self, 
        grpc_stub: reasoning_grpc.ReasoningServiceStub, 
        valid_generate_options_request: reasoning_pb2.GenerateOptionsRequest
    ) -> None:
        """Test que plusieurs appels GenerateOptions génèrent des UUIDs uniques."""
        response1 = grpc_stub.GenerateOptions(valid_generate_options_request)
        response2 = grpc_stub.GenerateOptions(valid_generate_options_request)
        
        # Collecter tous les IDs
        ids1: List[str] = [task.id for task in response1.potential_tasks]
        ids2: List[str] = [task.id for task in response2.potential_tasks]
        
        # Vérifier qu'aucun ID n'est dupliqué entre les appels
        assert len(set(ids1 + ids2)) == len(ids1) + len(ids2)

    def test_score_options_grpc_communication(
        self, 
        grpc_stub: reasoning_grpc.ReasoningServiceStub, 
        valid_score_options_request: reasoning_pb2.ScoreOptionsRequest
    ) -> None:
        """Test de communication gRPC complète pour ScoreOptions."""
        response = grpc_stub.ScoreOptions(valid_score_options_request)
        
        # Vérifier qu'on a autant de résultats que de tâches en entrée
        assert len(response.results) == len(valid_score_options_request.tasks_to_score)
        
        # Vérifier chaque résultat
        for i, result in enumerate(response.results):
            assert result.id == valid_score_options_request.tasks_to_score[i].id
            assert result.HasField('success')  # Pas d'erreur en Phase 0
            
            scored_option = result.success
            score = scored_option.score
            
            # Vérifier les plages de scores selon l'implémentation
            assert 0.1 <= score.predicted_complexity <= 0.9
            assert 0.5 <= score.predicted_success_probability <= 1.0
            assert 1 <= score.predicted_cost <= 10
            assert 0.5 <= scored_option.model_confidence <= 1.0
            
            # Vérifier la rationale
            assert scored_option.rationale == "Placeholder rationale based on random scoring."

    def test_score_options_multiple_tasks(self, grpc_stub: reasoning_grpc.ReasoningServiceStub) -> None:
        """Test ScoreOptions avec plusieurs tâches."""
        # Créer plusieurs tâches
        tasks: List[common_pb2.PotentialTask] = [
            common_pb2.PotentialTask(
                id=str(uuid.uuid4()),
                prompt=f"Task {i} with sufficient length for validation"
            )
            for i in range(3)
        ]
        
        request = reasoning_pb2.ScoreOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            shared_context="Test context for multiple tasks",
            tasks_to_score=tasks
        )
        
        response = grpc_stub.ScoreOptions(request)
        
        # Vérifier qu'on a un résultat pour chaque tâche
        assert len(response.results) == 3
        
        # Vérifier que les IDs correspondent
        result_ids: List[str] = [result.id for result in response.results]
        task_ids: List[str] = [task.id for task in tasks]
        assert result_ids == task_ids

    def test_reasoning_service_end_to_end_workflow(self, grpc_stub: reasoning_grpc.ReasoningServiceStub) -> None:
        """Test du workflow complet : GenerateOptions puis ScoreOptions."""
        # 1. Générer des options
        generate_request = reasoning_pb2.GenerateOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            current_task_prompt="Implement a new feature for the system",
            factual_context="System uses Python and gRPC",
            generation_directive="Generate implementation tasks"
        )
        
        generate_response = grpc_stub.GenerateOptions(generate_request)
        assert len(generate_response.potential_tasks) == 2
        
        # 2. Scorer les options générées
        score_request = reasoning_pb2.ScoreOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=generate_request.mission_id,  # Même mission
            shared_context="Development environment context",
            tasks_to_score=list(generate_response.potential_tasks)
        )
        
        score_response = grpc_stub.ScoreOptions(score_request)
        
        # Vérifier que toutes les tâches ont été scorées
        assert len(score_response.results) == len(generate_response.potential_tasks)
        
        # Vérifier que les IDs correspondent
        generated_ids: List[str] = [task.id for task in generate_response.potential_tasks]
        scored_ids: List[str] = [result.id for result in score_response.results]
        assert generated_ids == scored_ids

    def test_concurrent_requests(
        self, 
        grpc_stub: reasoning_grpc.ReasoningServiceStub, 
        valid_generate_options_request: reasoning_pb2.GenerateOptionsRequest
    ) -> None:
        """Test de gestion des requêtes concurrentes."""
        responses: List[reasoning_pb2.GenerateOptionsResponse] = []
        errors: List[Exception] = []
        
        def make_request() -> None:
            try:
                response = grpc_stub.GenerateOptions(valid_generate_options_request)
                responses.append(response)
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
        
        # Vérifier que toutes les réponses sont valides
        for response in responses:
            assert len(response.potential_tasks) == 2

    def test_grpc_timeout_handling(self, grpc_channel: grpc.Channel) -> None:
        """Test de gestion des timeouts gRPC."""
        stub = reasoning_grpc.ReasoningServiceStub(grpc_channel)
        
        request = reasoning_pb2.GenerateOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            current_task_prompt="Test request with timeout handling",
            generation_directive="Generate options with timeout"
        )
        
        # Test avec timeout très court (devrait réussir car l'implémentation est simple)
        try:
            response = stub.GenerateOptions(request, timeout=0.1)
            assert len(response.potential_tasks) == 2
        except grpc.RpcError as e:
            # Si timeout, vérifier que c'est bien un timeout
            assert e.code() == grpc.StatusCode.DEADLINE_EXCEEDED

    def test_grpc_metadata_handling(self, grpc_channel: grpc.Channel) -> None:
        """Test de gestion des métadonnées gRPC."""
        stub = reasoning_grpc.ReasoningServiceStub(grpc_channel)
        
        request = reasoning_pb2.GenerateOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            current_task_prompt="Test request with metadata",
            generation_directive="Generate options with metadata"
        )
        
        # Ajouter des métadonnées
        metadata: List[Tuple[str, str]] = [
            ('user-agent', 'test-client'),
            ('request-source', 'integration-test')
        ]
        
        response = stub.GenerateOptions(request, metadata=metadata)
        assert len(response.potential_tasks) == 2

    def test_server_handles_invalid_requests_gracefully(self, grpc_stub: reasoning_grpc.ReasoningServiceStub) -> None:
        """Test que le serveur gère gracieusement les requêtes invalides."""
        # Requête avec champs manquants
        try:
            # Créer une requête minimale (certains champs requis manquent)
            incomplete_request = reasoning_pb2.GenerateOptionsRequest()
            response = grpc_stub.GenerateOptions(incomplete_request)
            
            # Si ça passe, vérifier que la réponse est cohérente
            assert isinstance(response, reasoning_pb2.GenerateOptionsResponse)
            
        except grpc.RpcError as e:
            # Si ça échoue, vérifier que c'est pour la bonne raison
            assert e.code() in [
                grpc.StatusCode.INVALID_ARGUMENT,
                grpc.StatusCode.FAILED_PRECONDITION
            ]
