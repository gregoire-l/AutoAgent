import logging
import os
import sys
import time
from concurrent import futures

import grpc
from dotenv import load_dotenv

from autoagent_api import agent_service_pb2_grpc
from agent_service_py.services.agent_service import AgentSessionServiceServicer

_ONE_DAY_IN_SECONDS = 60 * 60 * 24

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)



def serve():
    """Starts the gRPC server and waits for termination."""
    load_dotenv()

    server: grpc.Server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    # Register servicers
    agent_service_pb2_grpc.add_AgentSessionServiceServicer_to_server( # type: ignore
        AgentSessionServiceServicer(), server
    )

    # Get port from environment variables
    port = os.getenv("PYTHON_AGENT_INTERNAL_GRPC_PORT")
    if not port:
        logging.error("ERROR: PYTHON_AGENT_INTERNAL_GRPC_PORT environment variable not set.")
        sys.exit(1)

    # Validate port is a valid integer
    try:
        port_int = int(port)
        if port_int <= 0 or port_int > 65535:
            raise ValueError("Port must be between 1 and 65535")
    except ValueError as e:
        logging.error(f"ERROR: Invalid port value '{port}': {e}")
        sys.exit(1)

    server_address = f"[::]:{port_int}"
    server.add_insecure_port(server_address)

    logging.info(f"🚀 AgentSessionService starting on {server_address}")
    server.start()

    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        print("KeyboardInterrupt received, shutting down...")
        server.stop(3)
        print("Server shut down.")
        sys.exit(0)



if __name__ == "__main__":
    serve()
