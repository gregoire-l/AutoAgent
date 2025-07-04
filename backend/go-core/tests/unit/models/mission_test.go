package models_test

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"autoagent/go-core/internal/models"
)

// MissionTestSuite groups all mission-related tests
type MissionTestSuite struct {
	suite.Suite
}

// TestMissionTestSuite runs the test suite
func TestMissionTestSuite(t *testing.T) {
	suite.Run(t, new(MissionTestSuite))
}

// TestNewMission tests mission creation with default values
func (suite *MissionTestSuite) TestNewMission() {
	// Arrange
	id := "test-mission-id"
	prompt := "test prompt"
	beforeCreation := time.Now()

	// Act
	mission := models.NewMission(id, prompt)

	// Assert
	assert.Equal(suite.T(), id, mission.ID)
	assert.Equal(suite.T(), prompt, mission.Prompt)
	assert.Equal(suite.T(), string(models.MissionStatusPending), mission.Status)
	assert.True(suite.T(), mission.CreatedAt.After(beforeCreation) || mission.CreatedAt.Equal(beforeCreation))
	assert.True(suite.T(), mission.UpdatedAt.After(beforeCreation) || mission.UpdatedAt.Equal(beforeCreation))
	assert.Equal(suite.T(), mission.CreatedAt, mission.UpdatedAt)
}

// TestMission_UpdateStatus tests status updates
func (suite *MissionTestSuite) TestMission_UpdateStatus() {
	// Arrange
	mission := models.NewMission("test-id", "test prompt")
	originalTime := mission.UpdatedAt

	// Wait a small amount to ensure time difference
	time.Sleep(1 * time.Millisecond)

	// Act
	mission.UpdateStatus(models.MissionStatusRunning)

	// Assert
	assert.Equal(suite.T(), string(models.MissionStatusRunning), mission.Status)
	assert.True(suite.T(), mission.UpdatedAt.After(originalTime))
}

// TestMission_IsCompleted tests completion status detection
func (suite *MissionTestSuite) TestMission_IsCompleted() {
	tests := []struct {
		name     string
		status   models.MissionStatus
		expected bool
	}{
		{"pending mission", models.MissionStatusPending, false},
		{"running mission", models.MissionStatusRunning, false},
		{"successful mission", models.MissionStatusSuccess, true},
		{"failed mission", models.MissionStatusFailed, true},
		{"cancelled mission", models.MissionStatusCancelled, true},
	}

	for _, tt := range tests {
		suite.T().Run(tt.name, func(t *testing.T) {
			// Arrange
			mission := models.NewMission("test-id", "test prompt")
			mission.UpdateStatus(tt.status)

			// Act
			result := mission.IsCompleted()

			// Assert
			assert.Equal(t, tt.expected, result)
		})
	}
}

// TestNewWorkflowInput tests workflow input creation
func (suite *MissionTestSuite) TestNewWorkflowInput() {
	// Arrange
	missionID := "test-mission-id"
	prompt := "test prompt"

	// Act
	input := models.NewWorkflowInput(missionID, prompt)

	// Assert
	assert.Equal(suite.T(), missionID, input.MissionID)
	assert.Equal(suite.T(), prompt, input.Prompt)
}

// TestNewWorkflowResult tests workflow result creation
func (suite *MissionTestSuite) TestNewWorkflowResult() {
	// Arrange
	missionID := "test-mission-id"
	status := models.MissionStatusSuccess
	beforeCreation := time.Now()

	// Act
	result := models.NewWorkflowResult(missionID, status)

	// Assert
	assert.Equal(suite.T(), missionID, result.MissionID)
	assert.Equal(suite.T(), status, result.Status)
	assert.True(suite.T(), result.CompletedAt.After(beforeCreation) || result.CompletedAt.Equal(beforeCreation))
}

// Benchmark tests for performance validation
func BenchmarkNewMission(b *testing.B) {
	for i := 0; i < b.N; i++ {
		models.NewMission("test-id", "test prompt")
	}
}

func BenchmarkMissionUpdateStatus(b *testing.B) {
	mission := models.NewMission("test-id", "test prompt")
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		mission.UpdateStatus(models.MissionStatusRunning)
	}
}
