
# --- Base Stage with Python and Dependencies ---
# Use a specific Python version. Slim variant for smaller size.
FROM python:3.11-slim AS python-base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on
ENV PIP_DEFAULT_TIMEOUT 100

# Set working directory
WORKDIR /app

# Install system dependencies if any (e.g., for certain Python packages)
# RUN apt-get update && apt-get install -y --no-install-recommends some-package && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
# Consider using a virtual environment within the Docker image for better isolation,
# though for simple services, direct installation is common.
RUN pip install --no-cache-dir -r requirements.txt

# --- Final Stage ---
# Can be the same as python-base if no further build steps are needed,
# or a new minimal image if you want to copy artifacts.
FROM python-base AS final

# It's good practice to run as a non-root user
# Create a non-root user and group
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

WORKDIR /app

# Copy the application source code
# If you installed into a virtualenv in the base stage, ensure it's copied or on PATH.
COPY . .

# Expose the gRPC port (defined by PYTHON_IA_INTERNAL_GRPC_PORT in docker-compose)
# This EXPOSE instruction is for documentation; actual port mapping is in docker-compose.yml
# EXPOSE 50052

# Command to run the application
# Replace 'main.py' with your actual entrypoint script.
# If using a web server like Uvicorn for an ASGI/WSGI app (though gRPC is different):
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "50052"]
# For a typical Python gRPC server started via script:
CMD ["python", "main.py"]
