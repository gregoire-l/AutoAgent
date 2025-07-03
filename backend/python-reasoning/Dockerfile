# Stage 1: Builder - Install dependencies
FROM python:3.11-slim as builder

WORKDIR /app

# Install poetry for robust dependency management
RUN pip install poetry

# Copy project definition
COPY pyproject.toml poetry.lock* ./

# We must copy the gen/python directory to install it.
COPY gen/python ./gen/python

# Install dependencies into a virtual environment
RUN poetry install --no-root --no-dev


# Stage 2: Final image - Copy installed dependencies and source code
FROM python:3.11-slim

WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /app/.venv /.venv

# Activate the virtual environment for subsequent commands
ENV PATH="/app/.venv/bin:$PATH"

# Copy application source code
COPY src/ ./src

# The gRPC server will be started by main.py
# The port is configured via environment variables in docker-compose.yml
CMD ["python", "src/main.py"]

