# === STAGE 1: API Builder ===
FROM python:3.12-slim as api-builder

WORKDIR /build

# Install poetry
RUN pip install poetry

# Copy API package files
COPY gen/python/pyproject.toml gen/python/poetry.lock* ./
COPY gen/python/ ./

# Build API as wheel for reuse
RUN poetry build -f wheel

# === STAGE 2: Service Builder ===
FROM python:3.12-slim as service-builder

WORKDIR /app

# Install poetry
RUN pip install poetry
RUN poetry config virtualenvs.create false

# Install API from wheel (no Poetry dependency resolution needed)
COPY --from=api-builder /build/dist/*.whl /tmp/
RUN pip install /tmp/*.whl

# Copy service files and install dependencies
COPY backend/python-agent/pyproject.toml backend/python-agent/poetry.lock* ./
RUN poetry install --only=main --no-root

# === STAGE 3: Runtime ===
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages from service builder
COPY --from=service-builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=service-builder /usr/local/bin /usr/local/bin

# Copy application source code
COPY backend/python-agent/src/ ./src

# Set the entrypoint to run the server module
CMD ["python", "-m", "agent_service_py.server"]
