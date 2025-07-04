"""
Tests de validation Buf protovalidate pour ReasoningService.
Tests spécifiques aux contraintes définies dans les fichiers .proto.
Version strictement typée pour Pylance strict mode.
"""
import uuid
from typing import List

import autoagent_api.reasoning_service_pb2 as reasoning_pb2
import autoagent_api.common_pb2 as common_pb2


class TestBufProtoValidationReasoning:
    """Tests de validation protobuf pour le service Reasoning."""

    def test_generate_options_request_uuid_validation(self) -> None:
        """Test que request_id et mission_id doivent être des UUIDs valides."""
        # UUIDs valides
        valid_request = reasoning_pb2.GenerateOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            current_task_prompt="This is a valid task prompt with sufficient length",
            generation_directive="This is a valid generation directive with sufficient length"
        )
        
        # Vérifier que les UUIDs sont bien formés
        assert len(valid_request.request_id) == 36
        assert len(valid_request.mission_id) == 36
        
        # Vérifier qu'on peut parser les UUIDs
        uuid.UUID(valid_request.request_id)
        uuid.UUID(valid_request.mission_id)

    def test_generate_options_request_min_len_validation(self) -> None:
        """Test que current_task_prompt et generation_directive respectent min_len = 10."""
        # Prompts valides (>= 10 caractères)
        valid_request = reasoning_pb2.GenerateOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            current_task_prompt="This prompt is definitely long enough to pass validation",
            generation_directive="This directive is also long enough to pass validation"
        )
        
        assert len(valid_request.current_task_prompt) >= 10
        assert len(valid_request.generation_directive) >= 10

    def test_generate_options_factual_context_optional(self) -> None:
        """Test que factual_context est optionnel (pas de règle de validation)."""
        # Avec factual_context
        request_with_context = reasoning_pb2.GenerateOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            current_task_prompt="Valid task prompt with sufficient length",
            factual_context="Some factual context information",
            generation_directive="Valid generation directive with sufficient length"
        )
        assert request_with_context.factual_context == "Some factual context information"
        
        # Sans factual_context
        request_without_context = reasoning_pb2.GenerateOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            current_task_prompt="Valid task prompt with sufficient length",
            generation_directive="Valid generation directive with sufficient length"
        )
        assert request_without_context.factual_context == ""

    def test_generate_options_response_min_items_validation(self) -> None:
        """Test que potential_tasks respecte min_items = 1."""
        # Réponse valide avec au moins une tâche
        task = common_pb2.PotentialTask(
            id=str(uuid.uuid4()),
            prompt="This is a valid task prompt with sufficient length"
        )
        
        valid_response = reasoning_pb2.GenerateOptionsResponse(
            potential_tasks=[task]
        )
        assert len(valid_response.potential_tasks) >= 1

    def test_score_options_request_uuid_validation(self) -> None:
        """Test que request_id et mission_id doivent être des UUIDs valides."""
        task = common_pb2.PotentialTask(
            id=str(uuid.uuid4()),
            prompt="Valid task prompt with sufficient length"
        )
        
        valid_request = reasoning_pb2.ScoreOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            shared_context="Optional shared context",
            tasks_to_score=[task]
        )
        
        # Vérifier les UUIDs
        uuid.UUID(valid_request.request_id)
        uuid.UUID(valid_request.mission_id)

    def test_score_options_request_tasks_min_items(self) -> None:
        """Test que tasks_to_score respecte min_items = 1."""
        task = common_pb2.PotentialTask(
            id=str(uuid.uuid4()),
            prompt="Valid task prompt with sufficient length"
        )
        
        valid_request = reasoning_pb2.ScoreOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            tasks_to_score=[task]
        )
        assert len(valid_request.tasks_to_score) >= 1

    def test_score_options_shared_context_optional(self) -> None:
        """Test que shared_context est optionnel."""
        task = common_pb2.PotentialTask(
            id=str(uuid.uuid4()),
            prompt="Valid task prompt with sufficient length"
        )
        
        # Avec shared_context
        request_with_context = reasoning_pb2.ScoreOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            shared_context="Some shared context",
            tasks_to_score=[task]
        )
        assert request_with_context.shared_context == "Some shared context"
        
        # Sans shared_context
        request_without_context = reasoning_pb2.ScoreOptionsRequest(
            request_id=str(uuid.uuid4()),
            mission_id=str(uuid.uuid4()),
            tasks_to_score=[task]
        )
        assert request_without_context.shared_context == ""

    def test_score_options_response_min_items_validation(self) -> None:
        """Test que results respecte min_items = 1."""
        scored_option = reasoning_pb2.ScoredOption(
            score=reasoning_pb2.Score(
                predicted_complexity=0.5,
                predicted_success_probability=0.8,
                predicted_cost=5.0
            ),
            rationale="Valid rationale with sufficient length",
            model_confidence=0.9
        )
        
        result = reasoning_pb2.ScoreResult(
            id=str(uuid.uuid4()),
            success=scored_option
        )
        
        valid_response = reasoning_pb2.ScoreOptionsResponse(
            results=[result]
        )
        assert len(valid_response.results) >= 1

    def test_score_result_id_uuid_validation(self) -> None:
        """Test que ScoreResult.id doit être un UUID valide."""
        scored_option = reasoning_pb2.ScoredOption(
            score=reasoning_pb2.Score(
                predicted_complexity=0.5,
                predicted_success_probability=0.8,
                predicted_cost=5.0
            ),
            rationale="Valid rationale with sufficient length",
            model_confidence=0.9
        )
        
        valid_result = reasoning_pb2.ScoreResult(
            id=str(uuid.uuid4()),
            success=scored_option
        )
        
        # Vérifier que l'ID est un UUID valide
        uuid.UUID(valid_result.id)

    def test_score_result_oneof_required(self) -> None:
        """Test que ScoreResult doit avoir soit success soit error (oneof required)."""
        # Avec success
        scored_option = reasoning_pb2.ScoredOption(
            score=reasoning_pb2.Score(
                predicted_complexity=0.5,
                predicted_success_probability=0.8,
                predicted_cost=5.0
            ),
            rationale="Valid rationale with sufficient length",
            model_confidence=0.9
        )
        
        success_result = reasoning_pb2.ScoreResult(
            id=str(uuid.uuid4()),
            success=scored_option
        )
        assert success_result.HasField('success')
        assert not success_result.HasField('error')
        
        # Avec error
        error_result = reasoning_pb2.ScoreResult(
            id=str(uuid.uuid4()),
            error=common_pb2.Error(
                code=1,
                message="Error message with sufficient length"
            )
        )
        assert error_result.HasField('error')
        assert not error_result.HasField('success')

    def test_scored_option_rationale_min_len(self) -> None:
        """Test que rationale respecte min_len = 10."""
        scored_option = reasoning_pb2.ScoredOption(
            score=reasoning_pb2.Score(
                predicted_complexity=0.5,
                predicted_success_probability=0.8,
                predicted_cost=5.0
            ),
            rationale="This rationale is long enough to pass validation",
            model_confidence=0.9
        )
        
        assert len(scored_option.rationale) >= 10

    def test_scored_option_model_confidence_range(self) -> None:
        """Test que model_confidence respecte la plage [0.0, 1.0]."""
        # Valeurs valides
        valid_confidences: List[float] = [0.0, 0.5, 1.0]
        
        for confidence in valid_confidences:
            scored_option = reasoning_pb2.ScoredOption(
                score=reasoning_pb2.Score(
                    predicted_complexity=0.5,
                    predicted_success_probability=0.8,
                    predicted_cost=5.0
                ),
                rationale="Valid rationale with sufficient length",
                model_confidence=confidence
            )
            assert 0.0 <= scored_option.model_confidence <= 1.0

    def test_potential_task_validation(self) -> None:
        """Test que PotentialTask respecte les contraintes UUID et min_len."""
        # Tâche valide
        valid_task = common_pb2.PotentialTask(
            id=str(uuid.uuid4()),
            prompt="This prompt is definitely long enough to pass validation"
        )
        
        # Vérifier UUID
        uuid.UUID(valid_task.id)
        
        # Vérifier min_len du prompt
        assert len(valid_task.prompt) >= 10
