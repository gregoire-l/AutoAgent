FROM python:3.11-slim

WORKDIR /app

# Add generated protobuf code to PYTHONPATH for imports to work correctly.
ENV PYTHONPATH "${PYTHONPATH}:/app/gen/python"

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code.
# In development, this will be overlaid by a volume mount from docker-compose.
COPY src/ ./src

# The gRPC server will be started by main.py
# The port is configured via environment variables in docker-compose.yml
CMD ["python", "src/main.py"]
