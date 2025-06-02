import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentSimulator } from './agent-simulator';
import type { ScriptedResponse, ClarificationPhase } from '@/features/mission-clarification/types';

// Mock the demo-data module
vi.mock('./demo-data', () => ({
  getRandomAgentResponse: vi.fn(() => 'Mocked agent response'),
  simulateTypingDelay: vi.fn(() => Promise.resolve()),
}));

// Mock the timing config
vi.mock('@/features/mission-clarification/data/scriptedContent', () => ({
  TIMING_CONFIG: {
    TYPING_DELAY: 100,
    THINKING_DELAY: 50,
    CANVAS_UPDATE_DELAY: 25,
    USER_RESPONSE_DELAY: 200,
    PHASE_TRANSITION_DELAY: 100,
  },
}));

describe('AgentSimulator', () => {
  let simulator: AgentSimulator;

  beforeEach(() => {
    simulator = new AgentSimulator();
    vi.clearAllMocks();
  });

  describe('Standard Mode', () => {
    it('should generate response in standard mode', async () => {
      const result = await simulator.generateResponse('Hello');
      
      expect(result.message).toBeDefined();
      expect(result.message.content).toBe('Mocked agent response');
      expect(result.message.role).toBe('assistant');
      expect(result.message.timestamp).toBeInstanceOf(Date);
    });

    it('should detect intents correctly', async () => {
      const greetingResult = await simulator.generateResponse('Bonjour');
      expect(greetingResult.message.content).toBe('Mocked agent response');

      const budgetResult = await simulator.generateResponse('Mon budget est de 1000€');
      // Budget intent triggers specific response generation, not the mocked one
      expect(budgetResult.message.content).toContain('budget');
    });

    it('should maintain conversation context', () => {
      expect(simulator.getContext()).toEqual([]);

      void simulator.generateResponse('Hello');
      // Note: We can't easily test the async context update without waiting
      // This would be better tested with integration tests
    });

    it('should reset context correctly', () => {
      simulator.resetContext();
      expect(simulator.getContext()).toEqual([]);
    });
  });

  describe('Clarification Mode', () => {
    const mockScript: ScriptedResponse[] = [
      {
        id: 'test-response-1',
        phase: 'A2' as ClarificationPhase,
        step: 1,
        content: 'Test clarification response',
        delay: 1000,
        canvasUpdates: [
          {
            sectionId: 'test-section',
            status: 'in_progress',
            highlight: true,
          }
        ],
      },
      {
        id: 'test-response-2',
        phase: 'A2' as ClarificationPhase,
        step: 2,
        content: 'Second test response',
        delay: 1500,
        triggerCondition: 'CLARIFICATION_CONFIRM',
      },
    ];

    beforeEach(() => {
      simulator.enableClarificationMode(mockScript, 'A2');
    });

    it('should enable clarification mode correctly', () => {
      expect(simulator.isClarificationMode()).toBe(true);
      
      const state = simulator.getClarificationState();
      expect(state.phase).toBe('A2');
      expect(state.step).toBe(0);
    });

    it('should disable clarification mode correctly', () => {
      simulator.disableClarificationMode();
      
      expect(simulator.isClarificationMode()).toBe(false);
      
      const state = simulator.getClarificationState();
      expect(state.phase).toBe('A2');
      expect(state.step).toBe(0);
    });

    it('should generate clarification response with exact phase/step match', async () => {
      const result = await simulator.generateResponse('Test message', 'A2', 1);
      
      expect(result.message.content).toBe('Test clarification response');
      expect(result.canvasUpdates).toBeDefined();
      expect(result.canvasUpdates).toHaveLength(1);
      expect((result.canvasUpdates?.[0] as any)?.sectionId).toBe('test-section');
    });

    it('should find response by trigger condition', async () => {
      const result = await simulator.generateResponse('Je confirme', 'A2', 5);
      
      expect(result.message.content).toBe('Second test response');
    });

    it('should fallback to standard response when no script found', async () => {
      const result = await simulator.generateResponse('Unknown message', 'A3', 10);

      // Fallback uses the general response generator - check for any of the possible responses
      expect(
        result.message.content.includes('précisions') ||
        result.message.content.includes('détails') ||
        result.message.content.includes('plus')
      ).toBe(true);
      expect(result.canvasUpdates).toBeUndefined();
    });

    it('should route to clarification mode when phase and step provided', async () => {
      const result = await simulator.generateResponse('Test', 'A2', 1);
      
      expect(result.message.content).toBe('Test clarification response');
    });

    it('should use standard mode when clarification disabled', async () => {
      simulator.disableClarificationMode();

      const result = await simulator.generateResponse('Test', 'A2', 1);

      // When clarification is disabled, it uses general response generator - check for any of the possible responses
      expect(
        result.message.content.includes('précisions') ||
        result.message.content.includes('détails') ||
        result.message.content.includes('plus')
      ).toBe(true);
    });
  });

  describe('Intent Recognition', () => {
    it('should detect clarification-specific intents in clarification mode', () => {
      simulator.enableClarificationMode([], 'A2');
      
      // This tests the private detectIntent method indirectly through generateResponse
      // In a real test, we might want to expose this method or test it through integration
    });

    it('should prioritize clarification intents over standard intents', () => {
      simulator.enableClarificationMode([], 'A2');
      
      // Test that clarification intents are detected first when in clarification mode
    });
  });

  describe('Timing and Delays', () => {
    it('should calculate realistic delays based on content length', async () => {
      const longScript: ScriptedResponse[] = [
        {
          id: 'long-response',
          phase: 'A2' as ClarificationPhase,
          step: 1,
          content: 'This is a very long response that should take more time to type because it has many characters and words in it.',
          delay: 0, // Will be calculated
        },
      ];

      simulator.enableClarificationMode(longScript, 'A2');
      
      const startTime = Date.now();
      await simulator.generateResponse('Test', 'A2', 1);
      const endTime = Date.now();
      
      // Should take some time due to realistic delay calculation
      expect(endTime - startTime).toBeGreaterThan(50);
    });

    it('should use response-specific delay when provided', async () => {
      const script: ScriptedResponse[] = [
        {
          id: 'custom-delay',
          phase: 'A2' as ClarificationPhase,
          step: 1,
          content: 'Short',
          delay: 500,
        },
      ];

      simulator.enableClarificationMode(script, 'A2');
      
      const startTime = Date.now();
      await simulator.generateResponse('Test', 'A2', 1);
      const endTime = Date.now();
      
      // Should respect the custom delay
      expect(endTime - startTime).toBeGreaterThan(400);
    });
  });
});
