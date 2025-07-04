import logging
import os
import sys
import time
from concurrent import futures

from autoagent_api import reasoning_service_pb2_grpc
import grpc

from dotenv import load_dotenv
from reasoning_service_py.services.reasoning_service import ReasoningServiceServicer

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def serve():
    """Starts the gRPC server."""
    load_dotenv()

    port = os.getenv("PYTHON_IA_INTERNAL_GRPC_PORT", "50052")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    reasoning_service_pb2_grpc.add_ReasoningServiceServicer_to_server( # type: ignore
        ReasoningServiceServicer(), server
    )

    server.add_insecure_port(f"[::]:{port}")
    server.start()
    logging.info(f"Reasoning Service server started on port {port}")
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)
        logging.info("Server stopped")
        sys.exit(0)


if __name__ == "__main__":
    serve()
