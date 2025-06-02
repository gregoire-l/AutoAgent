// Mission Clarification feature exports
// Export all mission clarification-related functionality from this file

// Types
export type {
  ClarificationPhase,
  ClarificationState,
  ScriptedResponse,
  UserInteraction,
  CanvasUpdate,
  ClarificationFlowConfig,
  ClarificationEvent,
  FlowStep,
  SimulationMetadata,
} from './types';

// Store
export type { ClarificationSlice } from './store';
export { createClarificationSlice } from './store';

// Data
export {
  LYON_PARIS_EXAMPLE,
  LYON_PARIS_MISSION_SECTIONS,
  LYON_PARIS_SCRIPT,
  USER_RESPONSE_TEMPLATES,
  TIMING_CONFIG,
  getResponseByTrigger,
  getNextResponse,
  getRandomUserResponse,
} from './data';
