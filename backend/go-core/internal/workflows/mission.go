package workflows

import (
	"fmt"
	"time"

	"go.temporal.io/sdk/temporal"
	"go.temporal.io/sdk/workflow"

	"autoagent/go-core/internal/activities"
	"autoagent/go-core/internal/models"
)

// MissionWorkflow orchestrates the complete "Golden Path" execution
// This workflow implements the Phase 0 requirements:
// 1. Generate task options via ReasoningService
// 2. Score the options via ReasoningService
// 3. Select the best option (first one in Phase 0)
// 4. Execute via AgentService (start session, execute step, stop session)
// 5. Write results to Neo4j knowledge graph
func MissionWorkflow(ctx workflow.Context, missionID string) (*models.WorkflowResult, error) {
	logger := workflow.GetLogger(ctx)
	logger.Info("Starting MissionWorkflow", "missionID", missionID)

	// Configure activity options with retry policies
	// Temporal handles all retry logic, circuit breaking, and resilience
	activityOptions := workflow.ActivityOptions{
		StartToCloseTimeout: 2 * time.Minute,  // Total time for activity execution
		HeartbeatTimeout:    30 * time.Second, // Heartbeat interval for long activities
		RetryPolicy: &temporal.RetryPolicy{
			InitialInterval:    time.Second,
			BackoffCoefficient: 2.0,
			MaximumInterval:    30 * time.Second,
			MaximumAttempts:    3,
			NonRetryableErrorTypes: []string{
				// Add specific error types that should not be retried
				"ValidationError",
				"AuthenticationError",
			},
		},
	}
	ctx = workflow.WithActivityOptions(ctx, activityOptions)

	// Initialize workflow result
	result := &models.WorkflowResult{
		MissionID:   missionID,
		Status:      models.MissionStatusRunning,
		CompletedAt: time.Now(),
	}

	// Create mission model for tracking
	mission := models.NewMission(missionID, "hello_world") // Phase 0: hardcoded prompt
	mission.UpdateStatus(models.MissionStatusRunning)

	// Step 1: Generate potential tasks via ReasoningService
	logger.Info("Step 1: Generating task options")
	var potentialTasks []models.PotentialTask
	err := workflow.ExecuteActivity(ctx, activities.GenerateOptionsActivity, "hello_world").Get(ctx, &potentialTasks)
	if err != nil {
		logger.Error("Failed to generate task options", "error", err)
		result.Status = models.MissionStatusFailed
		result.ErrorMessage = fmt.Sprintf("Failed to generate options: %v", err)
		return result, err
	}

	if len(potentialTasks) == 0 {
		err := fmt.Errorf("no potential tasks generated")
		logger.Error("No tasks generated", "error", err)
		result.Status = models.MissionStatusFailed
		result.ErrorMessage = err.Error()
		return result, err
	}

	logger.Info("Generated potential tasks", "taskCount", len(potentialTasks))

	// Step 2: Score the potential tasks via ReasoningService
	logger.Info("Step 2: Scoring task options")
	var taskScores []models.TaskScore
	err = workflow.ExecuteActivity(ctx, activities.ScoreOptionsActivity, potentialTasks).Get(ctx, &taskScores)
	if err != nil {
		logger.Error("Failed to score task options", "error", err)
		result.Status = models.MissionStatusFailed
		result.ErrorMessage = fmt.Sprintf("Failed to score options: %v", err)
		return result, err
	}

	if len(taskScores) == 0 {
		err := fmt.Errorf("no task scores received")
		logger.Error("No task scores received", "error", err)
		result.Status = models.MissionStatusFailed
		result.ErrorMessage = err.Error()
		return result, err
	}

	// Step 3: Select the best task (Phase 0: first/highest scored task)
	selectedTask := taskScores[0].Task
	logger.Info("Selected task for execution",
		"taskId", selectedTask.ID,
		"taskPrompt", selectedTask.Prompt,
		"score", taskScores[0].OverallScore)

	result.SelectedTask = selectedTask

	// Step 4: Execute the task via AgentService
	// This involves: StartSession -> ExecuteStep -> StopSession
	logger.Info("Step 4: Executing task via AgentService")

	// 4a: Start agent session
	var sessionID string
	err = workflow.ExecuteActivity(ctx, activities.StartAgentSessionActivity, selectedTask).Get(ctx, &sessionID)
	if err != nil {
		logger.Error("Failed to start agent session", "taskId", selectedTask.ID, "error", err)
		result.Status = models.MissionStatusFailed
		result.ErrorMessage = fmt.Sprintf("Failed to start agent session: %v", err)
		return result, err
	}

	logger.Info("Started agent session", "sessionId", sessionID, "taskId", selectedTask.ID)

	// 4b: Execute the step
	var agentResult models.AgentResult
	err = workflow.ExecuteActivity(ctx, activities.ExecuteAgentStepActivity, sessionID, selectedTask).Get(ctx, &agentResult)
	if err != nil {
		logger.Error("Failed to execute agent step", "sessionId", sessionID, "error", err)

		// Try to clean up the session even if execution failed
		var stopErr error
		stopErr = workflow.ExecuteActivity(ctx, activities.StopAgentSessionActivity, sessionID, false).Get(ctx, nil)
		if stopErr != nil {
			logger.Warn("Failed to clean up session after execution failure",
				"sessionId", sessionID, "stopError", stopErr)
		}

		result.Status = models.MissionStatusFailed
		result.ErrorMessage = fmt.Sprintf("Failed to execute agent step: %v", err)
		return result, err
	}

	logger.Info("Executed agent step",
		"sessionId", sessionID,
		"status", agentResult.Status,
		"outputLength", len(agentResult.Output))

	result.AgentResult = agentResult

	// 4c: Stop agent session
	// Determine success based on agent result
	executionSuccess := agentResult.Status == string(models.AgentExecutionStatusSuccess)

	err = workflow.ExecuteActivity(ctx, activities.StopAgentSessionActivity, sessionID, executionSuccess).Get(ctx, nil)
	if err != nil {
		logger.Warn("Failed to properly stop agent session",
			"sessionId", sessionID, "error", err)
		// Don't fail the entire workflow for stop errors, just log them
	} else {
		logger.Info("Stopped agent session",
			"sessionId", sessionID, "success", executionSuccess)
	}

	// Step 5: Write results to Neo4j knowledge graph
	logger.Info("Step 5: Writing results to Neo4j")

	// Update mission status based on agent execution result
	if executionSuccess {
		mission.UpdateStatus(models.MissionStatusSuccess)
		result.Status = models.MissionStatusSuccess
	} else {
		mission.UpdateStatus(models.MissionStatusFailed)
		result.Status = models.MissionStatusFailed
		result.ErrorMessage = "Agent execution failed: " + agentResult.Error
	}

	err = workflow.ExecuteActivity(ctx, activities.WriteToNeo4jActivity, *mission, selectedTask, agentResult).Get(ctx, nil)
	if err != nil {
		logger.Error("Failed to write results to Neo4j", "error", err)
		// Don't fail the workflow for Neo4j write errors in Phase 0
		// In production, this might be more critical
		logger.Warn("Continuing despite Neo4j write failure", "error", err)
	} else {
		logger.Info("Successfully wrote results to Neo4j")
	}

	// Update final completion time
	result.CompletedAt = time.Now()

	logger.Info("MissionWorkflow completed",
		"missionID", missionID,
		"status", result.Status,
		"taskId", selectedTask.ID,
		"agentStatus", agentResult.Status)

	return result, nil
}

