import { useEffect, useCallback } from 'react'
import { useBoundStore } from '@/store'
import { LYON_PARIS_SCRIPT, LYON_PARIS_MISSION_SECTIONS, getNextResponse } from '../data'
import { useClarificationFlow } from '../hooks/useClarificationFlow'
import type { MessageData } from '@/features/chat/types'

interface ClarificationFlowManagerProps {
  isActive: boolean
  onComplete: () => void
}

export function ClarificationFlowManager({
  isActive,
  onComplete
}: ClarificationFlowManagerProps) {
  // Use custom hook for flow logic
  const {
    clarificationState,
    enhancedProcessAgentResponse,
    advanceToNextStep,
    advanceToNextPhase,
    shouldAutoAdvance,
    getNextPhase,
  } = useClarificationFlow()

  const {
    currentPhase,
    currentStep,
    isSimulationMode,
    agentTyping,
    agentThinking,
    scriptedResponses,
    userInteractions,
    nextResponseDelay,
  } = clarificationState

  // Store actions - memoized to prevent unnecessary re-renders
  const startClarification = useBoundStore(useCallback((state) => state.startClarification, []))
  const completeClarification = useBoundStore(useCallback((state) => state.completeClarification, []))
  const loadScriptedResponses = useBoundStore(useCallback((state) => state.loadScriptedResponses, []))
  const getCurrentResponse = useBoundStore(useCallback((state) => state.getCurrentResponse, []))
  const isFlowComplete = useBoundStore(useCallback((state) => state.isFlowComplete, []))
  const setMissionTitle = useBoundStore(useCallback((state) => state.setMissionTitle, []))
  const clearMessages = useBoundStore(useCallback((state) => state.clearMessages, []))
  const setCanvasSections = useBoundStore(useCallback((state) => state.setCanvasSections, []))

  // Initialize clarification flow when activated
  useEffect(() => {
    if (isActive && !clarificationState.isActive) {
      // Clear existing messages for clean start
      clearMessages()

      // Initialize canvas with Lyon-Paris sections
      setCanvasSections(LYON_PARIS_MISSION_SECTIONS)

      // Load scripted responses
      loadScriptedResponses(LYON_PARIS_SCRIPT)

      // Initialize mission title
      setMissionTitle("Mission : Organisation Voyage Lyon-Paris")

      // Start clarification flow
      startClarification('A2')
    }
  }, [
    isActive,
    clarificationState.isActive,
    clearMessages,
    setCanvasSections,
    loadScriptedResponses,
    setMissionTitle,
    startClarification
  ])

  // Monitor for step changes and trigger agent responses
  useEffect(() => {
    if (!isActive || !isSimulationMode) return

    const currentResponse = getCurrentResponse()
    if (currentResponse && !agentTyping && !agentThinking) {
      // Delay before processing response with enhanced visual states
      const timer = setTimeout(() => {
        void enhancedProcessAgentResponse(currentResponse)
      }, nextResponseDelay)

      return () => clearTimeout(timer)
    }
  }, [
    isActive,
    isSimulationMode,
    currentStep,
    currentPhase,
    agentTyping,
    agentThinking,
    nextResponseDelay,
    getCurrentResponse,
    enhancedProcessAgentResponse,
  ])

  // Handle user interactions and trigger appropriate responses
  useEffect(() => {
    if (!isActive || userInteractions.length === 0) return

    const lastInteraction = userInteractions[userInteractions.length - 1]

    // Find appropriate response based on interaction
    const nextResponse = getNextResponse(lastInteraction, scriptedResponses, currentPhase, currentStep)

    if (nextResponse) {
      // Advance step and process response
      setTimeout(() => {
        advanceToNextStep()
      }, 500) // Brief delay for user action feedback
    }
  }, [userInteractions, isActive, scriptedResponses, currentPhase, currentStep, advanceToNextStep])

  // Handle flow completion
  useEffect(() => {
    if (isFlowComplete() && isActive) {
      completeClarification()
      onComplete()
    }
  }, [isActive, onComplete, isFlowComplete, completeClarification])

  // Handle phase transitions based on progress
  useEffect(() => {
    if (!isActive) return

    // Check if we should auto-advance to next phase
    if (shouldAutoAdvance(currentPhase, currentStep)) {
      const nextPhase = getNextPhase(currentPhase)
      if (nextPhase) {
        setTimeout(() => {
          advanceToNextPhase(nextPhase)
        }, 1000)
      }
    }
  }, [currentPhase, currentStep, isActive, shouldAutoAdvance, getNextPhase, advanceToNextPhase])

  // This component doesn't render anything - it's a pure orchestrator
  return null
}
