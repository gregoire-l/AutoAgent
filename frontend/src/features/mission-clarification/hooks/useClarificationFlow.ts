import { useCallback, useTransition, useMemo } from 'react'
import { useBoundStore } from '@/store'
import { delay } from '@/lib/helpers'
import { ANIMATIONS } from '@/lib/constants'
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
  const agentState = useBoundStore(state => state.agentState)
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
    agentState,
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
    agentState,
    scriptedResponses,
    userInteractions,
    highlightedSections,
    pendingCanvasUpdates,
    nextResponseDelay,
    lastInteractionTime,
  ])
  const setAgentTyping = useBoundStore(state => state.setAgentTyping)
  const setAgentThinking = useBoundStore(state => state.setAgentThinking)
  const setAgentState = useBoundStore(state => state.setAgentState)
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
   * Enhanced process agent response with sophisticated visual states
   * Extends the original processAgentResponse with Magic UI animations
   */
  const enhancedProcessAgentResponse = useCallback(async (response: ScriptedResponse) => {
    if (!response) return

    // État 1: Thinking (1.5s) - PulsatingButton
    setAgentState('thinking')
    setAgentThinking(true)
    await delay(ANIMATIONS.AGENT_THINKING_DURATION)

    // État 2: Analyzing + Canvas progressif (2.5s) - ShimmerButton
    setAgentState('analyzing')
    setAgentThinking(false)

    // Trigger progressive canvas loading during analyzing phase
    if (response.canvasUpdates && response.canvasUpdates.length > 0) {
      startTransition(() => {
        response.canvasUpdates?.forEach(update => {
          // Add to pending updates for progressive animations
          addCanvasUpdate(update)
        })

        // Process canvas updates progressively during analyzing
        processCanvasUpdates()
      })
    }

    await delay(ANIMATIONS.AGENT_ANALYZING_DURATION)

    // État 3: Typing (1s) - TypingAnimation
    setAgentState('typing')
    setAgentTyping(true)
    setTyping(true)
    await delay(ANIMATIONS.AGENT_TYPING_DURATION)

    // Send the message
    startTransition(() => {
      receiveMessage({
        content: response.content,
        canvasUpdates: response.canvasUpdates,
      })

      setAgentTyping(false)
      setTyping(false)
      setAgentState('idle')
    })

    // Process remaining canvas updates if any
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
        })
      })
    }
  }, [
    setAgentState,
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
   * Original process agent response with realistic timing and animations
   * Kept for backward compatibility
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
    agentState,

    // Actions
    processAgentResponse,
    enhancedProcessAgentResponse,
    advanceToNextStep,
    advanceToNextPhase,

    // Utilities
    shouldAutoAdvance,
    getNextPhase,
  }
}
