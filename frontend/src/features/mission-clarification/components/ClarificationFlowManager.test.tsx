import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor, act } from '@testing-library/react'
import { ClarificationFlowManager } from './ClarificationFlowManager'
import { useBoundStore } from '@/store'
import type { ScriptedResponse, UserInteraction } from '../types'

// Use vi.hoisted for shared mock variables
const { mockUseClarificationFlow, mockGetNextResponse, mockLyonParisScript } = vi.hoisted(() => ({
  mockUseClarificationFlow: vi.fn(),
  mockGetNextResponse: vi.fn(),
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
}))

// Mock the store
vi.mock('@/store', () => ({
  useBoundStore: vi.fn(),
}))

// Mock the delay helper
vi.mock('@/lib/helpers', () => ({
  delay: vi.fn().mockResolvedValue(undefined),
}))

// Mock the clarification flow hook
vi.mock('../hooks/useClarificationFlow', () => ({
  useClarificationFlow: mockUseClarificationFlow,
}))

// Mock the scripted content
vi.mock('../data', () => ({
  LYON_PARIS_SCRIPT: mockLyonParisScript,
  getNextResponse: mockGetNextResponse,
}))

describe('ClarificationFlowManager', () => {
  const mockClarificationState = {
    currentPhase: 'A1' as const,
    currentStep: 0,
    isActive: false,
    isSimulationMode: true,
    agentTyping: false,
    agentThinking: false,
    scriptedResponses: [] as ScriptedResponse[],
    userInteractions: [] as UserInteraction[],
    highlightedSections: [] as string[],
    pendingCanvasUpdates: [],
    nextResponseDelay: 2000,
    lastInteractionTime: undefined,
  }

  const mockFlowActions = {
    processAgentResponse: vi.fn(),
    advanceToNextStep: vi.fn(),
    advanceToNextPhase: vi.fn(),
    shouldAutoAdvance: vi.fn().mockReturnValue(false),
    getNextPhase: vi.fn(),
  }

  const mockStore = {
    // Store actions
    startClarification: vi.fn(),
    completeClarification: vi.fn(),
    loadScriptedResponses: vi.fn(),
    getCurrentResponse: vi.fn(),
    isFlowComplete: vi.fn().mockReturnValue(false),
    setMissionTitle: vi.fn(),
  }

  const mockUseClarificationFlowReturn = {
    clarificationState: mockClarificationState,
    isPending: false,
    ...mockFlowActions,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock the store
    ;(useBoundStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: typeof mockStore) => unknown) => {
      if (typeof selector === 'function') {
        return selector(mockStore)
      }
      return mockStore
    })

    // Reset the clarification flow hook mock
    mockUseClarificationFlow.mockReturnValue(mockUseClarificationFlowReturn)
  })

  describe('Component Lifecycle', () => {
    it('renders without crashing', () => {
      const onComplete = vi.fn()
      render(<ClarificationFlowManager isActive={false} onComplete={onComplete} />)
      // Component doesn't render anything visible
      expect(document.body).toBeDefined()
    })

    it('returns null (no visual output)', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <ClarificationFlowManager isActive={false} onComplete={onComplete} />
      )
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Flow Initialization', () => {
    it('initializes clarification flow when activated', async () => {
      const onComplete = vi.fn()

      // First render with isActive=false
      const { rerender } = render(
        <ClarificationFlowManager isActive={false} onComplete={onComplete} />
      )

      expect(mockStore.startClarification).not.toHaveBeenCalled()

      // Re-render with isActive=true
      rerender(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      await waitFor(() => {
        expect(mockStore.loadScriptedResponses).toHaveBeenCalled()
        expect(mockStore.setMissionTitle).toHaveBeenCalledWith("Mission : Organisation Voyage Lyon-Paris")
        expect(mockStore.startClarification).toHaveBeenCalledWith('A2')
      })
    })

    it('does not initialize if already active', () => {
      const onComplete = vi.fn()

      // Mock clarification state as already active
      const activeState = { ...mockClarificationState, isActive: true }
      mockUseClarificationFlow.mockReturnValue({
        ...mockUseClarificationFlowReturn,
        clarificationState: activeState,
      })

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      expect(mockStore.startClarification).not.toHaveBeenCalled()
    })

    it('loads Lyon-Paris script on initialization', async () => {
      const onComplete = vi.fn()

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      await waitFor(() => {
        expect(mockStore.loadScriptedResponses).toHaveBeenCalledWith(mockLyonParisScript)
      })
    })
  })

  describe('Flow Completion', () => {
    it('calls onComplete when flow is complete', async () => {
      const onComplete = vi.fn()

      // Mock flow as complete
      mockStore.isFlowComplete.mockReturnValue(true)

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      await waitFor(() => {
        expect(mockStore.completeClarification).toHaveBeenCalled()
        expect(onComplete).toHaveBeenCalled()
      })
    })

    it('does not call onComplete when flow is not complete', () => {
      const onComplete = vi.fn()

      mockStore.isFlowComplete.mockReturnValue(false)

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      expect(mockStore.completeClarification).not.toHaveBeenCalled()
      expect(onComplete).not.toHaveBeenCalled()
    })

    it('does not call onComplete when not active', () => {
      const onComplete = vi.fn()

      mockStore.isFlowComplete.mockReturnValue(true)

      render(<ClarificationFlowManager isActive={false} onComplete={onComplete} />)

      expect(mockStore.completeClarification).not.toHaveBeenCalled()
      expect(onComplete).not.toHaveBeenCalled()
    })
  })

  describe('Phase Transitions', () => {
    it('handles automatic phase transitions', async () => {
      const onComplete = vi.fn()

      // Mock should auto advance
      mockFlowActions.shouldAutoAdvance.mockReturnValue(true)
      mockFlowActions.getNextPhase.mockReturnValue('A3')

      const activeState = { ...mockClarificationState, isActive: true, currentPhase: 'A2' as const, currentStep: 8 }
      mockUseClarificationFlow.mockReturnValue({
        ...mockUseClarificationFlowReturn,
        clarificationState: activeState,
      })

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      // Wait for phase transition timeout
      await waitFor(() => {
        expect(mockFlowActions.advanceToNextPhase).toHaveBeenCalledWith('A3')
      }, { timeout: 2000 })
    })

    it('does not advance phase when shouldAutoAdvance returns false', () => {
      const onComplete = vi.fn()

      mockFlowActions.shouldAutoAdvance.mockReturnValue(false)

      const activeState = { ...mockClarificationState, isActive: true }
      mockUseClarificationFlow.mockReturnValue({
        ...mockUseClarificationFlowReturn,
        clarificationState: activeState,
      })

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      expect(mockFlowActions.advanceToNextPhase).not.toHaveBeenCalled()
    })

    it('does not advance phase when getNextPhase returns null', async () => {
      const onComplete = vi.fn()

      mockFlowActions.shouldAutoAdvance.mockReturnValue(true)
      mockFlowActions.getNextPhase.mockReturnValue(null)

      const activeState = { ...mockClarificationState, isActive: true }
      mockUseClarificationFlow.mockReturnValue({
        ...mockUseClarificationFlowReturn,
        clarificationState: activeState,
      })

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      // Wait a bit to ensure no phase transition occurs
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100))
      })

      expect(mockFlowActions.advanceToNextPhase).not.toHaveBeenCalled()
    })
  })

  describe('User Interaction Handling', () => {
    it('processes user interactions and advances steps', async () => {
      const onComplete = vi.fn()

      const mockResponse: ScriptedResponse = {
        id: 'test-response',
        phase: 'A2',
        step: 2,
        content: 'Response to user interaction',
        trigger: 'user_message_sent',
        delay: 1000,
      }

      mockGetNextResponse.mockReturnValue(mockResponse)

      const userInteraction: UserInteraction = {
        id: 'interaction-1',
        type: 'message_sent',
        content: 'User message',
        phase: 'A2',
        step: 1,
        timestamp: new Date(),
      }

      const stateWithInteraction = {
        ...mockClarificationState,
        isActive: true,
        userInteractions: [userInteraction],
        currentPhase: 'A2' as const,
        currentStep: 1,
      }

      mockUseClarificationFlow.mockReturnValue({
        ...mockUseClarificationFlowReturn,
        clarificationState: stateWithInteraction,
      })

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      await waitFor(() => {
        expect(mockGetNextResponse).toHaveBeenCalledWith(
          userInteraction,
          stateWithInteraction.scriptedResponses,
          'A2',
          1
        )
        expect(mockFlowActions.advanceToNextStep).toHaveBeenCalled()
      })
    })

    it('does not process interactions when not active', () => {
      const onComplete = vi.fn()

      const userInteraction: UserInteraction = {
        id: 'interaction-1',
        type: 'message_sent',
        content: 'User message',
        phase: 'A2',
        step: 1,
        timestamp: new Date(),
      }

      const stateWithInteraction = {
        ...mockClarificationState,
        isActive: false,
        userInteractions: [userInteraction],
      }

      mockUseClarificationFlow.mockReturnValue({
        ...mockUseClarificationFlowReturn,
        clarificationState: stateWithInteraction,
      })

      render(<ClarificationFlowManager isActive={false} onComplete={onComplete} />)

      expect(mockGetNextResponse).not.toHaveBeenCalled()
      expect(mockFlowActions.advanceToNextStep).not.toHaveBeenCalled()
    })

    it('does not advance step when no matching response found', () => {
      const onComplete = vi.fn()

      mockGetNextResponse.mockReturnValue(null)

      const userInteraction: UserInteraction = {
        id: 'interaction-1',
        type: 'message_sent',
        content: 'User message',
        phase: 'A2',
        step: 1,
        timestamp: new Date(),
      }

      const stateWithInteraction = {
        ...mockClarificationState,
        isActive: true,
        userInteractions: [userInteraction],
      }

      mockUseClarificationFlow.mockReturnValue({
        ...mockUseClarificationFlowReturn,
        clarificationState: stateWithInteraction,
      })

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)

      expect(mockFlowActions.advanceToNextStep).not.toHaveBeenCalled()
    })
  })
})
