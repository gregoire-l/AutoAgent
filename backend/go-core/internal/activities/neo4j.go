package activities

import (
	"context"
	"fmt"

	"go.temporal.io/sdk/activity"

	"autoagent/go-core/internal/config"
	"autoagent/go-core/internal/models"
	"autoagent/go-core/internal/services"
)

// WriteToNeo4jActivity writes mission and task results to the knowledge graph
func WriteToNeo4jActivity(ctx context.Context, mission models.Mission, task models.PotentialTask, result models.AgentResult) error {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting WriteToNeo4jActivity", 
		"missionId", mission.ID,
		"taskId", task.ID,
		"agentStatus", result.Status)

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("failed to load configuration: %w", err)
	}

	// Create Neo4j client
	client, err := services.NewNeo4jClient(cfg.Neo4j.URI, cfg.Neo4j.Username, cfg.Neo4j.Password)
	if err != nil {
		return fmt.Errorf("failed to create Neo4j client: %w", err)
	}
	defer client.Close(ctx)

	// Write the mission result to the knowledge graph
	err = client.WriteMissionResult(ctx, mission, task, result)
	if err != nil {
		logger.Error("Failed to write mission result to Neo4j", 
			"missionId", mission.ID,
			"taskId", task.ID,
			"error", err)
		return fmt.Errorf("failed to write mission result to Neo4j: %w", err)
	}

	logger.Info("Successfully wrote mission result to Neo4j", 
		"missionId", mission.ID,
		"taskId", task.ID,
		"missionStatus", mission.Status,
		"agentStatus", result.Status)

	return nil
}

// ReadMissionStatusActivity reads the status of a mission from the knowledge graph
func ReadMissionStatusActivity(ctx context.Context, missionID string) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting ReadMissionStatusActivity", "missionId", missionID)

	// Validate input
	if missionID == "" {
		return "", fmt.Errorf("mission ID is required")
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return "", fmt.Errorf("failed to load configuration: %w", err)
	}

	// Create Neo4j client
	client, err := services.NewNeo4jClient(cfg.Neo4j.URI, cfg.Neo4j.Username, cfg.Neo4j.Password)
	if err != nil {
		return "", fmt.Errorf("failed to create Neo4j client: %w", err)
	}
	defer client.Close(ctx)

	// Get mission status from the knowledge graph
	status, err := client.GetMissionStatus(ctx, missionID)
	if err != nil {
		logger.Error("Failed to read mission status from Neo4j", 
			"missionId", missionID,
			"error", err)
		return "", fmt.Errorf("failed to read mission status from Neo4j: %w", err)
	}

	logger.Info("Successfully read mission status from Neo4j", 
		"missionId", missionID,
		"status", status)

	return status, nil
}

// ReadMissionTasksActivity reads all tasks associated with a mission from the knowledge graph
func ReadMissionTasksActivity(ctx context.Context, missionID string) ([]models.Neo4jTaskNode, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting ReadMissionTasksActivity", "missionId", missionID)

	// Validate input
	if missionID == "" {
		return nil, fmt.Errorf("mission ID is required")
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("failed to load configuration: %w", err)
	}

	// Create Neo4j client
	client, err := services.NewNeo4jClient(cfg.Neo4j.URI, cfg.Neo4j.Username, cfg.Neo4j.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to create Neo4j client: %w", err)
	}
	defer client.Close(ctx)

	// Get mission tasks from the knowledge graph
	tasks, err := client.GetMissionTasks(ctx, missionID)
	if err != nil {
		logger.Error("Failed to read mission tasks from Neo4j", 
			"missionId", missionID,
			"error", err)
		return nil, fmt.Errorf("failed to read mission tasks from Neo4j: %w", err)
	}

	logger.Info("Successfully read mission tasks from Neo4j", 
		"missionId", missionID,
		"taskCount", len(tasks))

	return tasks, nil
}

// ValidateNeo4jServiceActivity performs a health check on the Neo4j database
func ValidateNeo4jServiceActivity(ctx context.Context) error {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting ValidateNeo4jServiceActivity")

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("failed to load configuration: %w", err)
	}

	// Create Neo4j client
	client, err := services.NewNeo4jClient(cfg.Neo4j.URI, cfg.Neo4j.Username, cfg.Neo4j.Password)
	if err != nil {
		return fmt.Errorf("failed to create Neo4j client: %w", err)
	}
	defer client.Close(ctx)

	// Perform health check
	err = client.Health(ctx)
	if err != nil {
		return fmt.Errorf("Neo4j service health check failed: %w", err)
	}

	logger.Info("Neo4j service health check passed")
	return nil
}

// InitializeNeo4jIndexesActivity creates necessary indexes for optimal query performance
func InitializeNeo4jIndexesActivity(ctx context.Context) error {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting InitializeNeo4jIndexesActivity")

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("failed to load configuration: %w", err)
	}

	// Create Neo4j client
	client, err := services.NewNeo4jClient(cfg.Neo4j.URI, cfg.Neo4j.Username, cfg.Neo4j.Password)
	if err != nil {
		return fmt.Errorf("failed to create Neo4j client: %w", err)
	}
	defer client.Close(ctx)

	// Create indexes for optimal performance
	err = client.CreateIndexes(ctx)
	if err != nil {
		logger.Error("Failed to create Neo4j indexes", "error", err)
		return fmt.Errorf("failed to create Neo4j indexes: %w", err)
	}

	logger.Info("Successfully created Neo4j indexes")
	return nil
}

// WriteCompleteMissionActivity writes a complete mission with all its data to Neo4j
// This is a higher-level activity that combines mission and task creation
func WriteCompleteMissionActivity(ctx context.Context, workflowResult models.WorkflowResult) error {
	logger := activity.GetLogger(ctx)
	logger.Info("Starting WriteCompleteMissionActivity", 
		"missionId", workflowResult.MissionID,
		"status", workflowResult.Status)

	// Create mission model from workflow result
	mission := models.Mission{
		ID:        workflowResult.MissionID,
		Status:    string(workflowResult.Status),
		Prompt:    "hello_world", // Phase 0: hardcoded prompt
		CreatedAt: workflowResult.CompletedAt,
		UpdatedAt: workflowResult.CompletedAt,
	}

	// Write to Neo4j using the standard activity
	err := WriteToNeo4jActivity(ctx, mission, workflowResult.SelectedTask, workflowResult.AgentResult)
	if err != nil {
		return fmt.Errorf("failed to write complete mission: %w", err)
	}

	logger.Info("Successfully wrote complete mission to Neo4j", 
		"missionId", workflowResult.MissionID,
		"taskId", workflowResult.SelectedTask.ID,
		"status", workflowResult.Status)

	return nil
}
