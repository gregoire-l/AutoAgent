package services_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"go.temporal.io/sdk/testsuite"

	"autoagent/go-core/internal/activities"
	"autoagent/go-core/internal/config"
	"autoagent/go-core/internal/models"
	"autoagent/go-core/tests/unit/testutils"
)

// ActivitiesTestSuite groups all activity-related tests using Temporal Test Suite
type ActivitiesTestSuite struct {
	suite.Suite
	testsuite.WorkflowTestSuite
	mockReasoningClient *testutils.MockReasoningClient
	mockAgentClient     *testutils.MockAgentClient
	mockNeo4jClient     *testutils.MockNeo4jClient
	deps                *activities.Dependencies
	env                 *testsuite.TestActivityEnvironment
}

// SetupTest initializes mocks and dependencies for each test
func (suite *ActivitiesTestSuite) SetupTest() {
	// Initialize Temporal test environment
	suite.env = suite.NewTestActivityEnvironment()

	suite.mockReasoningClient = &testutils.MockReasoningClient{}
	suite.mockAgentClient = &testutils.MockAgentClient{}
	suite.mockNeo4jClient = &testutils.MockNeo4jClient{}

	// Create test configuration
	testConfig := &config.Config{
		Server: config.ServerConfig{
			Port: "50051",
		},
		ReasoningService: config.ReasoningServiceConfig{
			Host: "test-reasoning",
			Port: "50052",
		},
		AgentService: config.AgentServiceConfig{
			Host: "test-agent",
			Port: "50053",
		},
		Neo4j: config.Neo4jConfig{
			URI:      "bolt://test-neo4j:7687",
			Username: "test",
			Password: "test",
		},
		Temporal: config.TemporalConfig{
			HostPort:  "test-temporal:7233",
			Namespace: "test",
			TaskQueue: "test-queue",
		},
	}

	// Create dependencies with mocks
	suite.deps = &activities.Dependencies{
		Config:          testConfig,
		ReasoningClient: suite.mockReasoningClient,
		AgentClient:     suite.mockAgentClient,
		Neo4jClient:     suite.mockNeo4jClient,
	}
}

// TearDownTest cleans up after each test
func (suite *ActivitiesTestSuite) TearDownTest() {
	suite.mockReasoningClient.AssertExpectations(suite.T())
	suite.mockAgentClient.AssertExpectations(suite.T())
	suite.mockNeo4jClient.AssertExpectations(suite.T())
}

// TestActivitiesTestSuite runs the test suite
func TestActivitiesTestSuite(t *testing.T) {
	suite.Run(t, new(ActivitiesTestSuite))
}

// TestGenerateOptionsActivity tests the GenerateOptions activity using Temporal Test Suite
func (suite *ActivitiesTestSuite) TestGenerateOptionsActivity() {
	// Arrange
	missionPrompt := "hello_world"
	expectedTasks := []models.PotentialTask{
		testutils.CreateTestPotentialTask("task-1", "Write a 'hello_world.py' script."),
		testutils.CreateTestPotentialTask("task-2", "List files in the current directory."),
	}

	// Configure mock expectations
	suite.mockReasoningClient.On("GenerateOptions", mock.Anything, mock.AnythingOfType("string"), missionPrompt).
		Return(expectedTasks, nil)

	// Set up the activity with mocked dependencies
	activities.SetGlobalDependencies(suite.deps)

	// Register the activity
	suite.env.RegisterActivity(activities.GenerateOptionsActivity)

	// Act - Execute activity in Temporal test environment
	val, err := suite.env.ExecuteActivity(activities.GenerateOptionsActivity, missionPrompt)

	// Assert
	assert.NoError(suite.T(), err)

	var result []models.PotentialTask
	err = val.Get(&result)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), expectedTasks, result)
	assert.Len(suite.T(), result, 2)
}

// TestGenerateOptionsActivity_EmptyTasks tests error handling for empty tasks
func (suite *ActivitiesTestSuite) TestGenerateOptionsActivity_EmptyTasks() {
	// Arrange
	missionPrompt := "hello_world"
	emptyTasks := []models.PotentialTask{}

	// Configure mock to return empty tasks
	suite.mockReasoningClient.On("GenerateOptions", mock.Anything, mock.AnythingOfType("string"), missionPrompt).
		Return(emptyTasks, nil)

	// Set up the activity with mocked dependencies
	activities.SetGlobalDependencies(suite.deps)
	suite.env.RegisterActivity(activities.GenerateOptionsActivity)

	// Act
	val, err := suite.env.ExecuteActivity(activities.GenerateOptionsActivity, missionPrompt)

	// Assert
	assert.Error(suite.T(), err)
	assert.Contains(suite.T(), err.Error(), "reasoning service returned no potential tasks")
	assert.Nil(suite.T(), val)
}

