import { useEffect, useCallback } from 'react'
import { useBoundStore } from '@/store'
import { LYON_PARIS_SCRIPT, getNextResponse } from '../data'
import { useClarificationFlow } from '../hooks/useClarificationFlow'
import type { ClarificationPhase } from '../types'

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
    isPending,
    processAgentResponse,
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

  // Store actions
  const startClarification = useBoundStore(state => state.startClarification)
  const completeClarification = useBoundStore(state => state.completeClarification)
  const loadScriptedResponses = useBoundStore(state => state.loadScriptedResponses)
  const getCurrentResponse = useBoundStore(state => state.getCurrentResponse)
  const isFlowComplete = useBoundStore(state => state.isFlowComplete)
  const setMissionTitle = useBoundStore(state => state.setMissionTitle)

  // Initialize clarification flow when activated
  useEffect(() => {
    if (isActive && !clarificationState.isActive) {
      // Load scripted responses
      loadScriptedResponses(LYON_PARIS_SCRIPT)

      // Initialize mission title
      setMissionTitle("Mission : Organisation Voyage Lyon-Paris")

      // Start clarification flow
      startClarification('A2')
    }
  }, [isActive, clarificationState.isActive, loadScriptedResponses, setMissionTitle, startClarification])

  // Monitor for step changes and trigger agent responses
  useEffect(() => {
    if (!isActive || !isSimulationMode) return

    const currentResponse = getCurrentResponse()
    if (currentResponse && !agentTyping && !agentThinking) {
      // Delay before processing response
      const timer = setTimeout(() => {
        processAgentResponse(currentResponse)
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
    getCurrentResponse,
    processAgentResponse,
    nextResponseDelay,
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
  }, [isFlowComplete, isActive, completeClarification, onComplete])

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
