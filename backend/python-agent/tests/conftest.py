"""
Fixtures communes pour tous les tests du service Agent.
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

import autoagent_api.agent_service_pb2 as agent_pb2
import autoagent_api.agent_service_pb2_grpc as agent_grpc
import autoagent_api.common_pb2 as common_pb2
from agent_service_py.services.agent_service import AgentSessionServiceServicer  # type: ignore[import-untyped]


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
def agent_servicer() -> AgentSessionServiceServicer:
    """Instance du servicer pour tests unitaires."""
    return AgentSessionServiceServicer()


# =============================================================================
# Fixtures Messages Protobuf
# =============================================================================

@pytest.fixture
def valid_agent_profile() -> common_pb2.AgentProfile:
    """Profil d'agent valide pour les tests."""
    return common_pb2.AgentProfile(
        profile_id="test-profile",
        required_tools=[
            common_pb2.Tool(name="python", version="3.11"),
            common_pb2.Tool(name="git", version="2.40")
        ]
    )


@pytest.fixture
def valid_workspace_reference() -> common_pb2.WorkspaceReference:
    """Référence workspace valide pour les tests."""
    return common_pb2.WorkspaceReference(
        repository="test-repo",
        branch="main",
        commit_id="abc123def456"
    )


@pytest.fixture
def valid_start_session_request(
    valid_uuid: str, 
    valid_agent_profile: common_pb2.AgentProfile, 
    valid_workspace_reference: common_pb2.WorkspaceReference
) -> agent_pb2.StartSessionRequest:
    """Requête StartSession valide."""
    return agent_pb2.StartSessionRequest(
        request_id=valid_uuid,
        agent_profile=valid_agent_profile,
        initial_workspace=valid_workspace_reference
    )


@pytest.fixture
def valid_execute_step_request(valid_uuid: str) -> agent_pb2.ExecuteStepRequest:
    """Requête ExecuteStep valide."""
    from google.protobuf.duration_pb2 import Duration
    timeout = Duration()
    timeout.seconds = 30
    
    return agent_pb2.ExecuteStepRequest(
        request_id=valid_uuid,
        session_id="test-session-123",
        directive="Execute a simple test command",
        timeout=timeout
    )


@pytest.fixture
def valid_stop_session_request(valid_uuid: str) -> agent_pb2.StopSessionRequest:
    """Requête StopSession valide."""
    return agent_pb2.StopSessionRequest(
        request_id=valid_uuid,
        session_id="test-session-123",
        final_status=agent_pb2.FINAL_STATUS_SUCCESS,
        commit_message="Test completed successfully"
    )


# =============================================================================
# Fixtures Tests gRPC Intégration
# =============================================================================

@pytest.fixture(scope="module")
def grpc_server() -> Generator[Tuple[grpc.Server, int], None, None]:
    """Serveur gRPC de test avec port dynamique."""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    agent_grpc.add_AgentSessionServiceServicer_to_server(
        AgentSessionServiceServicer(), server
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
def grpc_stub(grpc_channel: grpc.Channel) -> agent_grpc.AgentSessionServiceStub:
    """Stub gRPC pour les tests d'intégration."""
    return agent_grpc.AgentSessionServiceStub(grpc_channel)


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
        compose.wait_for("http://localhost:50051/health")  # type: ignore[attr-defined]
        yield compose


@pytest.fixture
def docker_agent_channel(docker_services: DockerCompose) -> Generator[grpc.Channel, None, None]:  # type: ignore[type-arg]
    """Canal gRPC vers le service Agent dans Docker."""
    channel = grpc.insecure_channel('localhost:50051')
    yield channel
    channel.close()


@pytest.fixture
def docker_agent_stub(docker_agent_channel: grpc.Channel) -> agent_grpc.AgentSessionServiceStub:
    """Stub gRPC vers le service Agent dans Docker."""
    return agent_grpc.AgentSessionServiceStub(docker_agent_channel)


# =============================================================================
# Fixtures Tests Buf Validation
# =============================================================================

@pytest.fixture
def invalid_uuid_request() -> agent_pb2.StartSessionRequest:
    """Requête avec UUID invalide pour tests de validation."""
    return agent_pb2.StartSessionRequest(
        request_id="invalid-uuid",  # UUID invalide
        agent_profile=common_pb2.AgentProfile(
            profile_id="test",
            required_tools=[common_pb2.Tool(name="python", version="3.11")]
        ),
        initial_workspace=common_pb2.WorkspaceReference(
            repository="test-repo",
            branch="main"
        )
    )


@pytest.fixture
def invalid_min_len_request() -> agent_pb2.ExecuteStepRequest:
    """Requête avec champs trop courts pour tests de validation."""
    return agent_pb2.ExecuteStepRequest(
        request_id=str(uuid.uuid4()),
        session_id="",  # Trop court (min_len = 1)
        directive="short",  # Trop court (min_len = 10)
        timeout=None  # Requis mais manquant
    )
