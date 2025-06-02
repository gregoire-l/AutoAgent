import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createClarificationSlice } from './clarificationSlice';
import type { ClarificationSlice } from './clarificationSlice';
import type { ScriptedResponse, UserInteraction, CanvasUpdate } from '../types';

// Mock the helpers module
vi.mock('@/lib/helpers', () => ({
  generateId: () => 'test-id-123',
}));

describe('ClarificationSlice', () => {
  let slice: ClarificationSlice;
  let mockSet: any;
  let mockGet: any;

  beforeEach(() => {
    // Create mock functions for Zustand
    mockSet = vi.fn();
    mockGet = vi.fn(() => slice); // Return the slice itself

    // Create a fresh slice for each test
    slice = createClarificationSlice(mockSet, mockGet);
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(slice.currentPhase).toBe('A1');
      expect(slice.currentStep).toBe(0);
      expect(slice.isSimulationMode).toBe(true);
      expect(slice.isActive).toBe(false);
      expect(slice.agentTyping).toBe(false);
      expect(slice.agentThinking).toBe(false);
      expect(slice.scriptedResponses).toEqual([]);
      expect(slice.userInteractions).toEqual([]);
      expect(slice.highlightedSections).toEqual([]);
      expect(slice.pendingCanvasUpdates).toEqual([]);
      expect(slice.nextResponseDelay).toBe(2000);
    });
  });

  describe('Action Functions', () => {
    it('should have all required action functions', () => {
      expect(typeof slice.startClarification).toBe('function');
      expect(typeof slice.nextStep).toBe('function');
      expect(typeof slice.previousStep).toBe('function');
      expect(typeof slice.setPhase).toBe('function');
      expect(typeof slice.resetClarification).toBe('function');
      expect(typeof slice.completeClarification).toBe('function');
      expect(typeof slice.setAgentTyping).toBe('function');
      expect(typeof slice.setAgentThinking).toBe('function');
      expect(typeof slice.loadScriptedResponses).toBe('function');
      expect(typeof slice.addUserInteraction).toBe('function');
      expect(typeof slice.clearUserInteractions).toBe('function');
      expect(typeof slice.highlightSection).toBe('function');
      expect(typeof slice.unhighlightSection).toBe('function');
      expect(typeof slice.clearHighlights).toBe('function');
      expect(typeof slice.addCanvasUpdate).toBe('function');
      expect(typeof slice.processCanvasUpdates).toBe('function');
      expect(typeof slice.updateConfig).toBe('function');
      expect(typeof slice.getCurrentResponse).toBe('function');
      expect(typeof slice.getNextResponse).toBe('function');
      expect(typeof slice.canAdvanceStep).toBe('function');
      expect(typeof slice.isFlowComplete).toBe('function');
    });
  });

  describe('Basic Functionality', () => {
    it('should create slice with proper structure', () => {
      expect(slice).toBeDefined();
      expect(slice.currentPhase).toBe('A1');
      expect(slice.currentStep).toBe(0);
      expect(slice.isActive).toBe(false);
    });

    it('should have utility functions that work with initial state', () => {
      // Test with empty state
      expect(slice.getCurrentResponse()).toBeUndefined();
      expect(slice.getNextResponse()).toBeUndefined();
      expect(slice.canAdvanceStep()).toBe(false);
      expect(slice.isFlowComplete()).toBe(false);
    });

    it('should handle scripted responses array', () => {
      const responses: ScriptedResponse[] = [
        {
          id: 'response-1',
          phase: 'A2',
          step: 1,
          content: 'Test response',
          trigger: 'user_message_sent',
          delay: 1000,
        },
      ];

      // Test that we can call the function (even if mocked)
      expect(() => slice.loadScriptedResponses(responses)).not.toThrow();
    });

    it('should handle user interactions', () => {
      const interaction = {
        type: 'message_sent' as const,
        content: 'Hello agent',
        phase: 'A2' as const,
        step: 1,
      };

      // Test that we can call the function (even if mocked)
      expect(() => slice.addUserInteraction(interaction)).not.toThrow();
    });

    it('should handle canvas updates', () => {
      const update: CanvasUpdate = {
        sectionId: 'section-1',
        status: 'in_progress',
        timestamp: new Date(),
      };

      // Test that we can call the function (even if mocked)
      expect(() => slice.addCanvasUpdate(update)).not.toThrow();
    });

    it('should handle configuration updates', () => {
      // Test that we can call the function (even if mocked)
      expect(() => slice.updateConfig({ defaultDelay: 3000 })).not.toThrow();
    });
  });
});
