import subprocess
import uuid
from typing import Iterable

import autoagent.api.agent_service_pb2 as agent_pb2
import autoagent.api.agent_service_pb2_grpc as agent_grpc
import autoagent.api.common_pb2 as common_pb2


class AgentSessionServiceServicer(agent_grpc.AgentSessionServiceServicer):
    """
    Implements the "stupid" logic for the Agent Session Service for Phase 0.
    """

    def StartSession(
        self,
        request: agent_pb2.StartSessionRequest,
        context,
    ) -> agent_pb2.StartSessionResponse:
        """
        Doesn't start a sandbox yet. Returns a random UUID as session_id.
        """
        session_id = str(uuid.uuid4())
        print(f"Started session: {session_id}")
        return agent_pb2.StartSessionResponse(session_id=session_id)

    def ExecuteStep(
        self,
        request_iterator: Iterable[agent_pb2.ExecuteStepRequest],
        context,
    ) -> agent_pb2.ExecuteStepResponse:
        """
        Ignores the directive. Executes a hardcoded 'echo' command.
        This is a client-streaming RPC, but for Phase 0, we only read the first message.
        """
        request = next(request_iterator)
        print(f"Executing step for session: {request.session_id}")
        
        # Phase 0: Execute a simple, hardcoded command.
        command = 'echo "Hello World from Phase 0 Agent"'

        try:
            # Execute the command
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                check=True,  # This will raise CalledProcessError if return code is non-zero
                timeout=10, # Add a timeout for safety
            )

            # Create a successful step result
            step_result = agent_pb2.StepResult(
                final_status=agent_pb2.FinalStatus.FINAL_STATUS_SUCCESS,
                summary=f"Command executed successfully: {command}",
                stdout=result.stdout,
                stderr=result.stderr,
                exit_code=result.returncode,
            )

        except subprocess.CalledProcessError as e:
            # Create a failed step result
            step_result = agent_pb2.StepResult(
                final_status=agent_pb2.FinalStatus.FINAL_STATUS_ERROR,
                summary=f"Command failed: {command}",
                stdout=e.stdout,
                stderr=e.stderr,
                exit_code=e.returncode,
            )
        except subprocess.TimeoutExpired as e:
            # Handle timeout
            step_result = agent_pb2.StepResult(
                final_status=agent_pb2.FinalStatus.FINAL_STATUS_ERROR,
                summary=f"Command timed out: {command}",
                stdout=e.stdout or "",
                stderr=e.stderr or "Timeout expired.",
                exit_code=-1, # Convention for timeout
            )

        return agent_pb2.ExecuteStepResponse(result=step_result)

    def StopSession(
        self,
        request: agent_pb2.StopSessionRequest,
        context,
    ) -> agent_pb2.StopSessionResponse:
        """
        Does nothing for now. Returns an empty response.
        """
        print(f"Stopping session: {request.session_id}")
        return agent_pb2.StopSessionResponse()
