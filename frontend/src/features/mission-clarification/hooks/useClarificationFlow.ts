import { useCallback, useTransition, useMemo } from 'react'
import { useBoundStore } from '@/store'
import { delay } from '@/lib/helpers'
import type { ClarificationPhase, ScriptedResponse } from '../types'

/**
 * Custom hook for managing clarification flow logic
 * Provides orchestration methods for the ClarificationFlowManager
 */
export function useClarificationFlow() {
  const [isPending, startTransition] = useTransition()

  // Store selectors - use individual selectors to avoid creating new objects
  const currentPhase = useBoundStore(state => state.currentPhase)
  const currentStep = useBoundStore(state => state.currentStep)
  const isActive = useBoundStore(state => state.isActive)
  const isSimulationMode = useBoundStore(state => state.isSimulationMode)
  const agentTyping = useBoundStore(state => state.agentTyping)
  const agentThinking = useBoundStore(state => state.agentThinking)
  const scriptedResponses = useBoundStore(state => state.scriptedResponses)
  const userInteractions = useBoundStore(state => state.userInteractions)
  const highlightedSections = useBoundStore(state => state.highlightedSections)
  const pendingCanvasUpdates = useBoundStore(state => state.pendingCanvasUpdates)
  const nextResponseDelay = useBoundStore(state => state.nextResponseDelay)
  const lastInteractionTime = useBoundStore(state => state.lastInteractionTime)

  // Memoize the clarification state object to prevent infinite re-renders
  const clarificationState = useMemo(() => ({
    currentPhase,
    currentStep,
    isActive,
    isSimulationMode,
    agentTyping,
    agentThinking,
    scriptedResponses,
    userInteractions,
    highlightedSections,
    pendingCanvasUpdates,
    nextResponseDelay,
    lastInteractionTime,
  }), [
    currentPhase,
    currentStep,
    isActive,
    isSimulationMode,
    agentTyping,
    agentThinking,
    scriptedResponses,
    userInteractions,
    highlightedSections,
    pendingCanvasUpdates,
    nextResponseDelay,
    lastInteractionTime,
  ])
  const setAgentTyping = useBoundStore(state => state.setAgentTyping)
  const setAgentThinking = useBoundStore(state => state.setAgentThinking)
  const receiveMessage = useBoundStore(state => state.receiveMessage)
  const setTyping = useBoundStore(state => state.setTyping)
  const updateSectionStatus = useBoundStore(state => state.updateSectionStatus)
  const updateSectionContent = useBoundStore(state => state.updateSectionContent)
  const highlightSection = useBoundStore(state => state.highlightSection)
  const addCanvasUpdate = useBoundStore(state => state.addCanvasUpdate)
  const processCanvasUpdates = useBoundStore(state => state.processCanvasUpdates)
  const nextStep = useBoundStore(state => state.nextStep)
  const setPhase = useBoundStore(state => state.setPhase)
  const canAdvanceStep = useBoundStore(state => state.canAdvanceStep)

  /**
   * Process agent response with realistic timing and animations
   */
  const processAgentResponse = useCallback(async (response: ScriptedResponse) => {
    if (!response) return

    // Show agent thinking state
    setAgentThinking(true)
    await delay(800) // Brief thinking delay

    // Show agent typing state
    setAgentThinking(false)
    setAgentTyping(true)
    setTyping(true)

    // Simulate typing delay based on content length
    const typingDelay = Math.max(1500, response.content.length * 30)
    await delay(typingDelay)

    // Send the message
    startTransition(() => {
      receiveMessage({
        content: response.content,
        canvasUpdates: response.canvasUpdates,
      })
      
      setAgentTyping(false)
      setTyping(false)
    })

    // Process canvas updates if any
    if (response.canvasUpdates && response.canvasUpdates.length > 0) {
      startTransition(() => {
        response.canvasUpdates?.forEach(update => {
          // Update section status
          if (update.status) {
            updateSectionStatus(update.sectionId, update.status)
          }
          
          // Update section content
          if (update.content) {
            updateSectionContent(update.sectionId, update.content)
          }
          
          // Handle highlighting
          if (update.highlight) {
            highlightSection(update.sectionId)
          }
          
          // Add to pending updates for animations
          addCanvasUpdate(update)
        })
        
        // Process all pending updates
        processCanvasUpdates()
      })
    }
  }, [
    setAgentThinking,
    setAgentTyping,
    setTyping,
    receiveMessage,
    updateSectionStatus,
    updateSectionContent,
    highlightSection,
    addCanvasUpdate,
    processCanvasUpdates,
  ])

  /**
   * Advance to the next step in the current phase
   */
  const advanceToNextStep = useCallback(() => {
    if (!canAdvanceStep()) return

    startTransition(() => {
      nextStep()
    })
  }, [canAdvanceStep, nextStep])

  /**
   * Advance to a new phase
   */
  const advanceToNextPhase = useCallback((phase: ClarificationPhase) => {
    startTransition(() => {
      setPhase(phase)
    })
  }, [setPhase])

  /**
   * Check if the flow should auto-advance based on current state
   */
  const shouldAutoAdvance = useCallback((currentPhase: ClarificationPhase, currentStep: number): boolean => {
    // Auto-advance from A2 to A3 when appropriate conditions are met
    if (currentPhase === 'A2' && currentStep >= 8) {
      return true
    }
    
    return false
  }, [])

  /**
   * Get the next phase based on current state
   */
  const getNextPhase = useCallback((currentPhase: ClarificationPhase): ClarificationPhase | null => {
    switch (currentPhase) {
      case 'A1':
        return 'A2'
      case 'A2':
        return 'A3'
      case 'A3':
        return null // Flow complete
      default:
        return null
    }
  }, [])

  return {
    // State
    clarificationState,
    isPending,
    
    // Actions
    processAgentResponse,
    advanceToNextStep,
    advanceToNextPhase,
    
    // Utilities
    shouldAutoAdvance,
    getNextPhase,
  }
}
