// Mission Clarification types and interfaces
// Define all clarification flow-related types here

export type ClarificationPhase = 'A1' | 'A2' | 'A3'

export type AgentState = 'thinking' | 'analyzing' | 'typing' | 'idle';

export interface ScriptedResponse {
  id: string;
  phase: ClarificationPhase;
  step: number;
  content: string;
  canvasUpdates?: CanvasUpdate[];
  delay: number;
  triggerCondition?: string;
  nextStep?: number;
}

export interface CanvasUpdate {
  sectionId: string;
  status?: import('@/features/canvas/types').MissionStatus;
  content?: string;
  highlight?: boolean;
  animation?: 'pulse' | 'glow' | 'shake' | 'none';
}

export interface UserInteraction {
  id: string;
  type: 'message' | 'canvas_click' | 'option_select' | 'button_click' | 'radio_select';
  content: string;
  timestamp: Date;
  sectionId?: string;
  optionId?: string;
  metadata?: Record<string, unknown>;
}

export interface ClarificationState {
  // Flow control
  currentPhase: ClarificationPhase;
  currentStep: number;
  isSimulationMode: boolean;
  isActive: boolean;
  
  // Agent state
  agentTyping: boolean;
  agentThinking: boolean;
  agentState: AgentState;
  
  // Content management
  scriptedResponses: ScriptedResponse[];
  userInteractions: UserInteraction[];
  
  // UI state
  highlightedSections: string[];
  pendingCanvasUpdates: CanvasUpdate[];
  
  // Timing
  lastInteractionTime?: Date;
  nextResponseDelay: number;
}

export interface ClarificationFlowConfig {
  enableSimulation: boolean;
  autoProgress: boolean;
  defaultDelay: number;
  maxStepsPerPhase: number;
  debugMode: boolean;
}

// Events for clarification flow
export type ClarificationEvent =
  | { type: 'flow_started'; payload: { phase: ClarificationPhase } }
  | { type: 'phase_changed'; payload: { from: ClarificationPhase; to: ClarificationPhase } }
  | { type: 'step_advanced'; payload: { phase: ClarificationPhase; step: number } }
  | { type: 'user_interaction'; payload: UserInteraction }
  | { type: 'agent_response'; payload: ScriptedResponse }
  | { type: 'canvas_updated'; payload: CanvasUpdate[] }
  | { type: 'flow_completed'; payload: { finalPhase: ClarificationPhase } }
  | { type: 'flow_reset' };

// Flow step definition
export interface FlowStep {
  id: string;
  phase: ClarificationPhase;
  stepNumber: number;
  description: string;
  expectedUserAction?: string;
  agentResponse?: ScriptedResponse;
  canvasUpdates?: CanvasUpdate[];
  conditions?: {
    requiresUserInput?: boolean;
    autoAdvance?: boolean;
    timeoutMs?: number;
  };
}

// Simulation metadata
export interface SimulationMetadata {
  startTime: Date;
  endTime?: Date;
  totalSteps: number;
  userInteractions: number;
  phaseTransitions: number;
  errors: string[];
}
