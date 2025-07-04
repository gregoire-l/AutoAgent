package activities

import (
	"autoagent/go-core/internal/config"
	"autoagent/go-core/internal/services"
	"context"
)

// Dependencies holds all external dependencies needed by activities
// This enables dependency injection for better testability
type Dependencies struct {
	Config          *config.Config
	ReasoningClient services.ReasoningClientInterface
	AgentClient     services.AgentClientInterface
	Neo4jClient     services.Neo4jClientInterface
}

// NewDependencies creates a new Dependencies instance with real implementations
func NewDependencies(cfg *config.Config) (*Dependencies, error) {
	// Create reasoning client
	reasoningClient, err := services.NewReasoningClient(cfg.GetReasoningServiceAddress())
	if err != nil {
		return nil, err
	}

	// Create agent client
	agentClient, err := services.NewAgentClient(cfg.GetAgentServiceAddress())
	if err != nil {
		reasoningClient.Close()
		return nil, err
	}

	// Create Neo4j client
	neo4jClient, err := services.NewNeo4jClient(cfg.Neo4j.URI, cfg.Neo4j.Username, cfg.Neo4j.Password)
	if err != nil {
		reasoningClient.Close()
		agentClient.Close()
		return nil, err
	}

	return &Dependencies{
		Config:          cfg,
		ReasoningClient: reasoningClient,
		AgentClient:     agentClient,
		Neo4jClient:     neo4jClient,
	}, nil
}

// Close closes all client connections
func (d *Dependencies) Close() {
	ctx := context.Background()
	if d.ReasoningClient != nil {
		d.ReasoningClient.Close()
	}
	if d.AgentClient != nil {
		d.AgentClient.Close()
	}
	if d.Neo4jClient != nil {
		d.Neo4jClient.Close(ctx)
	}
}
