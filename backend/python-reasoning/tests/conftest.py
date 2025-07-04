"""
Fixtures communes pour tous les tests du service Reasoning.
Intègre les approches unitaires, gRPC, Docker et Buf.
Version strictement typée pour Pylance strict mode.
"""
import os
import uuid
from typing import Generator, Tuple
import pytest
import grpc
from concurrent import futures
from unittest.mock import Mock

# Type ignores pour les packages sans stubs
from testcontainers.compose import DockerCompose  # type: ignore[import-untyped]

import autoagent_api.reasoning_service_pb2 as reasoning_pb2
import autoagent_api.reasoning_service_pb2_grpc as reasoning_grpc
import autoagent_api.common_pb2 as common_pb2
from reasoning_service_py.services.reasoning_service import ReasoningServiceServicer  # type: ignore[import-untyped]


# =============================================================================
# Fixtures Tests Unitaires
# =============================================================================

@pytest.fixture
def mock_grpc_context() -> Mock:
    """Mock du contexte gRPC pour tests unitaires."""
    context = Mock(spec=grpc.ServicerContext)
    return context


@pytest.fixture
def valid_uuid() -> str:
    """UUID valide pour les tests."""
    return str(uuid.uuid4())


@pytest.fixture
def reasoning_servicer() -> ReasoningServiceServicer:
    """Instance du servicer pour tests unitaires."""
    return ReasoningServiceServicer()


# =============================================================================
# Fixtures Messages Protobuf
# =============================================================================

@pytest.fixture
def valid_potential_task() -> common_pb2.PotentialTask:
    """Tâche potentielle valide pour les tests."""
    return common_pb2.PotentialTask(
        id=str(uuid.uuid4()),
        prompt="Write a comprehensive test suite for the gRPC service"
    )


@pytest.fixture
def valid_generate_options_request(valid_uuid: str) -> reasoning_pb2.GenerateOptionsRequest:
    """Requête GenerateOptions valide."""
    return reasoning_pb2.GenerateOptionsRequest(
        request_id=valid_uuid,
        mission_id=str(uuid.uuid4()),
        current_task_prompt="Implement a new feature for the system",
        factual_context="The system is a microservices architecture",
        generation_directive="Generate practical implementation tasks"
    )


@pytest.fixture
def valid_score_options_request(
    valid_uuid: str, 
    valid_potential_task: common_pb2.PotentialTask
) -> reasoning_pb2.ScoreOptionsRequest:
    """Requête ScoreOptions valide."""
    return reasoning_pb2.ScoreOptionsRequest(
        request_id=valid_uuid,
        mission_id=str(uuid.uuid4()),
        shared_context="Development environment with Python 3.11",
        tasks_to_score=[valid_potential_task]
    )


# =============================================================================
# Fixtures Tests gRPC Intégration
# =============================================================================

@pytest.fixture(scope="module")
def grpc_server() -> Generator[Tuple[grpc.Server, int], None, None]:
    """Serveur gRPC de test avec port dynamique."""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    reasoning_grpc.add_ReasoningServiceServicer_to_server(
        ReasoningServiceServicer(), server
    )
    
    # Port dynamique pour éviter les conflits
    port = server.add_insecure_port('[::]:0')
    server.start()
    
    yield server, port
    
    server.stop(grace=0)


@pytest.fixture(scope="module")
def grpc_channel(grpc_server: Tuple[grpc.Server, int]) -> Generator[grpc.Channel, None, None]:
    """Canal gRPC configuré pour les tests."""
    server, port = grpc_server
    channel = grpc.insecure_channel(f'localhost:{port}')
    yield channel
    channel.close()


@pytest.fixture(scope="module")
def grpc_stub(grpc_channel: grpc.Channel) -> reasoning_grpc.ReasoningServiceStub:
    """Stub gRPC pour les tests d'intégration."""
    return reasoning_grpc.ReasoningServiceStub(grpc_channel)


# =============================================================================
# Fixtures Tests Docker
# =============================================================================

@pytest.fixture(scope="session")
def docker_services() -> Generator[DockerCompose, None, None]:  # type: ignore[type-arg]
    """Services Docker pour tests d'intégration."""
    compose_file_path = os.path.join(
        os.path.dirname(__file__), "docker", "docker-compose.test.yml"
    )
    
    with DockerCompose(os.path.dirname(compose_file_path), compose_file_name="docker-compose.test.yml") as compose:
        # Attendre que les services soient prêts
        compose.wait_for("http://localhost:50052/health")  # type: ignore[attr-defined]
        yield compose


@pytest.fixture
def docker_reasoning_channel(docker_services: DockerCompose) -> Generator[grpc.Channel, None, None]:  # type: ignore[type-arg]
    """Canal gRPC vers le service Reasoning dans Docker."""
    channel = grpc.insecure_channel('localhost:50052')
    yield channel
    channel.close()


@pytest.fixture
def docker_reasoning_stub(docker_reasoning_channel: grpc.Channel) -> reasoning_grpc.ReasoningServiceStub:
    """Stub gRPC vers le service Reasoning dans Docker."""
    return reasoning_grpc.ReasoningServiceStub(docker_reasoning_channel)


# =============================================================================
# Fixtures Tests Buf Validation
# =============================================================================

@pytest.fixture
def invalid_uuid_request() -> reasoning_pb2.GenerateOptionsRequest:
    """Requête avec UUID invalide pour tests de validation."""
    return reasoning_pb2.GenerateOptionsRequest(
        request_id="invalid-uuid",  # UUID invalide
        mission_id="also-invalid",  # UUID invalide
        current_task_prompt="Valid prompt with sufficient length",
        generation_directive="Valid directive with sufficient length"
    )


@pytest.fixture
def invalid_min_len_request() -> reasoning_pb2.GenerateOptionsRequest:
    """Requête avec champs trop courts pour tests de validation."""
    return reasoning_pb2.GenerateOptionsRequest(
        request_id=str(uuid.uuid4()),
        mission_id=str(uuid.uuid4()),
        current_task_prompt="short",  # Trop court (min_len = 10)
        generation_directive="short"  # Trop court (min_len = 10)
    )


@pytest.fixture
def empty_tasks_request(valid_uuid: str) -> reasoning_pb2.ScoreOptionsRequest:
    """Requête ScoreOptions avec liste vide (invalide)."""
    return reasoning_pb2.ScoreOptionsRequest(
        request_id=valid_uuid,
        mission_id=str(uuid.uuid4()),
        shared_context="Valid context",
        tasks_to_score=[]  # Liste vide (min_items = 1)
    )
