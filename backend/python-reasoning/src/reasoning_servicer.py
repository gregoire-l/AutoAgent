import logging
import random
import uuid
from typing import List

import grpc
from autoagent_api import common_pb2, reasoning_service_pb2, reasoning_service_pb2_grpc


class ReasoningServiceServicer(reasoning_service_pb2_grpc.ReasoningServiceServicer):
    """
    Implements the ReasoningService gRPC service.
    This is a Phase 0 placeholder implementation.
    """

    def GenerateOptions(
        self,
        request: reasoning_service_pb2.GenerateOptionsRequest,
        context: grpc.ServicerContext,
    ) -> reasoning_service_pb2.GenerateOptionsResponse:
        """
        Generates a hardcoded list of potential tasks as a placeholder.
        """
        logging.info(f"Received GenerateOptions request: {request.request_id}")

        # Phase 0: Return a hardcoded list of tasks
        potential_tasks = [
            common_pb2.PotentialTask(
                id=str(uuid.uuid4()), prompt="Write a 'hello_world.py' script."
            ),
            common_pb2.PotentialTask(
                id=str(uuid.uuid4()), prompt="List files in the current directory."
            ),
        ]

        return reasoning_service_pb2.GenerateOptionsResponse(
            potential_tasks=potential_tasks
        )

    def ScoreOptions(
        self,
        request: reasoning_service_pb2.ScoreOptionsRequest,
        context: grpc.ServicerContext,
    ) -> reasoning_service_pb2.ScoreOptionsResponse:
        """
        Scores a list of potential tasks with random scores as a placeholder.
        """
        logging.info(f"Received ScoreOptions request: {request.request_id}")

        results: List[reasoning_service_pb2.ScoreResult] = []
        for task in request.tasks_to_score:
            # Phase 0: Return random scores
            score = reasoning_service_pb2.Score(
                predicted_complexity=random.uniform(0.1, 0.9),
                predicted_success_probability=random.uniform(0.5, 1.0),
                predicted_cost=random.uniform(1, 10),
            )
            scored_option = reasoning_service_pb2.ScoredOption(
                score=score,
                rationale="Placeholder rationale based on random scoring.",
                model_confidence=random.uniform(0.5, 1.0),
            )
            score_result = reasoning_service_pb2.ScoreResult(
                id=task.id, success=scored_option
            )
            results.append(score_result)

        return reasoning_service_pb2.ScoreOptionsResponse(results=results)