// ValidateServicesWorkflow performs health checks on all external services
// This workflow can be used to verify system health before executing missions
func ValidateServicesWorkflow(ctx workflow.Context) error {
	logger := workflow.GetLogger(ctx)
	logger.Info("Starting ValidateServicesWorkflow")

	// Configure shorter timeouts for health checks
	activityOptions := workflow.ActivityOptions{
		StartToCloseTimeout: 30 * time.Second,
		RetryPolicy: &temporal.RetryPolicy{
			InitialInterval:    time.Second,
			BackoffCoefficient: 1.5,
			MaximumInterval:    5 * time.Second,
			MaximumAttempts:    2, // Fewer retries for health checks
		},
	}
	ctx = workflow.WithActivityOptions(ctx, activityOptions)

	// Validate ReasoningService
	err := workflow.ExecuteActivity(ctx, activities.ValidateReasoningServiceActivity).Get(ctx, nil)
	if err != nil {
		logger.Error("ReasoningService health check failed", "error", err)
		return fmt.Errorf("reasoning service validation failed: %w", err)
	}

	// Validate AgentService
	err = workflow.ExecuteActivity(ctx, activities.ValidateAgentServiceActivity).Get(ctx, nil)
	if err != nil {
		logger.Error("AgentService health check failed", "error", err)
		return fmt.Errorf("agent service validation failed: %w", err)
	}

	// Validate Neo4j
	err = workflow.ExecuteActivity(ctx, activities.ValidateNeo4jServiceActivity).Get(ctx, nil)
	if err != nil {
		logger.Error("Neo4j health check failed", "error", err)
		return fmt.Errorf("neo4j service validation failed: %w", err)
	}

	logger.Info("All services validated successfully")
	return nil
}

// InitializeSystemWorkflow sets up the system for first use
// This workflow creates necessary Neo4j indexes and performs initial setup
func InitializeSystemWorkflow(ctx workflow.Context) error {
	logger := workflow.GetLogger(ctx)
	logger.Info("Starting InitializeSystemWorkflow")

	activityOptions := workflow.ActivityOptions{
		StartToCloseTimeout: 2 * time.Minute,
		RetryPolicy: &temporal.RetryPolicy{
			InitialInterval:    time.Second,
			BackoffCoefficient: 2.0,
			MaximumInterval:    10 * time.Second,
			MaximumAttempts:    3,
		},
	}
	ctx = workflow.WithActivityOptions(ctx, activityOptions)

	// Initialize Neo4j indexes for optimal performance
	err := workflow.ExecuteActivity(ctx, activities.InitializeNeo4jIndexesActivity).Get(ctx, nil)
	if err != nil {
		logger.Error("Failed to initialize Neo4j indexes", "error", err)
		return fmt.Errorf("failed to initialize Neo4j indexes: %w", err)
	}

	// Validate all services after initialization
	err = workflow.ExecuteActivity(ctx, activities.ValidateReasoningServiceActivity).Get(ctx, nil)
	if err != nil {
		return fmt.Errorf("post-init reasoning service validation failed: %w", err)
	}

	err = workflow.ExecuteActivity(ctx, activities.ValidateAgentServiceActivity).Get(ctx, nil)
	if err != nil {
		return fmt.Errorf("post-init agent service validation failed: %w", err)
	}

	err = workflow.ExecuteActivity(ctx, activities.ValidateNeo4jServiceActivity).Get(ctx, nil)
	if err != nil {
		return fmt.Errorf("post-init neo4j service validation failed: %w", err)
	}

	logger.Info("System initialization completed successfully")
	return nil
}
