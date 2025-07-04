"""
Tests unitaires pour ReasoningService.
Tests de la logique métier sans infrastructure gRPC.
Version strictement typée pour Pylance strict mode.
"""
import uuid

import pytest
from unittest.mock import patch, MagicMock

import autoagent_api.reasoning_service_pb2 as reasoning_pb2
import autoagent_api.common_pb2 as common_pb2
from reasoning_service_py.services.reasoning_service import ReasoningServiceServicer  # type: ignore[import-untyped]


def float_equals(a: float, b: float, epsilon: float = 1e-4) -> bool:
    """Compare two floats with epsilon precision."""
    return abs(a - b) < epsilon


class TestReasoningServiceUnit:
    """Tests unitaires du service Reasoning."""

    def test_generate_options_returns_hardcoded_tasks(
        self, 
        reasoning_servicer: ReasoningServiceServicer, 
        valid_generate_options_request: reasoning_pb2.GenerateOptionsRequest, 
        mock_grpc_context: MagicMock
    ) -> None:
        """Test que GenerateOptions retourne les tâches hardcodées."""
        response = reasoning_servicer.GenerateOptions(valid_generate_options_request, mock_grpc_context)
        
        # Vérifier qu'on a exactement 2 tâches (selon l'implémentation Phase 0)
        assert len(response.potential_tasks) == 2
        
        # Vérifier le contenu des tâches hardcodées
        task_prompts = [task.prompt for task in response.potential_tasks]
        assert "Write a 'hello_world.py' script." in task_prompts
        assert "List files in the current directory." in task_prompts
        
        # Vérifier que chaque tâche a un UUID valide
        for task in response.potential_tasks:
            assert task.id
            try:
                uuid.UUID(task.id)
            except ValueError:
                pytest.fail(f"Task ID {task.id} n'est pas un UUID valide")

    def test_generate_options_unique_task_ids(
        self, 
        reasoning_servicer: ReasoningServiceServicer, 
        valid_generate_options_request: reasoning_pb2.GenerateOptionsRequest, 
        mock_grpc_context: MagicMock
    ) -> None:
        """Test que GenerateOptions génère des UUIDs uniques pour chaque tâche."""
        response = reasoning_servicer.GenerateOptions(valid_generate_options_request, mock_grpc_context)
        
        task_ids = [task.id for task in response.potential_tasks]
        assert len(task_ids) == len(set(task_ids)), "Les IDs des tâches ne sont pas uniques"

    @patch('reasoning_service_py.services.reasoning_service.logging')
    def test_generate_options_logs_request_id(
        self, 
        mock_logging: MagicMock, 
        reasoning_servicer: ReasoningServiceServicer, 
        valid_generate_options_request: reasoning_pb2.GenerateOptionsRequest, 
        mock_grpc_context: MagicMock
    ) -> None:
        """Test que GenerateOptions log le request_id correctement."""
        reasoning_servicer.GenerateOptions(valid_generate_options_request, mock_grpc_context)
        
        # Vérifier que logging.info a été appelé avec le request_id
        mock_logging.info.assert_called_once()
        call_args = mock_logging.info.call_args[0][0]
        assert "Received GenerateOptions request:" in call_args
        assert valid_generate_options_request.request_id in call_args

    def test_score_options_returns_random_scores(
        self, 
        reasoning_servicer: ReasoningServiceServicer, 
        valid_score_options_request: reasoning_pb2.ScoreOptionsRequest, 
        mock_grpc_context: MagicMock
    ) -> None:
        """Test que ScoreOptions retourne des scores aléatoires dans les bonnes plages."""
        response = reasoning_servicer.ScoreOptions(valid_score_options_request, mock_grpc_context)
        
        # Vérifier qu'on a autant de résultats que de tâches en entrée
        assert len(response.results) == len(valid_score_options_request.tasks_to_score)
        
        # Vérifier chaque résultat
        for result in response.results:
            assert result.id == valid_score_options_request.tasks_to_score[0].id
            assert result.HasField('success')  # Pas d'erreur
            
            scored_option = result.success
            score = scored_option.score
            
            # Vérifier les plages de scores selon l'implémentation
            assert 0.1 <= score.predicted_complexity <= 0.9
            assert 0.5 <= score.predicted_success_probability <= 1.0
            assert 1 <= score.predicted_cost <= 10
            assert 0.5 <= scored_option.model_confidence <= 1.0
            
            # Vérifier la rationale
            assert scored_option.rationale == "Placeholder rationale based on random scoring."

    @patch('reasoning_service_py.services.reasoning_service.random.uniform')
    def test_score_options_uses_random_values(
        self, 
        mock_random: MagicMock, 
        reasoning_servicer: ReasoningServiceServicer, 
        valid_score_options_request: reasoning_pb2.ScoreOptionsRequest, 
        mock_grpc_context: MagicMock
    ) -> None:
        """Test que ScoreOptions utilise bien random.uniform pour les scores."""
        # Configurer des valeurs fixes pour les tests
        mock_random.side_effect = [0.5, 0.8, 5.0, 0.7]  # complexity, success_prob, cost, confidence
        
        response = reasoning_servicer.ScoreOptions(valid_score_options_request, mock_grpc_context)
        
        # Vérifier que random.uniform a été appelé avec les bons paramètres
        expected_calls = [
            (0.1, 0.9),      # predicted_complexity
            (0.5, 1.0),      # predicted_success_probability
            (1, 10),         # predicted_cost
            (0.5, 1.0)       # model_confidence
        ]

        actual_calls = [call[0] for call in mock_random.call_args_list]
        assert actual_calls == expected_calls
        
        # Vérifier que les valeurs mockées sont utilisées
        result = response.results[0]
        score = result.success.score
        assert float_equals(score.predicted_complexity, 0.5)
        assert float_equals(score.predicted_success_probability, 0.8)
        assert float_equals(score.predicted_cost, 5.0)
        assert float_equals(result.success.model_confidence, 0.7)

    @patch('reasoning_service_py.services.reasoning_service.logging')
    def test_score_options_logs_request_id(
        self, 
        mock_logging: MagicMock, 
        reasoning_servicer: ReasoningServiceServicer, 
        valid_score_options_request: reasoning_pb2.ScoreOptionsRequest, 
        mock_grpc_context: MagicMock
    ) -> None:
        """Test que ScoreOptions log le request_id correctement."""
        reasoning_servicer.ScoreOptions(valid_score_options_request, mock_grpc_context)
        
        # Vérifier que logging.info a été appelé
        mock_logging.info.assert_called_once()
        call_args = mock_logging.info.call_args[0][0]
        assert "Received ScoreOptions request:" in call_args
        assert valid_score_options_request.request_id in call_args

    def test_score_options_multiple_tasks(
        self, 
        reasoning_servicer: ReasoningServiceServicer, 
        mock_grpc_context: MagicMock, 
        valid_uuid: str
    ) -> None:
        """Test que ScoreOptions gère correctement plusieurs tâches."""
        # Créer une requête avec plusieurs tâches
        tasks = [
            common_pb2.PotentialTask(id=str(uuid.uuid4()), prompt="Task 1 with sufficient length"),
            common_pb2.PotentialTask(id=str(uuid.uuid4()), prompt="Task 2 with sufficient length"),
            common_pb2.PotentialTask(id=str(uuid.uuid4()), prompt="Task 3 with sufficient length")
        ]
        
        request = reasoning_pb2.ScoreOptionsRequest(
            request_id=valid_uuid,
            mission_id=str(uuid.uuid4()),
            shared_context="Test context",
            tasks_to_score=tasks
        )
        
        response = reasoning_servicer.ScoreOptions(request, mock_grpc_context)
        
        # Vérifier qu'on a un résultat pour chaque tâche
        assert len(response.results) == 3
        
        # Vérifier que les IDs correspondent
        result_ids = [result.id for result in response.results]
        task_ids = [task.id for task in tasks]
        assert result_ids == task_ids
