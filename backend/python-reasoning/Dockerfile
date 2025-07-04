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

# === STAGE 2: Dependencies Builder ===
FROM python:3.12-slim as deps-builder

WORKDIR /app

# Install poetry
RUN pip install poetry
RUN poetry config virtualenvs.create false

# Install API from wheel
COPY --from=api-builder /build/dist/*.whl /tmp/
RUN pip install /tmp/*.whl

# Install ONLY dependencies (no source code for live-reload compatibility)
COPY backend/python-reasoning/pyproject.toml backend/python-reasoning/poetry.lock* ./
RUN poetry install --only=main --no-root

# === STAGE 3: Development Runtime ===
FROM python:3.12-slim

WORKDIR /app

# Copy ONLY installed dependencies (not source code)
COPY --from=deps-builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=deps-builder /usr/local/bin /usr/local/bin

# Source code will be mounted via volume in docker-compose for live-reload
# Set PYTHONPATH to include src directory so Python can find reasoning modules
ENV PYTHONPATH=/app/src

# The gRPC server will be started by main.py
# The port is configured via environment variables in docker-compose.yml
CMD ["python", "src/main.py"]

