package integration

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

// TestConfig holds configuration for integration tests
type TestConfig struct {
	Timeout time.Duration
	Retries int
}

// DefaultTestConfig returns the default test configuration
func DefaultTestConfig() *TestConfig {
	return &TestConfig{
		Timeout: 5 * time.Minute,
		Retries: 3,
	}
}

// WaitForCondition waits for a condition to be true with retries
func WaitForCondition(t *testing.T, ctx context.Context, condition func() bool, message string, config *TestConfig) {
	t.Helper()

	if config == nil {
		config = DefaultTestConfig()
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, config.Timeout)
	defer cancel()

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-timeoutCtx.Done():
			t.Fatalf("❌ Timeout waiting for condition: %s", message)
		case <-ticker.C:
			if condition() {
				t.Logf("✅ Condition met: %s", message)
				return
			}
		}
	}
}

// RetryOperation retries an operation with exponential backoff
func RetryOperation(t *testing.T, ctx context.Context, operation func() error, message string, config *TestConfig) error {
	t.Helper()

	if config == nil {
		config = DefaultTestConfig()
	}

	var lastErr error
	backoff := 1 * time.Second

	for i := 0; i < config.Retries; i++ {
		if err := operation(); err == nil {
			return nil
		} else {
			lastErr = err
			t.Logf("⚠️ Attempt %d/%d failed for %s: %v", i+1, config.Retries, message, err)
		}

		if i < config.Retries-1 {
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(backoff):
				backoff *= 2 // Exponential backoff
			}
		}
	}

	return fmt.Errorf("operation failed after %d retries: %w", config.Retries, lastErr)
}

// SetupTestEnvironmentVariables sets up environment variables for testing
func SetupTestEnvironmentVariables(t *testing.T) {
	t.Helper()

	// Set test-specific environment variables
	testEnvVars := map[string]string{
		// Point to test services instead of dev services
		"NEO4J_BOLT_URL":           "bolt://neo4j-test:7687",
		"TEMPORAL_GRPC_ENDPOINT":   "temporal-test:7233",
		"PYTHON_REASONING_HOST":    "python-reasoning-test",
		"PYTHON_AGENT_HOST":        "python-agent-test",
		"MINIO_ENDPOINT":           "http://minio-test:9000",
		
		// Use the same namespace and queue as dev (since we have separate instances)
		"TEMPORAL_NAMESPACE":       "default",
		"TEMPORAL_TASK_QUEUE":      "autoagent-mission-queue",
	}

	// Set environment variables for the test
	for key, value := range testEnvVars {
		originalValue := os.Getenv(key)
		err := os.Setenv(key, value)
		require.NoError(t, err, "Failed to set environment variable %s", key)

		// Restore original value after test
		t.Cleanup(func() {
			if originalValue == "" {
				os.Unsetenv(key)
			} else {
				os.Setenv(key, originalValue)
			}
		})
	}

	t.Logf("✅ Test environment variables configured")
}

// LogServiceStatus logs the status of a service for debugging
func LogServiceStatus(t *testing.T, serviceName string, status string, details ...string) {
	t.Helper()

	message := fmt.Sprintf("🔧 Service %s: %s", serviceName, status)
	if len(details) > 0 {
		message += fmt.Sprintf(" (%s)", details[0])
	}
	t.Log(message)
}

// ValidateServiceHealth performs basic health checks on services
func ValidateServiceHealth(t *testing.T, ctx context.Context, serviceName string, healthCheck func() error) {
	t.Helper()

	config := DefaultTestConfig()
	config.Timeout = 30 * time.Second

	err := RetryOperation(t, ctx, healthCheck, fmt.Sprintf("%s health check", serviceName), config)
	require.NoError(t, err, "Service %s failed health check", serviceName)

	LogServiceStatus(t, serviceName, "healthy")
}

// GetTestMissionPrompt returns the standard test mission prompt
func GetTestMissionPrompt() string {
	return "hello_world" // Phase 0 standard test mission
}

// FormatTestLogMessage formats a log message with test context
func FormatTestLogMessage(phase string, message string, args ...interface{}) string {
	formattedMessage := fmt.Sprintf(message, args...)
	return fmt.Sprintf("[%s] %s", phase, formattedMessage)
}

// AssertEventuallyTrue asserts that a condition becomes true within a timeout
func AssertEventuallyTrue(t *testing.T, ctx context.Context, condition func() bool, message string, timeout time.Duration) {
	t.Helper()

	config := &TestConfig{
		Timeout: timeout,
		Retries: 1,
	}

	WaitForCondition(t, ctx, condition, message, config)
}

// LogTestPhase logs the start of a test phase
func LogTestPhase(t *testing.T, phase string, description string) {
	t.Helper()
	t.Logf("🔄 %s: %s", phase, description)
}

// LogTestSuccess logs successful completion of a test phase
func LogTestSuccess(t *testing.T, phase string, description string) {
	t.Helper()
	t.Logf("✅ %s: %s", phase, description)
}

// LogTestError logs an error in a test phase
func LogTestError(t *testing.T, phase string, err error) {
	t.Helper()
	t.Logf("❌ %s: %v", phase, err)
}
