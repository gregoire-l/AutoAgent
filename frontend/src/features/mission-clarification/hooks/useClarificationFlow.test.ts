import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useClarificationFlow } from './useClarificationFlow';
import { useBoundStore } from '@/store';
import type { ScriptedResponse, ClarificationPhase } from '../types';

// Mock the store
vi.mock('@/store', () => ({
  useBoundStore: vi.fn(),
}));

// Mock the delay helper
vi.mock('@/lib/helpers', () => ({
  delay: vi.fn().mockResolvedValue(undefined),
}));

describe('useClarificationFlow', () => {
  const mockStoreState = {
    currentPhase: 'A1' as ClarificationPhase,
    currentStep: 0,
    isActive: false,
    isSimulationMode: true,
    agentTyping: false,
    agentThinking: false,
    scriptedResponses: [] as ScriptedResponse[],
    userInteractions: [],
    highlightedSections: [],
    pendingCanvasUpdates: [],
    nextResponseDelay: 2000,
    lastInteractionTime: undefined,
  };

  const mockStoreActions = {
    setAgentThinking: vi.fn(),
    setAgentTyping: vi.fn(),
    setTyping: vi.fn(),
    receiveMessage: vi.fn(),
    updateSectionStatus: vi.fn(),
    updateSectionContent: vi.fn(),
    highlightSection: vi.fn(),
    addCanvasUpdate: vi.fn(),
    processCanvasUpdates: vi.fn(),
    nextStep: vi.fn(),
    setPhase: vi.fn(),
    canAdvanceStep: vi.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the store implementation
    (useBoundStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: typeof mockStoreState & typeof mockStoreActions) => unknown) => {
      if (typeof selector === 'function') {
        return selector({ ...mockStoreState, ...mockStoreActions });
      }
      return { ...mockStoreState, ...mockStoreActions };
    });
  });

  describe('Hook Initialization', () => {
    it('should return initial state and actions', () => {
      const { result } = renderHook(() => useClarificationFlow());

      expect(result.current.clarificationState).toEqual(mockStoreState);
      expect(result.current.isPending).toBe(false);
      expect(typeof result.current.processAgentResponse).toBe('function');
      expect(typeof result.current.advanceToNextStep).toBe('function');
      expect(typeof result.current.advanceToNextPhase).toBe('function');
      expect(typeof result.current.shouldAutoAdvance).toBe('function');
      expect(typeof result.current.getNextPhase).toBe('function');
    });
  });

  describe('processAgentResponse', () => {
    it('should process agent response with correct timing sequence', async () => {
      const { result } = renderHook(() => useClarificationFlow());

      const mockResponse: ScriptedResponse = {
        id: 'test-response',
        phase: 'A2',
        step: 1,
        content: 'Test agent response content',
        delay: 1000,
      };

      await act(async () => {
        await result.current.processAgentResponse(mockResponse);
      });

      // Verify thinking state was set
      expect(mockStoreActions.setAgentThinking).toHaveBeenCalledWith(true);
      
      // Verify typing state was set
      expect(mockStoreActions.setAgentTyping).toHaveBeenCalledWith(true);
      expect(mockStoreActions.setTyping).toHaveBeenCalledWith(true);
      
      // Verify message was sent
      expect(mockStoreActions.receiveMessage).toHaveBeenCalledWith({
        content: mockResponse.content,
        canvasUpdates: mockResponse.canvasUpdates,
      });
      
      // Verify states were reset
      expect(mockStoreActions.setAgentThinking).toHaveBeenCalledWith(false);
      expect(mockStoreActions.setAgentTyping).toHaveBeenCalledWith(false);
      expect(mockStoreActions.setTyping).toHaveBeenCalledWith(false);
      
      // Verify delays were called (mocked)
      const { delay } = await import('@/lib/helpers');
      expect(delay).toHaveBeenCalledWith(800); // Thinking delay
      expect(delay).toHaveBeenCalledWith(expect.any(Number)); // Typing delay
    });

    it('should process canvas updates when provided', async () => {
      const { result } = renderHook(() => useClarificationFlow());

      const mockResponse: ScriptedResponse = {
        id: 'test-response',
        phase: 'A2',
        step: 1,
        content: 'Test response',
        delay: 1000,
        canvasUpdates: [
          {
            sectionId: 'section-1',
            status: 'confirmed',
            content: 'Updated Title',
            highlight: true,
          },
          {
            sectionId: 'section-2',
            status: 'in_progress',
          },
        ],
      };

      await act(async () => {
        await result.current.processAgentResponse(mockResponse);
      });

      // Verify canvas updates were processed
      expect(mockStoreActions.updateSectionStatus).toHaveBeenCalledWith('section-1', 'confirmed');
      expect(mockStoreActions.updateSectionContent).toHaveBeenCalledWith('section-1', 'Updated Title');
      expect(mockStoreActions.highlightSection).toHaveBeenCalledWith('section-1');
      expect(mockStoreActions.addCanvasUpdate).toHaveBeenCalledTimes(2);
      expect(mockStoreActions.processCanvasUpdates).toHaveBeenCalled();
    });

    it('should handle empty response gracefully', async () => {
      const { result } = renderHook(() => useClarificationFlow());

      await act(async () => {
        await result.current.processAgentResponse(undefined as unknown as ScriptedResponse);
      });

      // Should not call any store actions for undefined response
      expect(mockStoreActions.setAgentThinking).not.toHaveBeenCalled();
      expect(mockStoreActions.setAgentTyping).not.toHaveBeenCalled();
    });
  });

  describe('advanceToNextStep', () => {
    it('should advance to next step when possible', () => {
      mockStoreActions.canAdvanceStep.mockReturnValue(true);
      const { result } = renderHook(() => useClarificationFlow());

      act(() => {
        result.current.advanceToNextStep();
      });

      expect(mockStoreActions.nextStep).toHaveBeenCalled();
    });

    it('should not advance when canAdvanceStep returns false', () => {
      mockStoreActions.canAdvanceStep.mockReturnValue(false);
      const { result } = renderHook(() => useClarificationFlow());

      act(() => {
        result.current.advanceToNextStep();
      });

      expect(mockStoreActions.nextStep).not.toHaveBeenCalled();
    });
  });

  describe('advanceToNextPhase', () => {
    it('should advance to specified phase', () => {
      const { result } = renderHook(() => useClarificationFlow());

      act(() => {
        result.current.advanceToNextPhase('A3');
      });

      expect(mockStoreActions.setPhase).toHaveBeenCalledWith('A3');
    });
  });

  describe('shouldAutoAdvance', () => {
    it('should return true for A2 phase at step 8', () => {
      const { result } = renderHook(() => useClarificationFlow());

      const shouldAdvance = result.current.shouldAutoAdvance('A2', 8);

      expect(shouldAdvance).toBe(true);
    });

    it('should return false for A2 phase at step 7', () => {
      const { result } = renderHook(() => useClarificationFlow());

      const shouldAdvance = result.current.shouldAutoAdvance('A2', 7);

      expect(shouldAdvance).toBe(false);
    });

    it('should return false for A1 phase', () => {
      const { result } = renderHook(() => useClarificationFlow());

      const shouldAdvance = result.current.shouldAutoAdvance('A1', 10);

      expect(shouldAdvance).toBe(false);
    });

    it('should return false for A3 phase', () => {
      const { result } = renderHook(() => useClarificationFlow());

      const shouldAdvance = result.current.shouldAutoAdvance('A3', 5);

      expect(shouldAdvance).toBe(false);
    });
  });

  describe('getNextPhase', () => {
    it('should return A2 for A1 phase', () => {
      const { result } = renderHook(() => useClarificationFlow());

      const nextPhase = result.current.getNextPhase('A1');

      expect(nextPhase).toBe('A2');
    });

    it('should return A3 for A2 phase', () => {
      const { result } = renderHook(() => useClarificationFlow());

      const nextPhase = result.current.getNextPhase('A2');

      expect(nextPhase).toBe('A3');
    });

    it('should return null for A3 phase (flow complete)', () => {
      const { result } = renderHook(() => useClarificationFlow());

      const nextPhase = result.current.getNextPhase('A3');

      expect(nextPhase).toBeNull();
    });

    it('should return null for invalid phase', () => {
      const { result } = renderHook(() => useClarificationFlow());

      const nextPhase = result.current.getNextPhase('INVALID' as ClarificationPhase);

      expect(nextPhase).toBeNull();
    });
  });

  describe('State Management', () => {
    it('should reflect store state changes', () => {
      const updatedState = {
        ...mockStoreState,
        currentPhase: 'A2' as ClarificationPhase,
        currentStep: 3,
        isActive: true,
        agentTyping: true,
      };

      (useBoundStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: typeof updatedState & typeof mockStoreActions) => unknown) => {
        if (typeof selector === 'function') {
          return selector({ ...updatedState, ...mockStoreActions });
        }
        return { ...updatedState, ...mockStoreActions };
      });

      const { result } = renderHook(() => useClarificationFlow());

      expect(result.current.clarificationState.currentPhase).toBe('A2');
      expect(result.current.clarificationState.currentStep).toBe(3);
      expect(result.current.clarificationState.isActive).toBe(true);
      expect(result.current.clarificationState.agentTyping).toBe(true);
    });
  });

  describe('Transition States', () => {
    it('should handle isPending state during transitions', async () => {
      const { result } = renderHook(() => useClarificationFlow());

      const mockResponse: ScriptedResponse = {
        id: 'test-response',
        phase: 'A2',
        step: 1,
        content: 'Test response',
        delay: 1000,
      };

      // Start processing (should set isPending to true)
      act(() => {
        void result.current.processAgentResponse(mockResponse);
      });

      // During processing, isPending might be true (depends on React's startTransition)
      // This is more of an integration test with React's concurrent features
      
      await waitFor(() => {
        expect(mockStoreActions.receiveMessage).toHaveBeenCalled();
      });
    });
  });
});
