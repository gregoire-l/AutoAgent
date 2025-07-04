package services

import (
	"context"
	"fmt"
	"time"

	"github.com/neo4j/neo4j-go-driver/v5/neo4j"

	"autoagent/go-core/internal/models"
)

// Neo4jClient wraps the Neo4j driver for knowledge graph operations
type Neo4jClient struct {
	driver neo4j.DriverWithContext
}

// NewNeo4jClient creates a new Neo4j client with best practices configuration
func NewNeo4jClient(uri, username, password string) (*Neo4jClient, error) {
	// Configure Neo4j driver with best practices
	config := func(conf *neo4j.Config) {
		conf.MaxConnectionPoolSize = 50
		conf.MaxConnectionLifetime = 5 * time.Minute
		conf.ConnectionAcquisitionTimeout = 2 * time.Minute
		conf.SocketConnectTimeout = 5 * time.Second
		conf.SocketKeepalive = true
		// Enable logging for debugging (can be disabled in production)
		conf.Log = neo4j.ConsoleLogger(neo4j.WARNING)
	}

	driver, err := neo4j.NewDriverWithContext(uri, neo4j.BasicAuth(username, password, ""), config)
	if err != nil {
		return nil, fmt.Errorf("failed to create Neo4j driver: %w", err)
	}

	// Test the connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = driver.VerifyConnectivity(ctx)
	if err != nil {
		driver.Close(ctx)
		return nil, fmt.Errorf("failed to verify Neo4j connectivity: %w", err)
	}

	return &Neo4jClient{
		driver: driver,
	}, nil
}

// Close closes the Neo4j driver connection
func (c *Neo4jClient) Close(ctx context.Context) error {
	return c.driver.Close(ctx)
}

// WriteMissionResult writes a mission and its associated task to the knowledge graph
func (c *Neo4jClient) WriteMissionResult(ctx context.Context, mission models.Mission, task models.PotentialTask, result models.AgentResult) error {
	// Use ExecuteQuery for simple operations (recommended approach in v5)
	query := `
		CREATE (m:Mission {
			id: $missionId,
			status: $missionStatus,
			prompt: $missionPrompt,
			createdAt: $missionCreatedAt,
			updatedAt: $missionUpdatedAt
		})
		CREATE (t:Task {
			id: $taskId,
			prompt: $taskPrompt,
			status: $taskStatus,
			output: $taskOutput,
			error: $taskError,
			sessionId: $sessionId
		})
		CREATE (m)-[:EXECUTED]->(t)
		RETURN m.id as missionId, t.id as taskId
	`

	parameters := map[string]any{
		"missionId":        mission.ID,
		"missionStatus":    mission.Status,
		"missionPrompt":    mission.Prompt,
		"missionCreatedAt": mission.CreatedAt.Format(time.RFC3339),
		"missionUpdatedAt": mission.UpdatedAt.Format(time.RFC3339),
		"taskId":           task.ID,
		"taskPrompt":       task.Prompt,
		"taskStatus":       result.Status,
		"taskOutput":       result.Output,
		"taskError":        result.Error,
		"sessionId":        result.SessionID,
	}

	// Execute the query with automatic retry and transaction management
	queryResult, err := neo4j.ExecuteQuery(ctx, c.driver, query, parameters, neo4j.EagerResultTransformer)
	if err != nil {
		return fmt.Errorf("failed to write mission result to Neo4j: %w", err)
	}

	// Verify that the records were created
	if len(queryResult.Records) == 0 {
		return fmt.Errorf("no records returned from mission creation query")
	}

	// Log successful creation (in a real implementation, use proper logging)
	record := queryResult.Records[0]
	missionIdValue, _ := record.Get("missionId")
	taskIdValue, _ := record.Get("taskId")

	fmt.Printf("Successfully created Mission (id: %v) and Task (id: %v) in Neo4j\n", missionIdValue, taskIdValue)

	return nil
}

// GetMissionStatus retrieves the status of a mission from the knowledge graph
func (c *Neo4jClient) GetMissionStatus(ctx context.Context, missionID string) (string, error) {
	query := `
		MATCH (m:Mission {id: $missionId})
		RETURN m.status as status
	`

	parameters := map[string]any{
		"missionId": missionID,
	}

	result, err := neo4j.ExecuteQuery(ctx, c.driver, query, parameters, neo4j.EagerResultTransformer)
	if err != nil {
		return "", fmt.Errorf("failed to get mission status from Neo4j: %w", err)
	}

	if len(result.Records) == 0 {
		return "", fmt.Errorf("mission with ID %s not found", missionID)
	}

	status, found := result.Records[0].Get("status")
	if !found {
		return "", fmt.Errorf("status field not found in mission record")
	}

	statusStr, ok := status.(string)
	if !ok {
		return "", fmt.Errorf("status field is not a string")
	}

	return statusStr, nil
}

