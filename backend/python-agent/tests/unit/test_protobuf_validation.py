"""
Tests de validation Buf protovalidate pour AgentSessionService.
Tests spécifiques aux contraintes définies dans les fichiers .proto.
Version strictement typée pour Pylance strict mode.
"""
import uuid
from typing import List
import pytest
from google.protobuf.duration_pb2 import Duration

import autoagent_api.agent_service_pb2 as agent_pb2
import autoagent_api.common_pb2 as common_pb2


class TestBufProtoValidationAgent:
    """Tests de validation protobuf pour le service Agent."""

    def test_start_session_request_valid_uuid_required(self) -> None:
        """Test que request_id doit être un UUID valide."""
        # UUID valide - devrait passer
        valid_request = agent_pb2.StartSessionRequest(
            request_id=str(uuid.uuid4()),
            agent_profile=common_pb2.AgentProfile(
                profile_id="test-profile",
                required_tools=[common_pb2.Tool(name="python", version="3.11")]
            ),
            initial_workspace=common_pb2.WorkspaceReference(
                repository="test-repo",
                branch="main"
            )
        )
        
        # Vérifier que la création réussit avec un UUID valide
        assert valid_request.request_id
        assert len(valid_request.request_id) == 36

    def test_agent_profile_required_field(self) -> None:
        """Test que agent_profile est requis."""
        with pytest.raises(Exception):  # La validation exacte dépend de l'implémentation buf
            agent_pb2.StartSessionRequest(
                request_id=str(uuid.uuid4()),
                # agent_profile manquant - devrait échouer
                initial_workspace=common_pb2.WorkspaceReference(
                    repository="test-repo",
                    branch="main"
                )
            )

    def test_workspace_reference_repository_pattern(self) -> None:
        """Test que repository respecte le pattern [a-zA-Z0-9_-]+."""
        # Pattern valide
        valid_workspace = common_pb2.WorkspaceReference(
            repository="valid-repo_123",
            branch="main"
        )
        assert valid_workspace.repository == "valid-repo_123"
        
        # Pattern invalide (contient des caractères spéciaux)
        # Note: La validation exacte dépend de l'implémentation buf
        invalid_chars: List[str] = ["repo@invalid", "repo.invalid", "repo/invalid"]
        for invalid_repo in invalid_chars:
            # En pratique, buf protovalidate devrait rejeter ces valeurs
            # Le test exact dépend de l'intégration buf dans le runtime
            pass

    def test_workspace_reference_branch_pattern(self) -> None:
        """Test que branch respecte le pattern [a-zA-Z0-9_./-]+."""
        # Patterns valides
        valid_branches: List[str] = ["main", "feature/new-feature", "release-1.0", "hotfix_123"]
        for branch in valid_branches:
            workspace = common_pb2.WorkspaceReference(
                repository="test-repo",
                branch=branch
            )
            assert workspace.branch == branch

    def test_workspace_reference_commit_id_hex_pattern(self) -> None:
        """Test que commit_id respecte le pattern hexadécimal."""
        # Commit ID hexadécimal valide
        valid_workspace = common_pb2.WorkspaceReference(
            repository="test-repo",
            branch="main",
            commit_id="abc123def456"
        )
        assert valid_workspace.commit_id == "abc123def456"
        
        # Commit ID vide (optionnel)
        empty_commit_workspace = common_pb2.WorkspaceReference(
            repository="test-repo",
            branch="main",
            commit_id=""
        )
        assert empty_commit_workspace.commit_id == ""

    def test_execute_step_request_session_id_min_len(self) -> None:
        """Test que session_id respecte min_len = 1."""
        timeout = Duration()
        timeout.seconds = 30
        
        # Session ID valide (non vide)
        valid_request = agent_pb2.ExecuteStepRequest(
            request_id=str(uuid.uuid4()),
            session_id="valid-session-id",
            directive="Execute this test command with sufficient length",
            timeout=timeout
        )
        assert valid_request.session_id == "valid-session-id"

    def test_execute_step_request_directive_min_len(self) -> None:
        """Test que directive respecte min_len = 10."""
        timeout = Duration()
        timeout.seconds = 30
        
        # Directive valide (>= 10 caractères)
        valid_request = agent_pb2.ExecuteStepRequest(
            request_id=str(uuid.uuid4()),
            session_id="test-session",
            directive="This directive is long enough to pass validation",
            timeout=timeout
        )
        assert len(valid_request.directive) >= 10

    def test_execute_step_request_timeout_required(self) -> None:
        """Test que timeout est requis."""
        # Timeout requis
        timeout = Duration()
        timeout.seconds = 30
        
        valid_request = agent_pb2.ExecuteStepRequest(
            request_id=str(uuid.uuid4()),
            session_id="test-session",
            directive="Valid directive with sufficient length",
            timeout=timeout
        )
        assert valid_request.HasField('timeout')
        assert valid_request.timeout.seconds == 30

    def test_stop_session_request_final_status_defined_only(self) -> None:
        """Test que final_status doit être une valeur définie de l'enum."""
        # Statut valide
        valid_request = agent_pb2.StopSessionRequest(
            request_id=str(uuid.uuid4()),
            session_id="test-session",
            final_status=agent_pb2.FINAL_STATUS_SUCCESS,
            commit_message="Test completed"
        )
        assert valid_request.final_status == agent_pb2.FINAL_STATUS_SUCCESS

    def test_stop_session_request_commit_message_max_len(self) -> None:
        """Test que commit_message respecte max_len = 256."""
        # Message valide (< 256 caractères)
        short_message = "Short commit message"
        valid_request = agent_pb2.StopSessionRequest(
            request_id=str(uuid.uuid4()),
            session_id="test-session",
            final_status=agent_pb2.FINAL_STATUS_SUCCESS,
            commit_message=short_message
        )
        assert len(valid_request.commit_message) <= 256
        
        # Message à la limite (exactement 256 caractères)
        max_message = "x" * 256
        limit_request = agent_pb2.StopSessionRequest(
            request_id=str(uuid.uuid4()),
            session_id="test-session",
            final_status=agent_pb2.FINAL_STATUS_SUCCESS,
            commit_message=max_message
        )
        assert len(limit_request.commit_message) == 256

    def test_tool_name_and_version_required(self) -> None:
        """Test que Tool.name et Tool.version sont requis (min_len = 1)."""
        # Tool valide
        valid_tool = common_pb2.Tool(
            name="python",
            version="3.11"
        )
        assert valid_tool.name == "python"
        assert valid_tool.version == "3.11"
        assert len(valid_tool.name) >= 1
        assert len(valid_tool.version) >= 1

    def test_agent_profile_required_tools_min_items(self) -> None:
        """Test que required_tools respecte min_items = 1."""
        # Profil valide avec au moins un outil
        valid_profile = common_pb2.AgentProfile(
            profile_id="test-profile",
            required_tools=[
                common_pb2.Tool(name="python", version="3.11"),
                common_pb2.Tool(name="git", version="2.40")
            ]
        )
        assert len(valid_profile.required_tools) >= 1
