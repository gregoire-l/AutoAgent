import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useBoundStore } from '@/store';
import { useStoreInitialization } from '@/hooks/useStoreInitialization';
import { MessageInput } from '@/features/chat/components/MessageInput';
import { ClarificationFlowManager } from '../components/ClarificationFlowManager';
import { LYON_PARIS_EXAMPLE } from '../data/scriptedContent';

// Mock the store
vi.mock('@/store', () => ({
  useBoundStore: vi.fn(),
}));

// Mock the clarification flow hook
vi.mock('../hooks/useClarificationFlow', () => ({
  useClarificationFlow: vi.fn(),
}));

describe('Clarification Flow Initialization Integration', () => {
  const mockStore = {
    // Chat state
    messages: [],
    composerInput: '',
    isConnected: true,
    addMessage: vi.fn(),
    setComposerInput: vi.fn(),
    clearMessages: vi.fn(),
    
    // Canvas state
    initializeMissionSections: vi.fn(),
    setConnectionStatus: vi.fn(),
    setMissionTitle: vi.fn(),
    
    // Clarification state
    isActive: false,
    currentPhase: 'A1',
    currentStep: 0,
    isSimulationMode: true,
    agentTyping: false,
    agentThinking: false,
    scriptedResponses: [],
    userInteractions: [],
    highlightedSections: [],
    pendingCanvasUpdates: [],
    nextResponseDelay: 2000,
    
    // Clarification actions
    startClarification: vi.fn(),
    completeClarification: vi.fn(),
    loadScriptedResponses: vi.fn(),
    addUserInteraction: vi.fn(),
    getCurrentResponse: vi.fn(),
    isFlowComplete: vi.fn().mockReturnValue(false),
  };

  const mockClarificationFlow = {
    clarificationState: {
      currentPhase: 'A1',
      currentStep: 0,
      isActive: false,
      isSimulationMode: true,
      agentTyping: false,
      agentThinking: false,
      scriptedResponses: [],
      userInteractions: [],
      highlightedSections: [],
      pendingCanvasUpdates: [],
      nextResponseDelay: 2000,
    },
    processAgentResponse: vi.fn(),
    advanceToNextStep: vi.fn(),
    advanceToNextPhase: vi.fn(),
    shouldAutoAdvance: vi.fn().mockReturnValue(false),
    getNextPhase: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset store state
    mockStore.messages = [];
    mockStore.composerInput = '';
    mockStore.isActive = false;
    
    // Mock the store
    (useBoundStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: typeof mockStore) => unknown) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });

    // Mock the clarification flow hook
    const { useClarificationFlow } = require('../hooks/useClarificationFlow');
    useClarificationFlow.mockReturnValue(mockClarificationFlow);
  });

  describe('Store Initialization', () => {
    it('should skip demo messages in clarification mode', () => {
      // Simulate clarification mode
      const TestComponent = () => {
        useStoreInitialization(true);
        return <div>Test</div>;
      };

      render(<TestComponent />);

      expect(mockStore.initializeMissionSections).toHaveBeenCalled();
      expect(mockStore.setConnectionStatus).toHaveBeenCalledWith(true);
      expect(mockStore.addMessage).toHaveBeenCalledTimes(1); // Only welcome message
      
      const welcomeMessage = mockStore.addMessage.mock.calls[0][0];
      expect(welcomeMessage.content).toBe('Salut ! Prêt(e) à démarrer une mission ? Dis-moi tout...');
    });

    it('should add demo messages in normal mode', () => {
      const TestComponent = () => {
        useStoreInitialization(false);
        return <div>Test</div>;
      };

      render(<TestComponent />);

      expect(mockStore.addMessage).toHaveBeenCalledTimes(3); // Welcome + user + agent
    });
  });

  describe('ClarificationFlowManager Initialization', () => {
    it('should initialize clarification flow with welcome message and pre-filled input', () => {
      mockStore.isActive = false;
      mockClarificationFlow.clarificationState.isActive = false;

      render(<ClarificationFlowManager isActive={true} onComplete={vi.fn()} />);

      expect(mockStore.clearMessages).toHaveBeenCalled();
      expect(mockStore.addMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Salut ! Prêt(e) à démarrer une mission ? Dis-moi tout...',
          role: 'assistant',
        })
      );
      expect(mockStore.setComposerInput).toHaveBeenCalledWith(LYON_PARIS_EXAMPLE);
      expect(mockStore.loadScriptedResponses).toHaveBeenCalled();
      expect(mockStore.setMissionTitle).toHaveBeenCalledWith("Mission : Organisation Voyage Lyon-Paris");
      expect(mockStore.startClarification).toHaveBeenCalledWith('A2');
    });

    it('should not initialize if already active', () => {
      mockStore.isActive = true;
      mockClarificationFlow.clarificationState.isActive = true;

      render(<ClarificationFlowManager isActive={true} onComplete={vi.fn()} />);

      expect(mockStore.clearMessages).not.toHaveBeenCalled();
      expect(mockStore.startClarification).not.toHaveBeenCalled();
    });
  });

  describe('Message Input Integration', () => {
    it('should route messages through clarification flow when active', async () => {
      const user = userEvent.setup();
      mockStore.isActive = true;
      mockStore.composerInput = 'Test clarification message';

      render(<MessageInput />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockStore.addMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test clarification message',
          role: 'user',
        })
      );
      expect(mockStore.addUserInteraction).toHaveBeenCalledWith({
        type: 'message',
        content: 'Test clarification message',
      });
      expect(mockStore.setComposerInput).toHaveBeenCalledWith('');
    });

    it('should use normal flow when clarification is not active', async () => {
      const user = userEvent.setup();
      mockStore.isActive = false;
      mockStore.composerInput = 'Normal message';

      render(<MessageInput />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockStore.addMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Normal message',
          role: 'user',
        })
      );
      expect(mockStore.addUserInteraction).not.toHaveBeenCalled();
    });
  });

  describe('Complete Flow Integration', () => {
    it('should handle complete clarification flow lifecycle', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      // Start with clarification flow inactive
      mockStore.isActive = false;
      mockClarificationFlow.clarificationState.isActive = false;

      const TestApp = () => (
        <div>
          <ClarificationFlowManager isActive={true} onComplete={onComplete} />
          <MessageInput />
        </div>
      );

      render(<TestApp />);

      // Verify initialization
      expect(mockStore.clearMessages).toHaveBeenCalled();
      expect(mockStore.setComposerInput).toHaveBeenCalledWith(LYON_PARIS_EXAMPLE);

      // Simulate clarification becoming active
      mockStore.isActive = true;
      mockStore.composerInput = LYON_PARIS_EXAMPLE;

      // Send the pre-filled message
      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockStore.addUserInteraction).toHaveBeenCalledWith({
        type: 'message',
        content: LYON_PARIS_EXAMPLE,
      });
    });

    it('should handle flow completion', () => {
      const onComplete = vi.fn();
      mockStore.isFlowComplete.mockReturnValue(true);
      mockStore.isActive = true;

      render(<ClarificationFlowManager isActive={true} onComplete={onComplete} />);

      expect(mockStore.completeClarification).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('State Consistency', () => {
    it('should maintain consistent state during initialization', () => {
      const TestComponent = () => {
        useStoreInitialization(true);
        return (
          <div>
            <ClarificationFlowManager isActive={true} onComplete={vi.fn()} />
            <MessageInput />
          </div>
        );
      };

      render(<TestComponent />);

      // Verify store initialization
      expect(mockStore.initializeMissionSections).toHaveBeenCalled();
      expect(mockStore.setConnectionStatus).toHaveBeenCalledWith(true);

      // Verify clarification initialization
      expect(mockStore.clearMessages).toHaveBeenCalled();
      expect(mockStore.setComposerInput).toHaveBeenCalledWith(LYON_PARIS_EXAMPLE);
      expect(mockStore.startClarification).toHaveBeenCalledWith('A2');
    });

    it('should handle rapid state changes gracefully', async () => {
      const user = userEvent.setup();
      mockStore.isActive = true;
      mockStore.composerInput = 'Message 1';

      render(<MessageInput />);

      // Send multiple messages rapidly
      const button = screen.getByRole('button');
      
      await user.click(button);
      mockStore.composerInput = 'Message 2';
      await user.click(button);
      mockStore.composerInput = 'Message 3';
      await user.click(button);

      expect(mockStore.addUserInteraction).toHaveBeenCalledTimes(3);
      expect(mockStore.addUserInteraction).toHaveBeenNthCalledWith(1, {
        type: 'message',
        content: 'Message 1',
      });
      expect(mockStore.addUserInteraction).toHaveBeenNthCalledWith(2, {
        type: 'message',
        content: 'Message 2',
      });
      expect(mockStore.addUserInteraction).toHaveBeenNthCalledWith(3, {
        type: 'message',
        content: 'Message 3',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing store methods gracefully', () => {
      const incompleteStore = { ...mockStore };
      delete (incompleteStore as any).clearMessages;

      (useBoundStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: typeof incompleteStore) => unknown) => {
        if (typeof selector === 'function') {
          return selector(incompleteStore);
        }
        return incompleteStore;
      });

      expect(() => {
        render(<ClarificationFlowManager isActive={true} onComplete={vi.fn()} />);
      }).toThrow();
    });

    it('should handle invalid input gracefully', async () => {
      const user = userEvent.setup();
      mockStore.isActive = true;
      mockStore.composerInput = '   '; // Whitespace only

      render(<MessageInput />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockStore.addUserInteraction).not.toHaveBeenCalled();
    });
  });
});
