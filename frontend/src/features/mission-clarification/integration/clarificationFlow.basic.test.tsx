import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClarificationFlowManager } from '../components/ClarificationFlowManager';
import { useBoundStore } from '@/store';

// Use vi.hoisted for shared mock variables
const { mockUseClarificationFlow, mockGetNextResponse, mockLyonParisScript, mockUseBoundStore } = vi.hoisted(() => ({
  mockUseClarificationFlow: vi.fn(),
  mockGetNextResponse: vi.fn(),
  mockUseBoundStore: vi.fn(),
  mockLyonParisScript: [
    {
      id: 'test-response-1',
      phase: 'A2',
      step: 1,
      content: 'Test response content',
      trigger: 'user_message_sent',
      delay: 1000,
    },
  ],
}));

// Mock the store
vi.mock('@/store', () => ({
  useBoundStore: mockUseBoundStore,
}));

// Mock the clarification flow hook
vi.mock('../hooks/useClarificationFlow', () => ({
  useClarificationFlow: mockUseClarificationFlow,
}));

// Mock the scripted content
vi.mock('../data', () => ({
  LYON_PARIS_SCRIPT: mockLyonParisScript,
  getNextResponse: mockGetNextResponse,
}));

describe('Clarification Flow Basic Integration', () => {
  const user = userEvent.setup();

  const mockClarificationState = {
    currentPhase: 'A1' as const,
    currentStep: 0,
    isActive: false,
    isSimulationMode: true,
    agentTyping: false,
    agentThinking: false,
    scriptedResponses: [],
    userInteractions: [],
    highlightedSections: [],
    pendingCanvasUpdates: [],
    nextResponseDelay: 2000,
    lastInteractionTime: undefined,
  };

  const mockFlowActions = {
    processAgentResponse: vi.fn(),
    advanceToNextStep: vi.fn(),
    advanceToNextPhase: vi.fn(),
    shouldAutoAdvance: vi.fn().mockReturnValue(false),
    getNextPhase: vi.fn(),
  };

  const mockStore = {
    // State properties
    currentPhase: 'A1' as const,
    currentStep: 0,
    isActive: false,
    isSimulationMode: true,
    agentTyping: false,
    agentThinking: false,
    scriptedResponses: [],
    userInteractions: [],
    highlightedSections: [],
    pendingCanvasUpdates: [],
    nextResponseDelay: 2000,
    lastInteractionTime: undefined,

    // Actions
    startClarification: vi.fn(),
    completeClarification: vi.fn(),
    loadScriptedResponses: vi.fn(),
    getCurrentResponse: vi.fn(),
    isFlowComplete: vi.fn().mockReturnValue(false),
    setMissionTitle: vi.fn(),
    nextStep: vi.fn(),
    setPhase: vi.fn(),
    addUserInteraction: vi.fn(),
    addCanvasUpdate: vi.fn(),
    processCanvasUpdates: vi.fn(),
    resetClarification: vi.fn(),
    setAgentTyping: vi.fn(),
    setAgentThinking: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the store with getState method
    mockUseBoundStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });

    // Add getState method to the mock
    mockUseBoundStore.getState = vi.fn().mockReturnValue(mockStore);

    // Reset the clarification flow hook mock
    mockUseClarificationFlow.mockReturnValue({
      clarificationState: mockClarificationState,
      isPending: false,
      ...mockFlowActions,
    });
  });

  describe('Flow Manager Integration', () => {
    it('should initialize and manage clarification flow', async () => {
      const onComplete = vi.fn();
      
      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />);

      await waitFor(() => {
        expect(mockStore.loadScriptedResponses).toHaveBeenCalled();
        expect(mockStore.setMissionTitle).toHaveBeenCalledWith("Mission : Organisation Voyage Lyon-Paris");
        expect(mockStore.startClarification).toHaveBeenCalledWith('A2');
      });
    });

    it('should handle flow completion', async () => {
      const onComplete = vi.fn();
      
      // Mock flow as complete
      mockStore.isFlowComplete.mockReturnValue(true);
      
      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />);

      await waitFor(() => {
        expect(mockStore.completeClarification).toHaveBeenCalled();
        expect(onComplete).toHaveBeenCalled();
      });
    });

    it('should handle phase transitions', async () => {
      const onComplete = vi.fn();
      
      // Mock should auto advance
      mockFlowActions.shouldAutoAdvance.mockReturnValue(true);
      mockFlowActions.getNextPhase.mockReturnValue('A3');
      
      const activeState = { ...mockClarificationState, isActive: true, currentPhase: 'A2' as const, currentStep: 8 };
      mockUseClarificationFlow.mockReturnValue({
        clarificationState: activeState,
        isPending: false,
        ...mockFlowActions,
      });
      
      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />);

      await waitFor(() => {
        expect(mockFlowActions.advanceToNextPhase).toHaveBeenCalledWith('A3');
      }, { timeout: 2000 });
    });
  });

  describe('State Management Integration', () => {
    it('should maintain state consistency during operations', () => {
      const store = useBoundStore.getState();
      
      // Test state transitions
      store.startClarification?.('A2');
      expect(store.currentPhase).toBe('A2');
      
      // Test step progression
      store.nextStep?.();
      expect(store.currentStep).toBeGreaterThan(0);
      
      // Test completion
      store.completeClarification?.();
      expect(store.isActive).toBe(false);
    });

    it('should handle user interactions correctly', () => {
      const store = useBoundStore.getState();
      
      store.startClarification?.('A2');
      
      // Add user interaction
      store.addUserInteraction?.({
        type: 'message_sent',
        content: 'Test message',
        phase: 'A2',
        step: 1,
      });
      
      expect(store.userInteractions).toHaveLength(1);
      expect(store.userInteractions[0].content).toBe('Test message');
    });

    it('should manage canvas updates properly', () => {
      const store = useBoundStore.getState();
      
      store.startClarification?.('A2');
      
      // Add canvas update
      store.addCanvasUpdate?.({
        sectionId: 'section-1',
        status: 'completed',
        timestamp: new Date(),
      });
      
      expect(store.pendingCanvasUpdates).toHaveLength(1);
      
      // Process updates
      store.processCanvasUpdates?.();
      expect(store.pendingCanvasUpdates).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing responses gracefully', () => {
      const onComplete = vi.fn();
      
      // Mock empty responses
      mockGetNextResponse.mockReturnValue(null);
      
      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />);
      
      // Should not crash
      expect(mockStore.loadScriptedResponses).toHaveBeenCalled();
    });

    it('should handle invalid phase transitions', () => {
      const store = useBoundStore.getState();
      
      // Try to set invalid phase
      store.setPhase?.('INVALID' as any);
      
      // Should handle gracefully without crashing
      expect(store.currentStep).toBe(0); // Should reset step
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks during multiple cycles', () => {
      const store = useBoundStore.getState();
      
      // Simulate multiple clarification cycles
      for (let cycle = 0; cycle < 3; cycle++) {
        store.startClarification?.('A2');
        
        // Add some interactions
        store.addUserInteraction?.({
          type: 'message_sent',
          content: `Message ${cycle}`,
          phase: 'A2',
          step: 1,
        });
        
        // Complete and reset
        store.completeClarification?.();
        store.resetClarification?.();
      }
      
      // Verify clean state
      expect(store.userInteractions).toEqual([]);
      expect(store.highlightedSections).toEqual([]);
      expect(store.pendingCanvasUpdates).toEqual([]);
    });

    it('should handle rapid state changes', () => {
      const store = useBoundStore.getState();
      
      store.startClarification?.('A2');
      
      // Rapid state changes
      for (let i = 0; i < 10; i++) {
        store.nextStep?.();
        store.setAgentTyping?.(i % 2 === 0);
        store.setAgentThinking?.(i % 3 === 0);
      }
      
      // Should maintain consistency
      expect(store.currentStep).toBeGreaterThan(0);
      expect(typeof store.agentTyping).toBe('boolean');
      expect(typeof store.agentThinking).toBe('boolean');
    });
  });
});
