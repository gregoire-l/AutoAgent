import subprocess
import uuid
from typing import Iterator

import grpc
import autoagent_api.agent_service_pb2 as agent_pb2
import autoagent_api.agent_service_pb2_grpc as agent_grpc
import autoagent_api.common_pb2 as common_pb2


class AgentSessionServiceServicer(agent_grpc.AgentSessionServiceServicer):
    """
    Implements the "stupid" logic for the Agent Session Service for Phase 0.
    """

    def StartSession(
        self,
        request: agent_pb2.StartSessionRequest,
        context: grpc.ServicerContext,
    ) -> agent_pb2.StartSessionResponse:
        """
        Doesn't start a sandbox yet. Returns a random UUID as session_id.
        """
        session_id = str(uuid.uuid4())
        print(f"Started session: {session_id}")
        return agent_pb2.StartSessionResponse(session_id=session_id)

    def ExecuteStep(
        self,
        request_iterator: Iterator[agent_pb2.ExecuteStepRequest],
        context: grpc.ServicerContext,
    ) -> agent_pb2.ExecuteStepResponse:
        """
        Ignores the directive. Executes a hardcoded 'echo' command.
        This is a client-streaming RPC, but for Phase 0, we only read the first message.
        """
        request: agent_pb2.ExecuteStepRequest = next(request_iterator)
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
                status=common_pb2.EXECUTION_STATUS_SUCCESS,
                summary=f"Command executed successfully: {command}",
                last_stdout=result.stdout,
                last_stderr=result.stderr,
            )

        except subprocess.CalledProcessError as e:
            # Create a failed step result
            step_result = agent_pb2.StepResult(
                status=common_pb2.EXECUTION_STATUS_FAILURE,
                summary=f"Command failed: {command}",
                last_stdout=e.stdout,
                last_stderr=e.stderr,
            )
        except subprocess.TimeoutExpired as e:
            # Handle timeout

            if e.stdout:
                last_stdout = e.stdout.decode('utf-8')
            else:
                last_stdout = "Timeout expired."
            if e.stderr:
                last_stderr = e.stderr.decode('utf-8')
            else:
                last_stderr = "Timeout expired."

            step_result = agent_pb2.StepResult(
                status=common_pb2.EXECUTION_STATUS_TIMEOUT,
                summary=f"Command timed out: {command}",
                last_stdout=last_stdout,
                last_stderr=last_stderr,
            )

        return agent_pb2.ExecuteStepResponse(result=step_result)

    def StopSession(
        self,
        request: agent_pb2.StopSessionRequest,
        context: grpc.ServicerContext,
    ) -> agent_pb2.StopSessionResponse:
        """
        Does nothing for now. Returns an empty response.
        """
        print(f"Stopping session: {request.session_id}")
        return agent_pb2.StopSessionResponse()
