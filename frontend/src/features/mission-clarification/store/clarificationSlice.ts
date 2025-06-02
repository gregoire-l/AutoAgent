import type { StateCreator } from 'zustand';
import type {
  ClarificationState,
  ClarificationPhase,
  ScriptedResponse,
  UserInteraction,
  CanvasUpdate,
  ClarificationFlowConfig,
  AgentState,
} from '../types';
import { generateId } from '@/lib/helpers';

// Default configuration
const DEFAULT_CONFIG: ClarificationFlowConfig = {
  enableSimulation: true,
  autoProgress: false,
  defaultDelay: 2000,
  maxStepsPerPhase: 10,
  debugMode: false,
};

// Clarification slice interface
export interface ClarificationSlice extends ClarificationState {
  // Flow control actions
  startClarification: (phase?: ClarificationPhase) => void;
  nextStep: () => void;
  previousStep: () => void;
  setPhase: (phase: ClarificationPhase) => void;
  resetClarification: () => void;
  completeClarification: () => void;
  
  // Agent state actions
  setAgentTyping: (typing: boolean) => void;
  setAgentThinking: (thinking: boolean) => void;
  setAgentState: (state: AgentState) => void;
  
  // Content management actions
  loadScriptedResponses: (responses: ScriptedResponse[]) => void;
  addUserInteraction: (interaction: Omit<UserInteraction, 'id' | 'timestamp'>) => void;
  clearUserInteractions: () => void;
  
  // Canvas coordination actions
  highlightSection: (sectionId: string) => void;
  unhighlightSection: (sectionId: string) => void;
  clearHighlights: () => void;
  addCanvasUpdate: (update: CanvasUpdate) => void;
  processCanvasUpdates: () => void;
  
  // Configuration actions
  updateConfig: (config: Partial<ClarificationFlowConfig>) => void;
  
  // Utility actions
  getCurrentResponse: () => ScriptedResponse | undefined;
  getNextResponse: () => ScriptedResponse | undefined;
  canAdvanceStep: () => boolean;
  isFlowComplete: () => boolean;
}

// Clarification slice creator
export const createClarificationSlice: StateCreator<
  ClarificationSlice,
  [],
  [],
  ClarificationSlice
> = (set, get) => ({
  // Initial state
  currentPhase: 'A1',
  currentStep: 0,
  isSimulationMode: true,
  isActive: false,
  agentTyping: false,
  agentThinking: false,
  agentState: 'idle',
  scriptedResponses: [],
  userInteractions: [],
  highlightedSections: [],
  pendingCanvasUpdates: [],
  nextResponseDelay: DEFAULT_CONFIG.defaultDelay,

  // Flow control actions
  startClarification: (phase: ClarificationPhase = 'A1') => {
    set({
      currentPhase: phase,
      currentStep: 0,
      isActive: true,
      isSimulationMode: true,
      userInteractions: [],
      highlightedSections: [],
      pendingCanvasUpdates: [],
      lastInteractionTime: new Date(),
    });
  },

  nextStep: () => {
    const state = get();
    if (!state.canAdvanceStep()) return;

    const newStep = state.currentStep + 1;
    set({
      currentStep: newStep,
      lastInteractionTime: new Date(),
    });

    // Auto-advance phase if needed
    const maxSteps = DEFAULT_CONFIG.maxStepsPerPhase;
    if (newStep >= maxSteps) {
      const nextPhase = state.currentPhase === 'A1' ? 'A2' : 
                      state.currentPhase === 'A2' ? 'A3' : 'A3';
      if (nextPhase !== state.currentPhase) {
        set({
          currentPhase: nextPhase,
          currentStep: 0,
        });
      }
    }
  },

  previousStep: () => {
    const state = get();
    if (state.currentStep > 0) {
      set({
        currentStep: state.currentStep - 1,
        lastInteractionTime: new Date(),
      });
    }
  },

  setPhase: (phase: ClarificationPhase) => {
    set({
      currentPhase: phase,
      currentStep: 0,
      lastInteractionTime: new Date(),
    });
  },

  resetClarification: () => {
    set({
      currentPhase: 'A1',
      currentStep: 0,
      isActive: false,
      isSimulationMode: false,
      agentTyping: false,
      agentThinking: false,
      agentState: 'idle',
      userInteractions: [],
      highlightedSections: [],
      pendingCanvasUpdates: [],
      lastInteractionTime: undefined,
      nextResponseDelay: DEFAULT_CONFIG.defaultDelay,
    });
  },

  completeClarification: () => {
    set({
      isActive: false,
      agentTyping: false,
      agentThinking: false,
      agentState: 'idle',
      highlightedSections: [],
      pendingCanvasUpdates: [],
    });
  },

  // Agent state actions
  setAgentTyping: (typing: boolean) => {
    set({ agentTyping: typing });
  },

  setAgentThinking: (thinking: boolean) => {
    set({ agentThinking: thinking });
  },

  setAgentState: (agentState: AgentState) => {
    set({ agentState });
  },

  // Content management actions
  loadScriptedResponses: (responses: ScriptedResponse[]) => {
    set({ scriptedResponses: responses });
  },

  addUserInteraction: (interaction: Omit<UserInteraction, 'id' | 'timestamp'>) => {
    const newInteraction: UserInteraction = {
      ...interaction,
      id: generateId(),
      timestamp: new Date(),
    };

    set(state => ({
      userInteractions: [...state.userInteractions, newInteraction],
      lastInteractionTime: new Date(),
    }));
  },

  clearUserInteractions: () => {
    set({ userInteractions: [] });
  },

  // Canvas coordination actions
  highlightSection: (sectionId: string) => {
    set(state => ({
      highlightedSections: [...new Set([...state.highlightedSections, sectionId])],
    }));
  },

  unhighlightSection: (sectionId: string) => {
    set(state => ({
      highlightedSections: state.highlightedSections.filter(id => id !== sectionId),
    }));
  },

  clearHighlights: () => {
    set({ highlightedSections: [] });
  },

  addCanvasUpdate: (update: CanvasUpdate) => {
    set(state => ({
      pendingCanvasUpdates: [...state.pendingCanvasUpdates, update],
    }));
  },

  processCanvasUpdates: () => {
    // Process pending canvas updates
    // This will be coordinated with the canvas slice
    set({ pendingCanvasUpdates: [] });
  },

  // Configuration actions
  updateConfig: (config: Partial<ClarificationFlowConfig>) => {
    // Configuration would be stored separately or in a parent state
    // For now, we'll just update the delay
    if (config.defaultDelay !== undefined) {
      set({ nextResponseDelay: config.defaultDelay });
    }
  },

  // Utility actions
  getCurrentResponse: () => {
    const state = get();
    return state.scriptedResponses.find(
      response => 
        response.phase === state.currentPhase && 
        response.step === state.currentStep
    );
  },

  getNextResponse: () => {
    const state = get();
    return state.scriptedResponses.find(
      response => 
        response.phase === state.currentPhase && 
        response.step === state.currentStep + 1
    );
  },

  canAdvanceStep: () => {
    const state = get();
    return state.isActive && state.currentStep < DEFAULT_CONFIG.maxStepsPerPhase;
  },

  isFlowComplete: () => {
    const state = get();
    return state.currentPhase === 'A3' && state.currentStep >= DEFAULT_CONFIG.maxStepsPerPhase;
  },
});
