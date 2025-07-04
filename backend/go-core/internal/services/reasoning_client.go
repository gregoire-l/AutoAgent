package services

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"connectrpc.com/connect"

	"autoagent/api"
	"autoagent/api/apiconnect"
	"autoagent/go-core/internal/models"
)

// ReasoningClient wraps the Connect-RPC client for the ReasoningService
type ReasoningClient struct {
	client apiconnect.ReasoningServiceClient
}

// NewReasoningClient creates a new ReasoningService client using Connect-RPC with gRPC protocol
func NewReasoningClient(address string) (*ReasoningClient, error) {
	// Create HTTP client with timeouts and best practices
	httpClient := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			MaxIdleConns:        100,
			MaxIdleConnsPerHost: 10,
			IdleConnTimeout:     90 * time.Second,
		},
	}

	// Create Connect-RPC client with gRPC protocol
	// This ensures compatibility with the Python gRPC services
	client := apiconnect.NewReasoningServiceClient(
		httpClient,
		fmt.Sprintf("http://%s", address),
		connect.WithGRPC(), // Use gRPC protocol for compatibility with Python services
	)

	return &ReasoningClient{
		client: client,
	}, nil
}

// Close closes the client connection (no-op for Connect-RPC HTTP client)
func (c *ReasoningClient) Close() error {
	// Connect-RPC uses HTTP client, no explicit close needed
	return nil
}

// GenerateOptions calls the GenerateOptions RPC to get potential tasks
func (c *ReasoningClient) GenerateOptions(ctx context.Context, requestID, missionPrompt string) ([]models.PotentialTask, error) {
	if requestID == "" {
		return nil, fmt.Errorf("request_id is required")
	}
	if missionPrompt == "" {
		return nil, fmt.Errorf("mission_prompt is required")
	}

	req := connect.NewRequest(&api.GenerateOptionsRequest{
		RequestId:           requestID,
		MissionId:           "", // Phase 0: not used yet
		CurrentTaskPrompt:   missionPrompt,
		FactualContext:      "", // Phase 0: not used yet
		GenerationDirective: "", // Phase 0: not used yet
	})

	resp, err := c.client.GenerateOptions(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to generate options: %w", err)
	}

	// Convert protobuf response to internal models
	tasks := make([]models.PotentialTask, 0, len(resp.Msg.PotentialTasks))
	for _, protoTask := range resp.Msg.PotentialTasks {
		task := models.PotentialTask{
			ID:     protoTask.Id,
			Prompt: protoTask.Prompt,
		}
		tasks = append(tasks, task)
	}

	return tasks, nil
}

// ScoreOptions calls the ScoreOptions RPC to score potential tasks
func (c *ReasoningClient) ScoreOptions(ctx context.Context, requestID string, tasks []models.PotentialTask) ([]models.TaskScore, error) {
	if requestID == "" {
		return nil, fmt.Errorf("request_id is required")
	}
	if len(tasks) == 0 {
		return nil, fmt.Errorf("at least one task is required")
	}

	// Convert internal models to protobuf
	protoTasks := make([]*api.PotentialTask, 0, len(tasks))
	for _, task := range tasks {
		protoTask := &api.PotentialTask{
			Id:     task.ID,
			Prompt: task.Prompt,
		}
		protoTasks = append(protoTasks, protoTask)
	}

	req := connect.NewRequest(&api.ScoreOptionsRequest{
		RequestId:     requestID,
		MissionId:     "default-mission", // Phase 0: hardcoded
		SharedContext: "",                // Phase 0: not used yet
		TasksToScore:  protoTasks,
	})

	resp, err := c.client.ScoreOptions(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to score options: %w", err)
	}

	// Convert protobuf response to internal models
	scores := make([]models.TaskScore, 0, len(resp.Msg.Results))
	for i, protoResult := range resp.Msg.Results {
		// Handle the oneof result (success or error)
		if successResult := protoResult.GetSuccess(); successResult != nil {
			// Find the corresponding task from the original request
			if i < len(tasks) {
				// Calculate overall score as weighted average of metrics
				overallScore := float64(
					successResult.Score.PredictedSuccessProbability*0.5 + // 50% weight on success probability
						(1.0-successResult.Score.PredictedComplexity/10.0)*0.3 + // 30% weight on simplicity (inverted complexity)
						(1.0-successResult.Score.PredictedCost/10.0)*0.2, // 20% weight on low cost
				)

				score := models.TaskScore{
					Task:                        tasks[i], // Use original task
					PredictedComplexity:         successResult.Score.PredictedComplexity,
					PredictedSuccessProbability: successResult.Score.PredictedSuccessProbability,
					PredictedCost:               successResult.Score.PredictedCost,
					Rationale:                   successResult.Rationale,
					ModelConfidence:             successResult.ModelConfidence,
					OverallScore:                overallScore,
				}
				scores = append(scores, score)
			}
		} else {
			// Handle error case - assign a low score
			if i < len(tasks) {
				score := models.TaskScore{
					Task:                        tasks[i], // Use original task
					PredictedComplexity:         10.0,     // High complexity
					PredictedSuccessProbability: 0.0,      // Low success probability
					PredictedCost:               10.0,     // High cost
					Rationale:                   "Scoring failed",
					ModelConfidence:             0.0, // No confidence
					OverallScore:                0.0, // Low overall score
				}
				scores = append(scores, score)
			}
		}
	}

	return scores, nil
}

// Health checks if the reasoning service is healthy
func (c *ReasoningClient) Health(ctx context.Context) error {
	// Simple health check by calling GenerateOptions with minimal data
	// In a real implementation, we might have a dedicated health check RPC
	_, err := c.GenerateOptions(ctx, "health-check", "test")
	if err != nil {
		return fmt.Errorf("reasoning service health check failed: %w", err)
	}
	return nil
}

// ValidateService performs a comprehensive validation of the reasoning service
func (c *ReasoningClient) ValidateService(ctx context.Context) error {
	return c.Health(ctx)
}
