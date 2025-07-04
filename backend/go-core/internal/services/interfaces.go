package services

import (
	"context"

	"autoagent/go-core/internal/models"
)

// ReasoningClientInterface defines the interface for reasoning service operations
type ReasoningClientInterface interface {
	GenerateOptions(ctx context.Context, requestID, missionPrompt string) ([]models.PotentialTask, error)
	ScoreOptions(ctx context.Context, requestID string, tasks []models.PotentialTask) ([]models.TaskScore, error)
	ValidateService(ctx context.Context) error
	Close() error
}

// AgentClientInterface defines the interface for agent service operations
type AgentClientInterface interface {
	StartSession(ctx context.Context, requestID string, task models.PotentialTask) (string, error)
	ExecuteStep(ctx context.Context, sessionID, directive string) (models.AgentResult, error)
	StopSession(ctx context.Context, requestID, sessionID string, success bool) error
	Health(ctx context.Context) error
	ValidateService(ctx context.Context) error
	Close() error
}

// Neo4jClientInterface defines the interface for Neo4j operations
type Neo4jClientInterface interface {
	WriteMissionResult(ctx context.Context, mission models.Mission, task models.PotentialTask, result models.AgentResult) error
	GetMissionStatus(ctx context.Context, missionID string) (string, error)
	GetMissionTasks(ctx context.Context, missionID string) ([]models.Neo4jTaskNode, error)
	Health(ctx context.Context) error
	CreateIndexes(ctx context.Context) error
	ValidateService(ctx context.Context) error
	Close(ctx context.Context) error
}

// Ensure concrete types implement interfaces
var (
	_ ReasoningClientInterface = (*ReasoningClient)(nil)
	_ AgentClientInterface     = (*AgentClient)(nil)
	_ Neo4jClientInterface     = (*Neo4jClient)(nil)
)
