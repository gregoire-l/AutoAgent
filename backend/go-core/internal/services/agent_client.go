package services

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/durationpb"

	"autoagent/api"
	"autoagent/api/apiconnect"
	"autoagent/go-core/internal/models"
)

// AgentClient wraps the Connect-RPC client for the AgentSessionService
type AgentClient struct {
	client apiconnect.AgentSessionServiceClient
}

// NewAgentClient creates a new AgentSessionService client using Connect-RPC with gRPC protocol
func NewAgentClient(address string) (*AgentClient, error) {
	// Create HTTP client with timeouts and best practices
	httpClient := &http.Client{
		Timeout: 60 * time.Second, // Longer timeout for agent operations
		Transport: &http.Transport{
			MaxIdleConns:        100,
			MaxIdleConnsPerHost: 10,
			IdleConnTimeout:     90 * time.Second,
		},
	}

	// Create Connect-RPC client with gRPC protocol
	// This ensures compatibility with the Python gRPC services
	client := apiconnect.NewAgentSessionServiceClient(
		httpClient,
		fmt.Sprintf("http://%s", address),
		connect.WithGRPC(), // Use gRPC protocol for compatibility with Python services
	)

	return &AgentClient{
		client: client,
	}, nil
}

// Close closes the client connection (no-op for Connect-RPC HTTP client)
func (c *AgentClient) Close() error {
	// Connect-RPC uses HTTP client, no explicit close needed
	return nil
}

// StartSession starts a new agent session
func (c *AgentClient) StartSession(ctx context.Context, requestID string, task models.PotentialTask) (string, error) {
	if requestID == "" {
		return "", fmt.Errorf("request_id is required")
	}

	req := connect.NewRequest(&api.StartSessionRequest{
		RequestId: requestID,
		AgentProfile: &api.AgentProfile{
			ProfileId: "default-profile", // Phase 0: using default profile
			RequiredTools: []*api.Tool{
				{
					Name:    "shell",
					Version: "1.0",
				},
			},
		},
		InitialWorkspace: &api.WorkspaceReference{
			Repository: "default-repo", // Phase 0: using default workspace
			Branch:     "main",
		},
	})

	resp, err := c.client.StartSession(ctx, req)
	if err != nil {
		return "", fmt.Errorf("failed to start agent session: %w", err)
	}

	return resp.Msg.SessionId, nil
}

// ExecuteStep executes a step in an agent session
// Note: This is a simplified version for Phase 0. The actual implementation
// should handle bidirectional streaming for real-time observability.
func (c *AgentClient) ExecuteStep(ctx context.Context, sessionID, directive string) (models.AgentResult, error) {
	if sessionID == "" {
		return models.AgentResult{}, fmt.Errorf("session_id is required")
	}
	if directive == "" {
		return models.AgentResult{}, fmt.Errorf("directive is required")
	}

	// For Phase 0, we'll use a simplified approach
	// In a full implementation, this would use bidirectional streaming
	stream := c.client.ExecuteStep(ctx)

	// Send the execute step request
	err := stream.Send(&api.ExecuteStepRequest{
		RequestId: fmt.Sprintf("exec-%d", time.Now().UnixNano()),
		SessionId: sessionID,
		Directive: directive,
		Timeout:   durationpb.New(30 * time.Second), // 30 second timeout
	})
	if err != nil {
		return models.AgentResult{}, fmt.Errorf("failed to send execute step request: %w", err)
	}

	// Close the send side
	err = stream.CloseRequest()
	if err != nil {
		return models.AgentResult{}, fmt.Errorf("failed to close request stream: %w", err)
	}

	// Read responses until we get a result
	var result models.AgentResult
	result.SessionID = sessionID
	result.Status = string(models.AgentExecutionStatusFailure) // Default to failure

	for {
		resp, err := stream.Receive()
		if err != nil {
			// Check if this is the end of the stream (EOF)
			if errors.Is(err, io.EOF) {
				break
			}
			return result, fmt.Errorf("stream receive error: %w", err)
		}

		switch event := resp.Event.(type) {
		case *api.ExecuteStepResponse_LogChunk:
			// For Phase 0, we'll accumulate log chunks into output
			if event.LogChunk.Stream == api.LogChunk_STREAM_STDOUT {
				result.Output += string(event.LogChunk.Content)
			} else if event.LogChunk.Stream == api.LogChunk_STREAM_STDERR {
				result.Error += string(event.LogChunk.Content)
			}

		case *api.ExecuteStepResponse_Result:
			// This is the final result
			result.Status = string(models.AgentExecutionStatusSuccess)
			result.Output = event.Result.Summary
			if event.Result.LastStdout != "" {
				result.Output += "\n" + event.Result.LastStdout
			}
			if event.Result.LastStderr != "" {
				result.Error = event.Result.LastStderr
			}
			return result, nil

		case *api.ExecuteStepResponse_Error:
			result.Error = event.Error.Message
			return result, fmt.Errorf("agent execution failed: %s", event.Error.Message)
		}
	}

	return result, nil
}

// StopSession stops an agent session
func (c *AgentClient) StopSession(ctx context.Context, requestID, sessionID string, success bool) error {
	if requestID == "" {
		return fmt.Errorf("request_id is required")
	}
	if sessionID == "" {
		return fmt.Errorf("session_id is required")
	}

	finalStatus := api.FinalStatus_FINAL_STATUS_FAILURE
	commitMessage := ""

	if success {
		finalStatus = api.FinalStatus_FINAL_STATUS_SUCCESS
		commitMessage = "Task completed successfully" // Phase 0: simple commit message
	}

	req := connect.NewRequest(&api.StopSessionRequest{
		RequestId:     requestID,
		SessionId:     sessionID,
		FinalStatus:   finalStatus,
		CommitMessage: commitMessage,
	})

	_, err := c.client.StopSession(ctx, req)
	if err != nil {
		return fmt.Errorf("failed to stop agent session: %w", err)
	}

	return nil
}

// Health checks if the agent service is healthy
func (c *AgentClient) Health(ctx context.Context) error {
	// Simple health check by attempting to start and immediately stop a session
	sessionID, err := c.StartSession(ctx, "health-check", models.PotentialTask{
		ID:     "health-check",
		Prompt: "health check",
	})
	if err != nil {
		return fmt.Errorf("agent service health check failed: %w", err)
	}

	// Clean up the health check session
	err = c.StopSession(ctx, "health-check-stop", sessionID, false)
	if err != nil {
		// Log but don't fail health check for cleanup issues
		// In a real implementation, we'd use proper logging
		fmt.Printf("Warning: failed to clean up health check session: %v\n", err)
	}

	return nil
}

// ValidateService performs a comprehensive validation of the agent service
func (c *AgentClient) ValidateService(ctx context.Context) error {
	return c.Health(ctx)
}
