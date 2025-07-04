package testutils

import (
	"context"

	"github.com/stretchr/testify/mock"
	"go.temporal.io/api/workflowservice/v1"
	"go.temporal.io/sdk/client"

	"autoagent/go-core/internal/models"
)

// MockReasoningClient is a mock implementation of ReasoningClientInterface
type MockReasoningClient struct {
	mock.Mock
}

func (m *MockReasoningClient) GenerateOptions(ctx context.Context, requestID, missionPrompt string) ([]models.PotentialTask, error) {
	args := m.Called(ctx, requestID, missionPrompt)
	return args.Get(0).([]models.PotentialTask), args.Error(1)
}

func (m *MockReasoningClient) ScoreOptions(ctx context.Context, requestID string, tasks []models.PotentialTask) ([]models.TaskScore, error) {
	args := m.Called(ctx, requestID, tasks)
	return args.Get(0).([]models.TaskScore), args.Error(1)
}

func (m *MockReasoningClient) ValidateService(ctx context.Context) error {
	args := m.Called(ctx)
	return args.Error(0)
}

func (m *MockReasoningClient) Close() error {
	args := m.Called()
	return args.Error(0)
}

// MockAgentClient is a mock implementation of AgentClientInterface
type MockAgentClient struct {
	mock.Mock
}

func (m *MockAgentClient) StartSession(ctx context.Context, requestID string, task models.PotentialTask) (string, error) {
	args := m.Called(ctx, requestID, task)
	return args.String(0), args.Error(1)
}

func (m *MockAgentClient) ExecuteStep(ctx context.Context, sessionID, directive string) (models.AgentResult, error) {
	args := m.Called(ctx, sessionID, directive)
	return args.Get(0).(models.AgentResult), args.Error(1)
}

func (m *MockAgentClient) StopSession(ctx context.Context, requestID, sessionID string, success bool) error {
	args := m.Called(ctx, requestID, sessionID, success)
	return args.Error(0)
}

func (m *MockAgentClient) Health(ctx context.Context) error {
	args := m.Called(ctx)
	return args.Error(0)
}

func (m *MockAgentClient) ValidateService(ctx context.Context) error {
	args := m.Called(ctx)
	return args.Error(0)
}

func (m *MockAgentClient) Close() error {
	args := m.Called()
	return args.Error(0)
}

// MockNeo4jClient is a mock implementation of Neo4jClientInterface
type MockNeo4jClient struct {
	mock.Mock
}

func (m *MockNeo4jClient) WriteMissionResult(ctx context.Context, mission models.Mission, task models.PotentialTask, result models.AgentResult) error {
	args := m.Called(ctx, mission, task, result)
	return args.Error(0)
}

func (m *MockNeo4jClient) GetMissionStatus(ctx context.Context, missionID string) (string, error) {
	args := m.Called(ctx, missionID)
	return args.String(0), args.Error(1)
}

func (m *MockNeo4jClient) GetMissionTasks(ctx context.Context, missionID string) ([]models.Neo4jTaskNode, error) {
	args := m.Called(ctx, missionID)
	return args.Get(0).([]models.Neo4jTaskNode), args.Error(1)
}

func (m *MockNeo4jClient) Health(ctx context.Context) error {
	args := m.Called(ctx)
	return args.Error(0)
}

func (m *MockNeo4jClient) CreateIndexes(ctx context.Context) error {
	args := m.Called(ctx)
	return args.Error(0)
}

func (m *MockNeo4jClient) ValidateService(ctx context.Context) error {
	args := m.Called(ctx)
	return args.Error(0)
}

func (m *MockNeo4jClient) Close(ctx context.Context) error {
	args := m.Called(ctx)
	return args.Error(0)
}

// MockTemporalClient is a mock implementation of Temporal client
type MockTemporalClient struct {
	mock.Mock
}

func (m *MockTemporalClient) ExecuteWorkflow(ctx context.Context, options client.StartWorkflowOptions, workflow interface{}, args ...interface{}) (client.WorkflowRun, error) {
	mockArgs := m.Called(ctx, options, workflow, args)
	return mockArgs.Get(0).(client.WorkflowRun), mockArgs.Error(1)
}

func (m *MockTemporalClient) GetWorkflow(ctx context.Context, workflowID string, runID string) client.WorkflowRun {
	args := m.Called(ctx, workflowID, runID)
	return args.Get(0).(client.WorkflowRun)
}

func (m *MockTemporalClient) DescribeWorkflowExecution(ctx context.Context, workflowID, runID string) (*workflowservice.DescribeWorkflowExecutionResponse, error) {
	args := m.Called(ctx, workflowID, runID)
	return args.Get(0).(*workflowservice.DescribeWorkflowExecutionResponse), args.Error(1)
}

func (m *MockTemporalClient) CancelWorkflow(ctx context.Context, workflowID string, runID string) error {
	args := m.Called(ctx, workflowID, runID)
	return args.Error(0)
}

func (m *MockTemporalClient) Close() {
	m.Called()
}

// MockWorkflowRun is a mock implementation of WorkflowRun
type MockWorkflowRun struct {
	mock.Mock
}

func (m *MockWorkflowRun) GetID() string {
	args := m.Called()
	return args.String(0)
}

func (m *MockWorkflowRun) GetRunID() string {
	args := m.Called()
	return args.String(0)
}

func (m *MockWorkflowRun) Get(ctx context.Context, valuePtr interface{}) error {
	args := m.Called(ctx, valuePtr)
	return args.Error(0)
}

func (m *MockWorkflowRun) GetWithOptions(ctx context.Context, valuePtr interface{}, options client.WorkflowRunGetOptions) error {
	args := m.Called(ctx, valuePtr, options)
	return args.Error(0)
}

// Test data factories for consistent test data creation

// CreateTestPotentialTask creates a test PotentialTask
func CreateTestPotentialTask(id, prompt string) models.PotentialTask {
	return models.PotentialTask{
		ID:     id,
		Prompt: prompt,
	}
}

// CreateTestTaskScore creates a test TaskScore
func CreateTestTaskScore(task models.PotentialTask, score float64) models.TaskScore {
	return models.TaskScore{
		Task:                        task,
		PredictedComplexity:         5.0,
		PredictedSuccessProbability: 0.8,
		PredictedCost:               3.0,
		Rationale:                   "Test rationale",
		ModelConfidence:             0.9,
		OverallScore:                score,
	}
}

// CreateTestAgentResult creates a test AgentResult
func CreateTestAgentResult(sessionID, taskID, status string) models.AgentResult {
	return models.AgentResult{
		SessionID: sessionID,
		TaskID:    taskID,
		Status:    status,
		Output:    "Test output",
		Error:     "",
	}
}

// CreateTestMission creates a test Mission
func CreateTestMission(id, prompt string) *models.Mission {
	return models.NewMission(id, prompt)
}