// GetMissionTasks retrieves all tasks associated with a mission
func (c *Neo4jClient) GetMissionTasks(ctx context.Context, missionID string) ([]models.Neo4jTaskNode, error) {
	query := `
		MATCH (m:Mission {id: $missionId})-[:EXECUTED]->(t:Task)
		RETURN t.id as id, t.prompt as prompt, t.status as status, 
		       t.output as output, t.error as error
		ORDER BY t.id
	`

	parameters := map[string]any{
		"missionId": missionID,
	}

	result, err := neo4j.ExecuteQuery(ctx, c.driver, query, parameters, neo4j.EagerResultTransformer)
	if err != nil {
		return nil, fmt.Errorf("failed to get mission tasks from Neo4j: %w", err)
	}

	tasks := make([]models.Neo4jTaskNode, 0, len(result.Records))
	for _, record := range result.Records {
		task := models.Neo4jTaskNode{}

		if id, found := record.Get("id"); found {
			if idStr, ok := id.(string); ok {
				task.ID = idStr
			}
		}

		if prompt, found := record.Get("prompt"); found {
			if promptStr, ok := prompt.(string); ok {
				task.Prompt = promptStr
			}
		}

		if status, found := record.Get("status"); found {
			if statusStr, ok := status.(string); ok {
				task.Status = statusStr
			}
		}

		if output, found := record.Get("output"); found {
			if outputStr, ok := output.(string); ok {
				task.Output = outputStr
			}
		}

		if errorMsg, found := record.Get("error"); found {
			if errorStr, ok := errorMsg.(string); ok {
				task.Error = errorStr
			}
		}

		tasks = append(tasks, task)
	}

	return tasks, nil
}

// Health checks if the Neo4j database is healthy and accessible
func (c *Neo4jClient) Health(ctx context.Context) error {
	// Simple health check by running a basic query
	query := "RETURN 1 as health_check"

	result, err := neo4j.ExecuteQuery(ctx, c.driver, query, nil, neo4j.EagerResultTransformer)
	if err != nil {
		return fmt.Errorf("Neo4j health check failed: %w", err)
	}

	if len(result.Records) == 0 {
		return fmt.Errorf("Neo4j health check returned no records")
	}

	healthValue, found := result.Records[0].Get("health_check")
	if !found {
		return fmt.Errorf("Neo4j health check did not return expected field")
	}

	if healthInt, ok := healthValue.(int64); !ok || healthInt != 1 {
		return fmt.Errorf("Neo4j health check returned unexpected value: %v", healthValue)
	}

	return nil
}

// CreateIndexes creates necessary indexes for optimal query performance
func (c *Neo4jClient) CreateIndexes(ctx context.Context) error {
	indexes := []string{
		"CREATE INDEX mission_id_index IF NOT EXISTS FOR (m:Mission) ON (m.id)",
		"CREATE INDEX task_id_index IF NOT EXISTS FOR (t:Task) ON (t.id)",
		"CREATE INDEX mission_status_index IF NOT EXISTS FOR (m:Mission) ON (m.status)",
		"CREATE INDEX task_status_index IF NOT EXISTS FOR (t:Task) ON (t.status)",
	}

	for _, indexQuery := range indexes {
		_, err := neo4j.ExecuteQuery(ctx, c.driver, indexQuery, nil, neo4j.EagerResultTransformer)
		if err != nil {
			return fmt.Errorf("failed to create index: %w", err)
		}
	}

	fmt.Println("Successfully created Neo4j indexes for optimal performance")
	return nil
}

// ValidateService performs a comprehensive validation of the Neo4j service
func (c *Neo4jClient) ValidateService(ctx context.Context) error {
	// Test connectivity
	err := c.driver.VerifyConnectivity(ctx)
	if err != nil {
		return fmt.Errorf("neo4j connectivity check failed: %w", err)
	}

	// Test basic query execution
	query := "RETURN 1 as test"
	_, err = neo4j.ExecuteQuery(ctx, c.driver, query, nil, neo4j.EagerResultTransformer)
	if err != nil {
		return fmt.Errorf("neo4j query execution test failed: %w", err)
	}

	return nil
}
