package activities

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.temporal.io/sdk/activity"

	"autoagent/go-core/internal/config"
	"autoagent/go-core/internal/models"
	"autoagent/go-core/internal/services"
)

// StartAgentSessionActivity starts a new agent session
func StartAgentSessionActivity(ctx context.Context, task models.PotentialTask) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting StartAgentSessionActivity", 
		"taskId", task.ID,
		"taskPrompt", task.Prompt)

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return "", fmt.Errorf("failed to load configuration: %w", err)
	}

	// Create agent client
	client, err := services.NewAgentClient(cfg.GetAgentServiceAddress())
	if err != nil {
		return "", fmt.Errorf("failed to create agent client: %w", err)
	}
	defer client.Close()

	// Generate unique request ID for tracing
	requestID := uuid.New().String()

	// Start the agent session
	sessionID, err := client.StartSession(ctx, requestID, task)
	if err != nil {
		return "", fmt.Errorf("failed to start agent session: %w", err)
	}

	logger.Info("Successfully started agent session", 
		"requestId", requestID,
		"sessionId", sessionID,
		"taskId", task.ID)

	return sessionID, nil
}

// ExecuteAgentStepActivity executes a step in an agent session
func ExecuteAgentStepActivity(ctx context.Context, sessionID string, task models.PotentialTask) (models.AgentResult, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting ExecuteAgentStepActivity", 
		"sessionId", sessionID,
		"taskId", task.ID,
		"taskPrompt", task.Prompt)

	// Validate input
	if sessionID == "" {
		return models.AgentResult{}, fmt.Errorf("session ID is required")
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return models.AgentResult{}, fmt.Errorf("failed to load configuration: %w", err)
	}

	// Create agent client
	client, err := services.NewAgentClient(cfg.GetAgentServiceAddress())
	if err != nil {
		return models.AgentResult{}, fmt.Errorf("failed to create agent client: %w", err)
	}
	defer client.Close()

	// Execute the step with the task prompt as directive
	result, err := client.ExecuteStep(ctx, sessionID, task.Prompt)
	if err != nil {
		logger.Error("Failed to execute agent step", 
			"sessionId", sessionID,
			"taskId", task.ID,
			"error", err)
		return models.AgentResult{}, fmt.Errorf("failed to execute agent step: %w", err)
	}

	logger.Info("Successfully executed agent step", 
		"sessionId", sessionID,
		"taskId", task.ID,
		"status", result.Status,
		"outputLength", len(result.Output))

	// Log result details for debugging (truncate long outputs)
	outputPreview := result.Output
	if len(outputPreview) > 200 {
		outputPreview = outputPreview[:200] + "..."
	}
	
	errorPreview := result.Error
	if len(errorPreview) > 200 {
		errorPreview = errorPreview[:200] + "..."
	}

	logger.Info("Agent step result details", 
		"sessionId", sessionID,
		"taskId", task.ID,
		"status", result.Status,
		"outputPreview", outputPreview,
		"errorPreview", errorPreview)

	return result, nil
}

// StopAgentSessionActivity stops an agent session
func StopAgentSessionActivity(ctx context.Context, sessionID string, success bool) error {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting StopAgentSessionActivity", 
		"sessionId", sessionID,
		"success", success)

	// Validate input
	if sessionID == "" {
		return fmt.Errorf("session ID is required")
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("failed to load configuration: %w", err)
	}

	// Create agent client
	client, err := services.NewAgentClient(cfg.GetAgentServiceAddress())
	if err != nil {
		return fmt.Errorf("failed to create agent client: %w", err)
	}
	defer client.Close()

	// Generate unique request ID for tracing
	requestID := uuid.New().String()

	// Stop the agent session
	err = client.StopSession(ctx, requestID, sessionID, success)
	if err != nil {
		logger.Error("Failed to stop agent session", 
			"sessionId", sessionID,
			"requestId", requestID,
			"error", err)
		return fmt.Errorf("failed to stop agent session: %w", err)
	}

	logger.Info("Successfully stopped agent session", 
		"requestId", requestID,
		"sessionId", sessionID,
		"success", success)

	return nil
}

// ValidateAgentServiceActivity performs a health check on the agent service
func ValidateAgentServiceActivity(ctx context.Context) error {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting ValidateAgentServiceActivity")

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("failed to load configuration: %w", err)
	}

	// Create agent client
	client, err := services.NewAgentClient(cfg.GetAgentServiceAddress())
	if err != nil {
		return fmt.Errorf("failed to create agent client: %w", err)
	}
	defer client.Close()

	// Perform health check
	err = client.Health(ctx)
	if err != nil {
		return fmt.Errorf("agent service health check failed: %w", err)
	}

	logger.Info("Agent service health check passed")
	return nil
}

// ExecuteAgentSessionActivity combines start, execute, and stop into a single activity
// This is useful for simple workflows where we want atomic session management
func ExecuteAgentSessionActivity(ctx context.Context, task models.PotentialTask) (models.AgentResult, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting ExecuteAgentSessionActivity (atomic)", 
		"taskId", task.ID,
		"taskPrompt", task.Prompt)

	// Start session
	sessionID, err := StartAgentSessionActivity(ctx, task)
	if err != nil {
		return models.AgentResult{}, fmt.Errorf("failed to start session: %w", err)
	}

	// Execute step
	result, err := ExecuteAgentStepActivity(ctx, sessionID, task)
	if err != nil {
		// Try to clean up the session even if execution failed
		stopErr := StopAgentSessionActivity(ctx, sessionID, false)
		if stopErr != nil {
			logger.Warn("Failed to clean up session after execution failure", 
				"sessionId", sessionID,
				"stopError", stopErr)
		}
		return models.AgentResult{}, fmt.Errorf("failed to execute step: %w", err)
	}

	// Determine success based on result status
	success := result.Status == string(models.AgentExecutionStatusSuccess)

	// Stop session
	err = StopAgentSessionActivity(ctx, sessionID, success)
	if err != nil {
		logger.Warn("Failed to properly stop session", 
			"sessionId", sessionID,
			"error", err)
		// Don't fail the entire activity for stop errors, just log them
	}

	logger.Info("Successfully completed atomic agent session", 
		"taskId", task.ID,
		"sessionId", sessionID,
		"status", result.Status,
		"success", success)

	return result, nil
}
