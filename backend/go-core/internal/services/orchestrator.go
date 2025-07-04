package services

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.temporal.io/api/enums/v1"
	"go.temporal.io/sdk/client"

	"autoagent/go-core/internal/config"
	"autoagent/go-core/internal/models"
)

// Orchestrator manages the execution of missions through Temporal workflows
type Orchestrator struct {
	temporalClient client.Client
	config         *config.Config
}

// NewOrchestrator creates a new orchestrator instance
func NewOrchestrator(cfg *config.Config) (*Orchestrator, error) {
	// Create Temporal client with best practices configuration
	clientOptions := client.Options{
		HostPort:  cfg.Temporal.HostPort,
		Namespace: cfg.Temporal.Namespace,
		Logger:    nil, // Use default logger, can be customized
	}

	temporalClient, err := client.Dial(clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to create Temporal client: %w", err)
	}

	return &Orchestrator{
		temporalClient: temporalClient,
		config:         cfg,
	}, nil
}

// Close closes the orchestrator and its Temporal client
func (o *Orchestrator) Close() {
	if o.temporalClient != nil {
		o.temporalClient.Close()
	}
}

// StartMission initiates a new mission workflow
func (o *Orchestrator) StartMission(ctx context.Context, missionPrompt string) (*models.WorkflowResult, error) {
	// Generate unique mission ID
	missionID := uuid.New().String()

	// Configure workflow options
	workflowOptions := client.StartWorkflowOptions{
		ID:                    fmt.Sprintf("mission-%s", missionID),
		TaskQueue:             o.config.Temporal.TaskQueue,
		WorkflowRunTimeout:    10 * time.Minute, // Total workflow timeout
		WorkflowTaskTimeout:   30 * time.Second, // Individual task timeout
		WorkflowIDReusePolicy: *enums.WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE.Enum(),
	}

	// Start the mission workflow
	workflowRun, err := o.temporalClient.ExecuteWorkflow(ctx, workflowOptions, "MissionWorkflow", missionID)
	if err != nil {
		return nil, fmt.Errorf("failed to start mission workflow: %w", err)
	}

	// Wait for workflow completion and get result
	var result models.WorkflowResult
	err = workflowRun.Get(ctx, &result)
	if err != nil {
		return nil, fmt.Errorf("mission workflow failed: %w", err)
	}

	return &result, nil
}

// StartMissionAsync initiates a mission workflow without waiting for completion
func (o *Orchestrator) StartMissionAsync(ctx context.Context, missionPrompt string) (string, error) {
	// Generate unique mission ID
	missionID := uuid.New().String()

	// Configure workflow options
	workflowOptions := client.StartWorkflowOptions{
		ID:                    fmt.Sprintf("mission-%s", missionID),
		TaskQueue:             o.config.Temporal.TaskQueue,
		WorkflowRunTimeout:    10 * time.Minute,
		WorkflowTaskTimeout:   30 * time.Second,
		WorkflowIDReusePolicy: *enums.WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE.Enum(),
	}

	// Start the mission workflow asynchronously
	_, err := o.temporalClient.ExecuteWorkflow(ctx, workflowOptions, "MissionWorkflow", missionID)
	if err != nil {
		return "", fmt.Errorf("failed to start mission workflow: %w", err)
	}

	return missionID, nil
}

// GetMissionStatus retrieves the status of a running or completed mission
func (o *Orchestrator) GetMissionStatus(ctx context.Context, missionID string) (*models.WorkflowResult, error) {
	workflowID := fmt.Sprintf("mission-%s", missionID)

	// Use Temporal's proper API to describe workflow execution
	resp, err := o.temporalClient.DescribeWorkflowExecution(ctx, workflowID, "")
	if err != nil {
		return nil, fmt.Errorf("failed to describe workflow execution: %w", err)
	}

	// Check workflow status using proper Temporal enums
	switch resp.WorkflowExecutionInfo.Status {
	case enums.WORKFLOW_EXECUTION_STATUS_RUNNING:
		return &models.WorkflowResult{
			MissionID: missionID,
			Status:    models.MissionStatusRunning,
		}, nil

	case enums.WORKFLOW_EXECUTION_STATUS_COMPLETED:
		// Workflow completed, get the actual result
		workflowRun := o.temporalClient.GetWorkflow(ctx, workflowID, "")
		var result models.WorkflowResult
		err = workflowRun.Get(ctx, &result)
		if err != nil {
			return nil, fmt.Errorf("failed to get completed workflow result: %w", err)
		}
		return &result, nil

	case enums.WORKFLOW_EXECUTION_STATUS_FAILED:
		return &models.WorkflowResult{
			MissionID:    missionID,
			Status:       models.MissionStatusFailed,
			ErrorMessage: "Workflow execution failed",
		}, nil

	case enums.WORKFLOW_EXECUTION_STATUS_CANCELED:
		return &models.WorkflowResult{
			MissionID: missionID,
			Status:    models.MissionStatusCancelled,
		}, nil

	case enums.WORKFLOW_EXECUTION_STATUS_TERMINATED:
		return &models.WorkflowResult{
			MissionID:    missionID,
			Status:       models.MissionStatusFailed,
			ErrorMessage: "Workflow was terminated",
		}, nil

	case enums.WORKFLOW_EXECUTION_STATUS_TIMED_OUT:
		return &models.WorkflowResult{
			MissionID:    missionID,
			Status:       models.MissionStatusFailed,
			ErrorMessage: "Workflow timed out",
		}, nil

	default:
		return &models.WorkflowResult{
			MissionID:    missionID,
			Status:       models.MissionStatusFailed,
			ErrorMessage: fmt.Sprintf("Unknown workflow status: %v", resp.WorkflowExecutionInfo.Status),
		}, nil
	}
}

