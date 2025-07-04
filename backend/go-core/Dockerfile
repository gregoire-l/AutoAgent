
# --- Builder Stage ---
# Use a specific Go version. Alpine is used for smaller image size.
FROM golang:1.22-alpine AS builder

# Set working directory
WORKDIR /app

# Install build tools if necessary (e.g., git for private modules)
# RUN apk add --no-cache git

# Copy go.mod and go.sum first to leverage Docker cache for dependencies
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# Copy the entire source code
COPY . .

# Build the Go application
# Build from the cmd/server directory where main.go is located
# CGO_ENABLED=0 for static binary, GOOS/GOARCH for cross-compilation if needed.
RUN CGO_ENABLED=0 go build -v -o /app/go-core-server ./cmd/server

# --- Final Stage ---
# Use a minimal base image for the final application
FROM alpine:latest

# It's good practice to run as a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copy only the built application binary from the builder stage
COPY --from=builder /app/go-core-server /app/go-core-server

# Expose the gRPC port (defined by GO_CORE_INTERNAL_GRPC_PORT in docker-compose)
# This EXPOSE instruction is for documentation; actual port mapping is in docker-compose.yml
# EXPOSE 50051

# Command to run the application
# The port should be configurable via environment variable if your app supports it.
CMD ["/app/go-core-server"]
