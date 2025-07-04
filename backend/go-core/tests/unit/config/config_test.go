package config_test

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"autoagent/go-core/internal/config"
)

// ConfigTestSuite groups all configuration-related tests
type ConfigTestSuite struct {
	suite.Suite
	originalEnv map[string]string
}

// SetupTest saves original environment variables
func (suite *ConfigTestSuite) SetupTest() {
	suite.originalEnv = make(map[string]string)

	// Save original values of environment variables we'll modify
	envVars := []string{
		"GO_CORE_GRPC_PORT",
		"PYTHON_REASONING_HOST",
		"PYTHON_REASONING_GRPC_PORT",
		"PYTHON_AGENT_HOST",
		"PYTHON_AGENT_GRPC_PORT",
		"NEO4J_BOLT_URL",
		"NEO4J_USER",
		"NEO4J_PASSWORD",
		"TEMPORAL_GRPC_ENDPOINT",
		"TEMPORAL_NAMESPACE",
		"TEMPORAL_TASK_QUEUE",
	}

	for _, envVar := range envVars {
		suite.originalEnv[envVar] = os.Getenv(envVar)
	}
}

// TearDownTest restores original environment variables
func (suite *ConfigTestSuite) TearDownTest() {
	for envVar, originalValue := range suite.originalEnv {
		if originalValue == "" {
			os.Unsetenv(envVar)
		} else {
			os.Setenv(envVar, originalValue)
		}
	}
}

// TestConfigTestSuite runs the test suite
func TestConfigTestSuite(t *testing.T) {
	suite.Run(t, new(ConfigTestSuite))
}

// TestConfig_LoadWithDefaults tests loading configuration with default values
func (suite *ConfigTestSuite) TestConfig_LoadWithDefaults() {
	// Arrange - clear all environment variables
	suite.clearAllEnvVars()

	// Act
	cfg, err := config.Load()

	// Assert
	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), cfg)

	// Check default values
	assert.Equal(suite.T(), "50051", cfg.Server.Port)
	assert.Equal(suite.T(), "python-reasoning", cfg.ReasoningService.Host)
	assert.Equal(suite.T(), "50052", cfg.ReasoningService.Port)
	assert.Equal(suite.T(), "python-agent", cfg.AgentService.Host)
	assert.Equal(suite.T(), "50053", cfg.AgentService.Port)
	assert.Equal(suite.T(), "bolt://neo4j:7687", cfg.Neo4j.URI)
	assert.Equal(suite.T(), "neo4j", cfg.Neo4j.Username)
	assert.Equal(suite.T(), "password", cfg.Neo4j.Password)
	assert.Equal(suite.T(), "temporal:7233", cfg.Temporal.HostPort)
	assert.Equal(suite.T(), "default", cfg.Temporal.Namespace)
	assert.Equal(suite.T(), "autoagent-mission-queue", cfg.Temporal.TaskQueue)
}

// TestConfig_LoadWithEnvironmentVariables tests loading with custom env vars
func (suite *ConfigTestSuite) TestConfig_LoadWithEnvironmentVariables() {
	// Arrange
	suite.clearAllEnvVars()
	os.Setenv("GO_CORE_GRPC_PORT", "8080")
	os.Setenv("PYTHON_REASONING_HOST", "custom-reasoning")
	os.Setenv("NEO4J_USER", "custom-user")

	// Act
	cfg, err := config.Load()

	// Assert
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), "8080", cfg.Server.Port)
	assert.Equal(suite.T(), "custom-reasoning", cfg.ReasoningService.Host)
	assert.Equal(suite.T(), "custom-user", cfg.Neo4j.Username)
	// Defaults should still apply for unset variables
	assert.Equal(suite.T(), "50052", cfg.ReasoningService.Port)
}

// TestConfig_ValidationErrors tests configuration validation
func (suite *ConfigTestSuite) TestConfig_ValidationErrors() {
	tests := []struct {
		name          string
		setupEnv      func()
		expectError   bool
		errorContains string
	}{
		{
			name: "invalid port number",
			setupEnv: func() {
				suite.clearAllEnvVars()
				os.Setenv("GO_CORE_GRPC_PORT", "invalid")
			},
			expectError:   true,
			errorContains: "server port must be a valid port number",
		},
		{
			name: "port out of range",
			setupEnv: func() {
				suite.clearAllEnvVars()
				os.Setenv("GO_CORE_GRPC_PORT", "99999")
			},
			expectError:   true,
			errorContains: "server port must be a valid port number",
		},
		{
			name: "valid configuration",
			setupEnv: func() {
				suite.clearAllEnvVars()
				// All defaults should be valid
			},
			expectError:   false,
			errorContains: "",
		},
	}

	for _, tt := range tests {
		suite.T().Run(tt.name, func(t *testing.T) {
			// Arrange
			tt.setupEnv()

			// Act
			cfg, err := config.Load()

			// Assert
			if tt.expectError {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.errorContains)
				assert.Nil(t, cfg)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, cfg)
			}
		})
	}
}

// TestConfig_AddressMethods tests address generation methods
func (suite *ConfigTestSuite) TestConfig_AddressMethods() {
	// Arrange
	suite.clearAllEnvVars()
	os.Setenv("GO_CORE_GRPC_PORT", "8080")
	os.Setenv("PYTHON_REASONING_HOST", "reasoning-host")
	os.Setenv("PYTHON_REASONING_GRPC_PORT", "9090")
	os.Setenv("PYTHON_AGENT_HOST", "agent-host")
	os.Setenv("PYTHON_AGENT_GRPC_PORT", "9091")

	cfg, err := config.Load()
	assert.NoError(suite.T(), err)

	// Act & Assert
	assert.Equal(suite.T(), ":8080", cfg.GetServerAddress())
	assert.Equal(suite.T(), "reasoning-host:9090", cfg.GetReasoningServiceAddress())
	assert.Equal(suite.T(), "agent-host:9091", cfg.GetAgentServiceAddress())
}

// Helper method to clear all environment variables
func (suite *ConfigTestSuite) clearAllEnvVars() {
	envVars := []string{
		"GO_CORE_GRPC_PORT",
		"PYTHON_REASONING_HOST",
		"PYTHON_REASONING_GRPC_PORT",
		"PYTHON_AGENT_HOST",
		"PYTHON_AGENT_GRPC_PORT",
		"NEO4J_BOLT_URL",
		"NEO4J_USER",
		"NEO4J_PASSWORD",
		"TEMPORAL_GRPC_ENDPOINT",
		"TEMPORAL_NAMESPACE",
		"TEMPORAL_TASK_QUEUE",
	}

	for _, envVar := range envVars {
		os.Unsetenv(envVar)
	}
}

// Benchmark tests
func BenchmarkConfigLoad(b *testing.B) {
	for i := 0; i < b.N; i++ {
		config.Load()
	}
}
