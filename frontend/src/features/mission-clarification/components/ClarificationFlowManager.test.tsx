import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ClarificationFlowManager } from './ClarificationFlowManager'
import { useBoundStore } from '@/store'

// Mock the store
vi.mock('@/store', () => ({
  useBoundStore: vi.fn(),
}))

// Mock the delay helper
vi.mock('@/lib/helpers', () => ({
  delay: vi.fn().mockResolvedValue(undefined),
}))

describe('ClarificationFlowManager', () => {
  const mockStore = {
    // Clarification state
    currentPhase: 'A1',
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
    setAgentTyping: vi.fn(),
    setAgentThinking: vi.fn(),
    receiveMessage: vi.fn(),
    setTyping: vi.fn(),
    updateSectionStatus: vi.fn(),
    updateSectionContent: vi.fn(),
    highlightSection: vi.fn(),
    addCanvasUpdate: vi.fn(),
    processCanvasUpdates: vi.fn(),
    nextStep: vi.fn(),
    setPhase: vi.fn(),
    canAdvanceStep: vi.fn().mockReturnValue(true),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useBoundStore as any).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector(mockStore)
      }
      return mockStore
    })
  })

  it('renders without crashing', () => {
    const onComplete = vi.fn()
    render(<ClarificationFlowManager isActive={false} onComplete={onComplete} />)
    // Component doesn't render anything visible
    expect(document.body).toBeDefined()
  })

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
    
    // Mock store as already active
    ;(useBoundStore as any).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector({ ...mockStore, isActive: true })
      }
      return { ...mockStore, isActive: true }
    })
    
    render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)
    
    expect(mockStore.startClarification).not.toHaveBeenCalled()
  })

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

  it('handles phase transitions correctly', async () => {
    const onComplete = vi.fn()
    
    // Mock current state as A2 step 8 (should trigger A3 transition)
    ;(useBoundStore as any).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector({ ...mockStore, currentPhase: 'A2', currentStep: 8 })
      }
      return { ...mockStore, currentPhase: 'A2', currentStep: 8 }
    })
    
    render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />)
    
    // Wait for phase transition timeout
    await waitFor(() => {
      expect(mockStore.setPhase).toHaveBeenCalledWith('A3')
    }, { timeout: 2000 })
  })
})