// TestScoreOptionsActivity tests the ScoreOptions activity
func (suite *ActivitiesTestSuite) TestScoreOptionsActivity() {
	// Arrange
	tasks := []models.PotentialTask{
		testutils.CreateTestPotentialTask("task-1", "Write a 'hello_world.py' script."),
		testutils.CreateTestPotentialTask("task-2", "List files in the current directory."),
	}

	expectedScores := []models.TaskScore{
		testutils.CreateTestTaskScore(tasks[0], 8.5),
		testutils.CreateTestTaskScore(tasks[1], 7.2),
	}

	// Configure mock expectations
	suite.mockReasoningClient.On("ScoreOptions", mock.Anything, mock.AnythingOfType("string"), tasks).
		Return(expectedScores, nil)

	// Set up the activity with mocked dependencies
	activities.SetGlobalDependencies(suite.deps)
	suite.env.RegisterActivity(activities.ScoreOptionsActivity)

	// Act
	val, err := suite.env.ExecuteActivity(activities.ScoreOptionsActivity, tasks)

	// Assert
	assert.NoError(suite.T(), err)

	var result []models.TaskScore
	err = val.Get(&result)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), expectedScores, result)
	assert.Len(suite.T(), result, 2)
	// Verify sorting (highest score first)
	assert.True(suite.T(), result[0].OverallScore >= result[1].OverallScore)
}

// TestScoreOptionsActivity_EmptyTasks tests error handling for empty tasks
func (suite *ActivitiesTestSuite) TestScoreOptionsActivity_EmptyTasks() {
	// Set up the activity with mocked dependencies
	activities.SetGlobalDependencies(suite.deps)
	suite.env.RegisterActivity(activities.ScoreOptionsActivity)

	// Act
	val, err := suite.env.ExecuteActivity(activities.ScoreOptionsActivity, []models.PotentialTask{})

	// Assert
	assert.Error(suite.T(), err)
	assert.Contains(suite.T(), err.Error(), "no tasks provided for scoring")
	assert.Nil(suite.T(), val)
}

// TestValidateReasoningServiceActivity tests the validation activity
func (suite *ActivitiesTestSuite) TestValidateReasoningServiceActivity() {
	// Arrange
	suite.mockReasoningClient.On("ValidateService", mock.Anything).Return(nil)

	// Set up the activity with mocked dependencies
	activities.SetGlobalDependencies(suite.deps)
	suite.env.RegisterActivity(activities.ValidateReasoningServiceActivity)

	// Act
	val, err := suite.env.ExecuteActivity(activities.ValidateReasoningServiceActivity)

	// Assert
	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), val)
}

// TestValidateReasoningServiceActivity_ServiceError tests error handling
func (suite *ActivitiesTestSuite) TestValidateReasoningServiceActivity_ServiceError() {
	// Arrange
	expectedError := assert.AnError
	suite.mockReasoningClient.On("ValidateService", mock.Anything).Return(expectedError)

	// Set up the activity with mocked dependencies
	activities.SetGlobalDependencies(suite.deps)
	suite.env.RegisterActivity(activities.ValidateReasoningServiceActivity)

	// Act
	val, err := suite.env.ExecuteActivity(activities.ValidateReasoningServiceActivity)

	// Assert
	assert.Error(suite.T(), err)
	assert.Contains(suite.T(), err.Error(), "reasoning service validation failed")
	assert.Nil(suite.T(), val)
}

// Benchmark tests for performance validation
func BenchmarkGenerateOptionsActivity(b *testing.B) {
	// Setup
	mockClient := &testutils.MockReasoningClient{}
	deps := &activities.Dependencies{
		ReasoningClient: mockClient,
	}

	tasks := []models.PotentialTask{
		testutils.CreateTestPotentialTask("task-1", "test task"),
	}

	mockClient.On("GenerateOptions", mock.Anything, mock.Anything, mock.Anything).Return(tasks, nil)

	// Set global dependencies for the activity
	activities.SetGlobalDependencies(deps)

	// Use Temporal Test Suite for benchmarking
	testSuite := &testsuite.WorkflowTestSuite{}
	env := testSuite.NewTestActivityEnvironment()
	env.RegisterActivity(activities.GenerateOptionsActivity)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		env.ExecuteActivity(activities.GenerateOptionsActivity, "test")
	}
}