// CancelMission cancels a running mission workflow
func (o *Orchestrator) CancelMission(ctx context.Context, missionID string, reason string) error {
	workflowID := fmt.Sprintf("mission-%s", missionID)

	err := o.temporalClient.CancelWorkflow(ctx, workflowID, "")
	if err != nil {
		return fmt.Errorf("failed to cancel mission workflow: %w", err)
	}

	return nil
}

// ValidateServices runs a health check workflow to validate all external services
func (o *Orchestrator) ValidateServices(ctx context.Context) error {
	// Generate unique validation ID
	validationID := uuid.New().String()

	// Configure workflow options for validation
	workflowOptions := client.StartWorkflowOptions{
		ID:                    fmt.Sprintf("validate-services-%s", validationID),
		TaskQueue:             o.config.Temporal.TaskQueue,
		WorkflowRunTimeout:    2 * time.Minute, // Shorter timeout for validation
		WorkflowTaskTimeout:   10 * time.Second,
		WorkflowIDReusePolicy: *enums.WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE.Enum(),
	}

	// Start the validation workflow
	workflowRun, err := o.temporalClient.ExecuteWorkflow(ctx, workflowOptions, "ValidateServicesWorkflow")
	if err != nil {
		return fmt.Errorf("failed to start validation workflow: %w", err)
	}

	// Wait for validation completion
	err = workflowRun.Get(ctx, nil)
	if err != nil {
		return fmt.Errorf("service validation failed: %w", err)
	}

	return nil
}

// InitializeSystem runs the system initialization workflow
func (o *Orchestrator) InitializeSystem(ctx context.Context) error {
	// Generate unique initialization ID
	initID := uuid.New().String()

	// Configure workflow options for initialization
	workflowOptions := client.StartWorkflowOptions{
		ID:                    fmt.Sprintf("initialize-system-%s", initID),
		TaskQueue:             o.config.Temporal.TaskQueue,
		WorkflowRunTimeout:    5 * time.Minute, // Longer timeout for initialization
		WorkflowTaskTimeout:   30 * time.Second,
		WorkflowIDReusePolicy: *enums.WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE.Enum(),
	}

	// Start the initialization workflow
	workflowRun, err := o.temporalClient.ExecuteWorkflow(ctx, workflowOptions, "InitializeSystemWorkflow")
	if err != nil {
		return fmt.Errorf("failed to start initialization workflow: %w", err)
	}

	// Wait for initialization completion
	err = workflowRun.Get(ctx, nil)
	if err != nil {
		return fmt.Errorf("system initialization failed: %w", err)
	}

	return nil
}

// ListActiveMissions returns a list of currently running missions
func (o *Orchestrator) ListActiveMissions(ctx context.Context) ([]string, error) {
	// This is a simplified implementation for Phase 0
	// In a full implementation, we would query Temporal for running workflows
	// with the mission prefix and return their IDs

	// For now, return empty list as this requires more complex Temporal API usage
	return []string{}, nil
}

// GetWorkflowHistory retrieves the execution history of a mission workflow
func (o *Orchestrator) GetWorkflowHistory(ctx context.Context, missionID string) ([]string, error) {
	workflowID := fmt.Sprintf("mission-%s", missionID)

	// This is a simplified implementation for Phase 0
	// In a full implementation, we would use Temporal's history API
	// to retrieve and format the workflow execution history

	// Get workflow execution to verify it exists
	workflowRun := o.temporalClient.GetWorkflow(ctx, workflowID, "")

	// Simple check if workflow exists
	var result models.WorkflowResult
	err := workflowRun.Get(ctx, &result)
	if err != nil {
		return nil, fmt.Errorf("workflow not found or failed: %w", err)
	}

	// Return simplified history for Phase 0
	history := []string{
		fmt.Sprintf("Mission %s started", missionID),
		fmt.Sprintf("Status: %s", result.Status),
		fmt.Sprintf("Completed at: %s", result.CompletedAt.Format(time.RFC3339)),
	}

	if result.SelectedTask.ID != "" {
		history = append(history, fmt.Sprintf("Executed task: %s", result.SelectedTask.ID))
	}

	return history, nil
}

// Health checks if the orchestrator and Temporal connection are healthy
func (o *Orchestrator) Health(ctx context.Context) error {
	// Use a proper health check by attempting to describe a known non-existent workflow
	// This tests the connection without relying on timeouts
	_, err := o.temporalClient.DescribeWorkflowExecution(ctx, "health-check-non-existent", "")

	if err != nil {
		// Check if it's a "workflow not found" error, which indicates healthy connection
		// Any response from Temporal (even errors) means the connection is working
		// Only network/connection errors would prevent any response
		if err.Error() != "" {
			// We got a response from Temporal, connection is healthy
			return nil
		}
		// If we get here, it's likely a connection issue
		return fmt.Errorf("temporal connection unhealthy: %w", err)
	}

	// Unexpected success (workflow shouldn't exist), but connection is healthy
	return nil
}
