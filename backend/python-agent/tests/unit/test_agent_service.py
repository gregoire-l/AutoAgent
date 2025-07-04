"""
Tests unitaires pour AgentSessionService.
Tests de la logique métier sans infrastructure gRPC.
Version strictement typée pour Pylance strict mode.
"""
import uuid
from typing import Iterator
import pytest
from unittest.mock import patch, Mock, MagicMock

import autoagent_api.agent_service_pb2 as agent_pb2
import autoagent_api.common_pb2 as common_pb2
from agent_service_py.services.agent_service import AgentSessionServiceServicer  # type: ignore[import-untyped]


class TestAgentSessionServiceUnit:
    """Tests unitaires du service Agent Session."""

    def test_start_session_returns_valid_uuid(
        self, 
        agent_servicer: AgentSessionServiceServicer, 
        valid_start_session_request: agent_pb2.StartSessionRequest, 
        mock_grpc_context: Mock
    ) -> None:
        """Test que StartSession retourne un UUID valide."""
        response = agent_servicer.StartSession(valid_start_session_request, mock_grpc_context)
        
        # Vérifier que la réponse contient un UUID valide
        assert response.session_id
        assert len(response.session_id) == 36  # Format UUID standard
        
        # Vérifier que c'est un UUID valide
        try:
            uuid.UUID(response.session_id)
        except ValueError:
            pytest.fail("session_id n'est pas un UUID valide")

    def test_start_session_generates_unique_ids(
        self, 
        agent_servicer: AgentSessionServiceServicer, 
        valid_start_session_request: agent_pb2.StartSessionRequest, 
        mock_grpc_context: Mock
    ) -> None:
        """Test que chaque appel génère un UUID unique."""
        response1 = agent_servicer.StartSession(valid_start_session_request, mock_grpc_context)
        response2 = agent_servicer.StartSession(valid_start_session_request, mock_grpc_context)
        
        assert response1.session_id != response2.session_id

    @patch('agent_service_py.services.agent_service.logging')
    def test_start_session_logs_correctly(
        self, 
        mock_logging: MagicMock, 
        agent_servicer: AgentSessionServiceServicer, 
        valid_start_session_request: agent_pb2.StartSessionRequest, 
        mock_grpc_context: Mock
    ) -> None:
        """Test que StartSession utilise logging.info correctement."""
        response = agent_servicer.StartSession(valid_start_session_request, mock_grpc_context)
        
        # Vérifier que logging.info a été appelé avec le bon message
        mock_logging.info.assert_called_once()
        call_args = mock_logging.info.call_args[0][0]
        assert "Started session:" in call_args
        assert response.session_id in call_args

    def test_execute_step_hardcoded_command(
        self, 
        agent_servicer: AgentSessionServiceServicer, 
        valid_execute_step_request: agent_pb2.ExecuteStepRequest, 
        mock_grpc_context: Mock
    ) -> None:
        """Test que ExecuteStep exécute la commande hardcodée."""
        # Créer un itérateur mock avec la requête
        request_iterator: Iterator[agent_pb2.ExecuteStepRequest] = iter([valid_execute_step_request])
        
        with patch('agent_service_py.services.agent_service.subprocess.run') as mock_run:
            # Configurer le mock pour simuler une exécution réussie
            mock_run.return_value = Mock(
                returncode=0,
                stdout="Hello World from Phase 0 Agent\n",
                stderr=""
            )
            
            response = agent_servicer.ExecuteStep(request_iterator, mock_grpc_context)
            
            # Vérifier que subprocess.run a été appelé avec la commande hardcodée
            mock_run.assert_called_once()
            call_args = mock_run.call_args
            assert call_args is not None
            assert 'echo "Hello World from Phase 0 Agent"' in call_args[0][0]
            
            # Vérifier la réponse
            assert response.result.status == common_pb2.EXECUTION_STATUS_SUCCESS
            assert "Hello World from Phase 0 Agent" in response.result.last_stdout

    @patch('agent_service_py.services.agent_service.logging')
    def test_execute_step_logs_session_id(
        self, 
        mock_logging: MagicMock, 
        agent_servicer: AgentSessionServiceServicer, 
        valid_execute_step_request: agent_pb2.ExecuteStepRequest, 
        mock_grpc_context: Mock
    ) -> None:
        """Test que ExecuteStep log le session_id correctement."""
        request_iterator: Iterator[agent_pb2.ExecuteStepRequest] = iter([valid_execute_step_request])
        
        with patch('agent_service_py.services.agent_service.subprocess.run'):
            agent_servicer.ExecuteStep(request_iterator, mock_grpc_context)
            
            # Vérifier que logging.info a été appelé
            mock_logging.info.assert_called()
            call_args = mock_logging.info.call_args[0][0]
            assert "Executing step for session:" in call_args
            assert valid_execute_step_request.session_id in call_args

    def test_execute_step_handles_command_failure(
        self, 
        agent_servicer: AgentSessionServiceServicer, 
        valid_execute_step_request: agent_pb2.ExecuteStepRequest, 
        mock_grpc_context: Mock
    ) -> None:
        """Test que ExecuteStep gère les échecs de commande."""
        request_iterator: Iterator[agent_pb2.ExecuteStepRequest] = iter([valid_execute_step_request])
        
        with patch('agent_service_py.services.agent_service.subprocess.run') as mock_run:
            # Simuler un échec de commande
            mock_run.return_value = Mock(
                returncode=1,
                stdout="",
                stderr="Command failed"
            )
            
            response = agent_servicer.ExecuteStep(request_iterator, mock_grpc_context)
            
            # Vérifier que le statut reflète l'échec
            assert response.result.status == common_pb2.EXECUTION_STATUS_FAILURE
            assert "Command failed" in response.result.last_stderr

    def test_execute_step_handles_exception(
        self, 
        agent_servicer: AgentSessionServiceServicer, 
        valid_execute_step_request: agent_pb2.ExecuteStepRequest, 
        mock_grpc_context: Mock
    ) -> None:
        """Test que ExecuteStep gère les exceptions."""
        request_iterator: Iterator[agent_pb2.ExecuteStepRequest] = iter([valid_execute_step_request])
        
        with patch('agent_service_py.services.agent_service.subprocess.run') as mock_run:
            # Simuler une exception
            mock_run.side_effect = Exception("Subprocess error")
            
            response = agent_servicer.ExecuteStep(request_iterator, mock_grpc_context)
            
            # Vérifier que l'exception est gérée
            assert response.result.status == common_pb2.EXECUTION_STATUS_FAILURE
            assert "Subprocess error" in response.result.summary

    def test_stop_session_returns_empty_response(
        self, 
        agent_servicer: AgentSessionServiceServicer, 
        valid_stop_session_request: agent_pb2.StopSessionRequest, 
        mock_grpc_context: Mock
    ) -> None:
        """Test que StopSession retourne une réponse vide."""
        response = agent_servicer.StopSession(valid_stop_session_request, mock_grpc_context)
        
        # Vérifier que la réponse est bien vide (pas de final_workspace)
        assert isinstance(response, agent_pb2.StopSessionResponse)
        assert not response.HasField('final_workspace')

    @patch('agent_service_py.services.agent_service.logging')
    def test_stop_session_logs_correctly(
        self, 
        mock_logging: MagicMock, 
        agent_servicer: AgentSessionServiceServicer, 
        valid_stop_session_request: agent_pb2.StopSessionRequest, 
        mock_grpc_context: Mock
    ) -> None:
        """Test que StopSession utilise logging.info correctement."""
        agent_servicer.StopSession(valid_stop_session_request, mock_grpc_context)
        
        # Vérifier que logging.info a été appelé
        mock_logging.info.assert_called_once()
        call_args = mock_logging.info.call_args[0][0]
        assert "Stopping session:" in call_args
        assert valid_stop_session_request.session_id in call_args
