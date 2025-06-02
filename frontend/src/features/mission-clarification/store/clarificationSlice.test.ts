import { describe, it, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { createClarificationSlice, type ClarificationSlice } from './clarificationSlice';

describe('ClarificationSlice', () => {
  let store: ReturnType<typeof create<ClarificationSlice>>;

  beforeEach(() => {
    store = create<ClarificationSlice>()(createClarificationSlice);
  });

  it('should initialize with correct default state', () => {
    const state = store.getState();
    
    expect(state.currentPhase).toBe('A1');
    expect(state.currentStep).toBe(0);
    expect(state.isSimulationMode).toBe(true);
    expect(state.isActive).toBe(false);
    expect(state.agentTyping).toBe(false);
    expect(state.agentThinking).toBe(false);
    expect(state.scriptedResponses).toEqual([]);
    expect(state.userInteractions).toEqual([]);
    expect(state.highlightedSections).toEqual([]);
    expect(state.pendingCanvasUpdates).toEqual([]);
  });

  it('should start clarification correctly', () => {
    const { startClarification } = store.getState();
    
    startClarification('A2');
    
    const state = store.getState();
    expect(state.currentPhase).toBe('A2');
    expect(state.currentStep).toBe(0);
    expect(state.isActive).toBe(true);
    expect(state.lastInteractionTime).toBeInstanceOf(Date);
  });

  it('should advance steps correctly', () => {
    const { startClarification, nextStep } = store.getState();
    
    startClarification();
    nextStep();
    
    const state = store.getState();
    expect(state.currentStep).toBe(1);
  });

  it('should manage agent typing state', () => {
    const { setAgentTyping } = store.getState();
    
    setAgentTyping(true);
    expect(store.getState().agentTyping).toBe(true);
    
    setAgentTyping(false);
    expect(store.getState().agentTyping).toBe(false);
  });

  it('should add user interactions correctly', () => {
    const { addUserInteraction } = store.getState();
    
    addUserInteraction({
      type: 'message',
      content: 'Test message',
    });
    
    const state = store.getState();
    expect(state.userInteractions).toHaveLength(1);
    expect(state.userInteractions[0].content).toBe('Test message');
    expect(state.userInteractions[0].type).toBe('message');
    expect(state.userInteractions[0].id).toBeDefined();
    expect(state.userInteractions[0].timestamp).toBeInstanceOf(Date);
  });

  it('should manage section highlights', () => {
    const { highlightSection, unhighlightSection, clearHighlights } = store.getState();
    
    highlightSection('section1');
    highlightSection('section2');
    
    expect(store.getState().highlightedSections).toEqual(['section1', 'section2']);
    
    unhighlightSection('section1');
    expect(store.getState().highlightedSections).toEqual(['section2']);
    
    clearHighlights();
    expect(store.getState().highlightedSections).toEqual([]);
  });

  it('should reset clarification state', () => {
    const { startClarification, nextStep, setAgentTyping, resetClarification } = store.getState();
    
    // Set up some state
    startClarification('A3');
    nextStep();
    setAgentTyping(true);
    
    // Reset
    resetClarification();
    
    const state = store.getState();
    expect(state.currentPhase).toBe('A1');
    expect(state.currentStep).toBe(0);
    expect(state.isActive).toBe(false);
    expect(state.agentTyping).toBe(false);
  });

  it('should check if flow can advance', () => {
    const { startClarification, canAdvanceStep } = store.getState();
    
    // Should not advance when not active
    expect(canAdvanceStep()).toBe(false);
    
    // Should advance when active
    startClarification();
    expect(canAdvanceStep()).toBe(true);
  });
});
