package activities

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.temporal.io/sdk/activity"

	"autoagent/go-core/internal/models"
)

// Global dependencies instance for activities
// This will be initialized by the main application
var globalDeps *Dependencies

// SetGlobalDependencies sets the global dependencies for activities
// This should be called once during application startup
func SetGlobalDependencies(deps *Dependencies) {
	globalDeps = deps
}

// GenerateOptionsActivity calls the ReasoningService to generate potential tasks
func GenerateOptionsActivity(ctx context.Context, missionPrompt string) ([]models.PotentialTask, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting GenerateOptionsActivity", "missionPrompt", missionPrompt)

	if globalDeps == nil {
		return nil, fmt.Errorf("dependencies not initialized")
	}

	// Generate unique request ID for tracing
	requestID := uuid.New().String()

	// Call the reasoning service using injected dependency
	tasks, err := globalDeps.ReasoningClient.GenerateOptions(ctx, requestID, missionPrompt)
	if err != nil {
		return nil, fmt.Errorf("failed to generate options: %w", err)
	}

	logger.Info("Successfully generated options",
		"requestId", requestID,
		"taskCount", len(tasks),
		"missionPrompt", missionPrompt)

	// Validate that we have at least one task
	if len(tasks) == 0 {
		return nil, fmt.Errorf("reasoning service returned no potential tasks")
	}

	// Log the generated tasks for debugging
	for i, task := range tasks {
		logger.Info("Generated task",
			"index", i,
			"taskId", task.ID,
			"taskPrompt", task.Prompt)
	}

	return tasks, nil
}

// ScoreOptionsActivity calls the ReasoningService to score potential tasks
func ScoreOptionsActivity(ctx context.Context, tasks []models.PotentialTask) ([]models.TaskScore, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting ScoreOptionsActivity", "taskCount", len(tasks))

	// Validate input
	if len(tasks) == 0 {
		return nil, fmt.Errorf("no tasks provided for scoring")
	}

	if globalDeps == nil {
		return nil, fmt.Errorf("dependencies not initialized")
	}

	// Generate unique request ID for tracing
	requestID := uuid.New().String()

	// Call the reasoning service to score tasks using injected dependency
	scores, err := globalDeps.ReasoningClient.ScoreOptions(ctx, requestID, tasks)
	if err != nil {
		return nil, fmt.Errorf("failed to score options: %w", err)
	}

	logger.Info("Successfully scored options",
		"requestId", requestID,
		"scoreCount", len(scores))

	// Validate that we have scores for all tasks
	if len(scores) != len(tasks) {
		logger.Warn("Score count mismatch",
			"expectedCount", len(tasks),
			"actualCount", len(scores))
	}

	// Log the scored tasks for debugging
	for i, score := range scores {
		logger.Info("Scored task",
			"index", i,
			"taskId", score.Task.ID,
			"taskPrompt", score.Task.Prompt,
			"score", score.OverallScore)
	}

	// Sort scores in descending order (highest score first)
	// This ensures the best task is selected first in Phase 0
	for i := 0; i < len(scores)-1; i++ {
		for j := i + 1; j < len(scores); j++ {
			if scores[j].OverallScore > scores[i].OverallScore {
				scores[i], scores[j] = scores[j], scores[i]
			}
		}
	}

	logger.Info("Tasks sorted by score",
		"bestTaskId", scores[0].Task.ID,
		"bestScore", scores[0].OverallScore)

	return scores, nil
}

// ValidateReasoningServiceActivity performs a health check on the reasoning service
func ValidateReasoningServiceActivity(ctx context.Context) error {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting ValidateReasoningServiceActivity")

	if globalDeps == nil {
		return fmt.Errorf("dependencies not initialized")
	}

	// Perform health check using injected dependency
	err := globalDeps.ReasoningClient.ValidateService(ctx)
	if err != nil {
		logger.Error("Reasoning service validation failed", "error", err)
		return fmt.Errorf("reasoning service validation failed: %w", err)
	}

	logger.Info("Reasoning service validation successful")
	return nil
}
