package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Config holds all configuration for the go-core service
type Config struct {
	Server           ServerConfig           `json:"server"`
	ReasoningService ReasoningServiceConfig `json:"reasoning_service"`
	AgentService     AgentServiceConfig     `json:"agent_service"`
	Neo4j            Neo4jConfig            `json:"neo4j"`
	Temporal         TemporalConfig         `json:"temporal"`
}

// ServerConfig holds server-specific configuration
type ServerConfig struct {
	Port string `json:"port"`
}

// ReasoningServiceConfig holds configuration for the Python Reasoning Service
type ReasoningServiceConfig struct {
	Host string `json:"host"`
	Port string `json:"port"`
}

// AgentServiceConfig holds configuration for the Python Agent Service
type AgentServiceConfig struct {
	Host string `json:"host"`
	Port string `json:"port"`
}

// Neo4jConfig holds configuration for Neo4j database
type Neo4jConfig struct {
	URI      string `json:"uri"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// TemporalConfig holds configuration for Temporal
type TemporalConfig struct {
	HostPort  string `json:"host_port"`
	Namespace string `json:"namespace"`
	TaskQueue string `json:"task_queue"`
}

// Load loads configuration from environment variables with sensible defaults
func Load() (*Config, error) {
	config := &Config{
		Server: ServerConfig{
			Port: getEnvWithDefault("GO_CORE_GRPC_PORT", "50051"),
		},
		ReasoningService: ReasoningServiceConfig{
			Host: getEnvWithDefault("PYTHON_REASONING_HOST", "python-reasoning"),
			Port: getEnvWithDefault("PYTHON_REASONING_GRPC_PORT", "50052"),
		},
		AgentService: AgentServiceConfig{
			Host: getEnvWithDefault("PYTHON_AGENT_HOST", "python-agent"),
			Port: getEnvWithDefault("PYTHON_AGENT_GRPC_PORT", "50053"),
		},
		Neo4j: Neo4jConfig{
			URI:      getEnvWithDefault("NEO4J_BOLT_URL", "bolt://neo4j:7687"),
			Username: getEnvWithDefault("NEO4J_USER", "neo4j"),
			Password: getEnvWithDefault("NEO4J_PASSWORD", "password"),
		},
		Temporal: TemporalConfig{
			HostPort:  getEnvWithDefault("TEMPORAL_GRPC_ENDPOINT", "temporal:7233"),
			Namespace: getEnvWithDefault("TEMPORAL_NAMESPACE", "default"),
			TaskQueue: getEnvWithDefault("TEMPORAL_TASK_QUEUE", "autoagent-mission-queue"),
		},
	}

	// Validate required configuration
	if err := config.validate(); err != nil {
		return nil, fmt.Errorf("configuration validation failed: %w", err)
	}

	return config, nil
}

// validate ensures all required configuration is present and valid
func (c *Config) validate() error {
	var errors []string

	// Validate server configuration
	if c.Server.Port == "" {
		errors = append(errors, "server port is required")
	}
	if port, err := strconv.Atoi(c.Server.Port); err != nil || port <= 0 || port > 65535 {
		errors = append(errors, "server port must be a valid port number (1-65535)")
	}

	// Validate reasoning service configuration
	if c.ReasoningService.Host == "" {
		errors = append(errors, "reasoning service host is required")
	}
	if c.ReasoningService.Port == "" {
		errors = append(errors, "reasoning service port is required")
	}

	// Validate agent service configuration
	if c.AgentService.Host == "" {
		errors = append(errors, "agent service host is required")
	}
	if c.AgentService.Port == "" {
		errors = append(errors, "agent service port is required")
	}

	// Validate Neo4j configuration
	if c.Neo4j.URI == "" {
		errors = append(errors, "Neo4j URI is required")
	}
	if c.Neo4j.Username == "" {
		errors = append(errors, "Neo4j username is required")
	}
	if c.Neo4j.Password == "" {
		errors = append(errors, "Neo4j password is required")
	}

	// Validate Temporal configuration
	if c.Temporal.HostPort == "" {
		errors = append(errors, "Temporal host:port is required")
	}
	if c.Temporal.Namespace == "" {
		errors = append(errors, "Temporal namespace is required")
	}
	if c.Temporal.TaskQueue == "" {
		errors = append(errors, "Temporal task queue is required")
	}

	if len(errors) > 0 {
		return fmt.Errorf("validation errors: %s", strings.Join(errors, "; "))
	}

	return nil
}

// getEnvWithDefault returns the value of the environment variable or the default value if not set
func getEnvWithDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// GetReasoningServiceAddress returns the full address for the reasoning service
func (c *Config) GetReasoningServiceAddress() string {
	return fmt.Sprintf("%s:%s", c.ReasoningService.Host, c.ReasoningService.Port)
}

// GetAgentServiceAddress returns the full address for the agent service
func (c *Config) GetAgentServiceAddress() string {
	return fmt.Sprintf("%s:%s", c.AgentService.Host, c.AgentService.Port)
}

// GetServerAddress returns the full address for the server
func (c *Config) GetServerAddress() string {
	return fmt.Sprintf(":%s", c.Server.Port)
}
