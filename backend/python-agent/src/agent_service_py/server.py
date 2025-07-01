import os
import signal
import sys
import time
from concurrent import futures

import grpc
from dotenv import load_dotenv

from autoagent_api import agent_service_pb2_grpc
from agent_service_py.services.agent_service import AgentSessionServiceServicer

_ONE_DAY_IN_SECONDS = 60 * 60 * 24


def serve():
    """Starts the gRPC server and waits for termination."""
    load_dotenv()

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    # Register servicers
    agent_service_pb2_grpc.add_AgentSessionServiceServicer_to_server( # type: ignore
        AgentSessionServiceServicer(), server
    )

    # Get port from environment variables
    port = os.getenv("PYTHON_IA_INTERNAL_GRPC_PORT")
    if not port:
        sys.exit("PYTHON_IA_INTERNAL_GRPC_PORT environment variable not set.")

    server_address = f"[::]:{port}"
    server.add_insecure_port(server_address)

    print(f"🚀 AgentSessionService starting on {server_address}")
    server.start()

    # Graceful shutdown handling
    def handle_shutdown(signum, frame):
        print("SIGTERM received, shutting down gracefully...")
        server.stop(10).wait()  # 10-second grace period
        print("Server shut down.")

    signal.signal(signal.SIGTERM, handle_shutdown)
    signal.signal(signal.SIGINT, handle_shutdown)

    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        print("KeyboardInterrupt received, shutting down...")
        server.stop(0)


if __name__ == "__main__":
    serve()
