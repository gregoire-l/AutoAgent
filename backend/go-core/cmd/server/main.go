package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"

	"autoagent/go-core/internal/activities"
	"autoagent/go-core/internal/config"
	"autoagent/go-core/internal/services"
	"autoagent/go-core/internal/workflows"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	log.Printf("Starting AutoAgent Go Core Service...")
	log.Printf("Temporal: %s (namespace: %s, task queue: %s)",
		cfg.Temporal.HostPort, cfg.Temporal.Namespace, cfg.Temporal.TaskQueue)

	// Create Temporal client
	temporalClient, err := client.Dial(client.Options{
		HostPort:  cfg.Temporal.HostPort,
		Namespace: cfg.Temporal.Namespace,
		Logger:    nil, // Use default logger
	})
	if err != nil {
		log.Fatalf("Unable to create Temporal client: %v", err)
	}
	defer temporalClient.Close()

	// Test Temporal connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Create namespace client to test connection
	namespaceClient, err := client.NewNamespaceClient(client.Options{
		HostPort:  cfg.Temporal.HostPort,
		Namespace: cfg.Temporal.Namespace,
	})
	if err != nil {
		log.Fatalf("Failed to create Temporal namespace client: %v", err)
	}
	defer namespaceClient.Close()

	_, err = namespaceClient.Describe(ctx, cfg.Temporal.Namespace)
	if err != nil {
		log.Fatalf("Failed to connect to Temporal namespace '%s': %v", cfg.Temporal.Namespace, err)
	}
	log.Printf("Successfully connected to Temporal namespace: %s", cfg.Temporal.Namespace)

	// Initialize activity dependencies
	log.Printf("Initializing activity dependencies...")
	deps, err := activities.NewDependencies(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize activity dependencies: %v", err)
	}
	defer deps.Close()

	// Set global dependencies for activities
	activities.SetGlobalDependencies(deps)
	log.Printf("Activity dependencies initialized successfully")

	// Create Temporal worker
	w := worker.New(temporalClient, cfg.Temporal.TaskQueue, worker.Options{
		MaxConcurrentActivityExecutionSize:      10, // Max concurrent activities
		MaxConcurrentWorkflowTaskExecutionSize:  5,  // Max concurrent workflow tasks
		MaxConcurrentLocalActivityExecutionSize: 10, // Max concurrent local activities
	})

	// Register workflows
	log.Printf("Registering workflows...")
	w.RegisterWorkflow(workflows.MissionWorkflow)
	w.RegisterWorkflow(workflows.ValidateServicesWorkflow)
	w.RegisterWorkflow(workflows.InitializeSystemWorkflow)

	// Register activities
	log.Printf("Registering activities...")

	// Reasoning activities
	w.RegisterActivity(activities.GenerateOptionsActivity)
	w.RegisterActivity(activities.ScoreOptionsActivity)
	w.RegisterActivity(activities.ValidateReasoningServiceActivity)

	// Agent activities
	w.RegisterActivity(activities.StartAgentSessionActivity)
	w.RegisterActivity(activities.ExecuteAgentStepActivity)
	w.RegisterActivity(activities.StopAgentSessionActivity)
	w.RegisterActivity(activities.ValidateAgentServiceActivity)
	w.RegisterActivity(activities.ExecuteAgentSessionActivity) // Atomic version

	// Neo4j activities
	w.RegisterActivity(activities.WriteToNeo4jActivity)
	w.RegisterActivity(activities.ReadMissionStatusActivity)
	w.RegisterActivity(activities.ReadMissionTasksActivity)
	w.RegisterActivity(activities.ValidateNeo4jServiceActivity)
	w.RegisterActivity(activities.InitializeNeo4jIndexesActivity)
	w.RegisterActivity(activities.WriteCompleteMissionActivity)

	log.Printf("All workflows and activities registered successfully")

	// Create orchestrator for system initialization
	orchestrator, err := services.NewOrchestrator(cfg)
	if err != nil {
		log.Fatalf("Failed to create orchestrator: %v", err)
	}
	defer orchestrator.Close()

	// Perform system health checks and initialization
	log.Printf("Performing system health checks...")

	// Validate all external services
	ctx, cancel = context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	err = orchestrator.ValidateServices(ctx)
	if err != nil {
		log.Printf("Warning: Service validation failed: %v", err)
		log.Printf("Continuing startup, but some services may be unavailable")
	} else {
		log.Printf("All external services validated successfully")
	}

	// Initialize system (create Neo4j indexes, etc.)
	log.Printf("Initializing system...")
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	err = orchestrator.InitializeSystem(ctx)
	if err != nil {
		log.Printf("Warning: System initialization failed: %v", err)
		log.Printf("Continuing startup, but system may not be fully optimized")
	} else {
		log.Printf("System initialization completed successfully")
	}

	// Set up graceful shutdown
	ctx, cancel = context.WithCancel(context.Background())
	defer cancel()

	// Channel to listen for interrupt signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Start worker in a goroutine
	workerErrChan := make(chan error, 1)
	go func() {
		log.Printf("Starting Temporal worker on task queue: %s", cfg.Temporal.TaskQueue)
		err := w.Run(worker.InterruptCh())
		if err != nil {
			workerErrChan <- fmt.Errorf("worker failed: %w", err)
		}
	}()

	// Optional: Start a simple HTTP health check server
	healthErrChan := make(chan error, 1)
	go func() {
		err := startHealthServer(cfg, orchestrator)
		if err != nil {
			healthErrChan <- fmt.Errorf("health server failed: %w", err)
		}
	}()

	log.Printf("AutoAgent Go Core Service is running...")
	log.Printf("Press Ctrl+C to gracefully shutdown")

	// Wait for shutdown signal or error
	select {
	case sig := <-sigChan:
		log.Printf("Received signal: %v", sig)
		log.Printf("Initiating graceful shutdown...")

	case err := <-workerErrChan:
		log.Printf("Worker error: %v", err)

	case err := <-healthErrChan:
		log.Printf("Health server error: %v", err)
	}

	// Cancel context to signal shutdown
	cancel()

	// Give worker time to finish current tasks
	log.Printf("Waiting for worker to finish current tasks...")
	time.Sleep(5 * time.Second)

	log.Printf("AutoAgent Go Core Service shutdown complete")
}

// startHealthServer starts a simple HTTP server for health checks
func startHealthServer(cfg *config.Config, orchestrator *services.Orchestrator) error {
	// This is a placeholder for Phase 0
	// In a full implementation, we would start an HTTP server
	// that provides health check endpoints

	log.Printf("Health server would start on port %s (placeholder for Phase 0)", cfg.Server.Port)

	// For Phase 0, we'll just perform periodic health checks
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			err := orchestrator.Health(ctx)
			cancel()

			if err != nil {
				log.Printf("Health check failed: %v", err)
			} else {
				log.Printf("Health check passed")
			}
		}
	}
}

// Example function to demonstrate mission execution (for testing)
func demonstrateMissionExecution(orchestrator *services.Orchestrator) {
	log.Printf("Demonstrating mission execution...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()

	// Start a test mission
	result, err := orchestrator.StartMission(ctx, "hello_world")
	if err != nil {
		log.Printf("Mission execution failed: %v", err)
		return
	}

	log.Printf("Mission completed successfully!")
	log.Printf("Mission ID: %s", result.MissionID)
	log.Printf("Status: %s", result.Status)
	log.Printf("Selected Task: %s", result.SelectedTask.ID)
	log.Printf("Agent Status: %s", result.AgentResult.Status)
	log.Printf("Completed At: %s", result.CompletedAt.Format(time.RFC3339))
}
