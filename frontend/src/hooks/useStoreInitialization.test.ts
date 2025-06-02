import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStoreInitialization } from './useStoreInitialization';
import { useBoundStore } from '@/store';

// Mock the store
vi.mock('@/store', () => ({
  useBoundStore: vi.fn(),
}));

describe('useStoreInitialization', () => {
  const mockStore = {
    initializeMissionSections: vi.fn(),
    setConnectionStatus: vi.fn(),
    addMessage: vi.fn(),
    messages: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the store selectors
    (useBoundStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: typeof mockStore) => unknown) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });
  });

  describe('Normal Mode (skipDemoMessages = false)', () => {
    it('should initialize store with demo messages by default', () => {
      renderHook(() => useStoreInitialization());

      expect(mockStore.initializeMissionSections).toHaveBeenCalledTimes(1);
      expect(mockStore.setConnectionStatus).toHaveBeenCalledWith(true);
      expect(mockStore.addMessage).toHaveBeenCalledTimes(3); // welcome + user + agent
    });

    it('should add welcome message first', () => {
      renderHook(() => useStoreInitialization());

      const firstCall = mockStore.addMessage.mock.calls[0][0];
      expect(firstCall.content).toBe('Salut ! Prêt(e) à démarrer une mission ? Dis-moi tout...');
      expect(firstCall.role).toBe('assistant');
      expect(firstCall.id).toMatch(/^welcome-message-/);
    });

    it('should add demo user message', () => {
      renderHook(() => useStoreInitialization());

      const secondCall = mockStore.addMessage.mock.calls[1][0];
      expect(secondCall.content).toBe('Je dois organiser un voyage Lyon-Paris pour 4 personnes');
      expect(secondCall.role).toBe('user');
      expect(secondCall.id).toMatch(/^user-demo-/);
    });

    it('should add demo agent response', () => {
      renderHook(() => useStoreInitialization());

      const thirdCall = mockStore.addMessage.mock.calls[2][0];
      expect(thirdCall.content).toContain("Parfait ! Je vais t'aider à organiser ce voyage");
      expect(thirdCall.role).toBe('assistant');
      expect(thirdCall.id).toMatch(/^agent-demo-/);
    });
  });

  describe('Clarification Mode (skipDemoMessages = true)', () => {
    it('should skip demo messages when skipDemoMessages is true', () => {
      renderHook(() => useStoreInitialization(true));

      expect(mockStore.initializeMissionSections).toHaveBeenCalledTimes(1);
      expect(mockStore.setConnectionStatus).toHaveBeenCalledWith(true);
      expect(mockStore.addMessage).toHaveBeenCalledTimes(1); // only welcome message
    });

    it('should only add welcome message in clarification mode', () => {
      renderHook(() => useStoreInitialization(true));

      const onlyCall = mockStore.addMessage.mock.calls[0][0];
      expect(onlyCall.content).toBe('Salut ! Prêt(e) à démarrer une mission ? Dis-moi tout...');
      expect(onlyCall.role).toBe('assistant');
      expect(onlyCall.id).toMatch(/^welcome-message-/);
    });
  });

  describe('Duplicate Prevention', () => {
    it('should not initialize if welcome message already exists', () => {
      // Mock existing welcome message
      mockStore.messages = [
        {
          id: 'welcome-message',
          content: 'Existing welcome',
          role: 'assistant',
          timestamp: new Date(),
          status: 'sent',
        },
      ];

      renderHook(() => useStoreInitialization());

      expect(mockStore.initializeMissionSections).not.toHaveBeenCalled();
      expect(mockStore.setConnectionStatus).not.toHaveBeenCalled();
      expect(mockStore.addMessage).not.toHaveBeenCalled();
    });

    it('should not initialize multiple times on re-renders', () => {
      // Reset messages to empty for this test
      mockStore.messages = [];

      const { rerender } = renderHook(() => useStoreInitialization());

      // First render should initialize
      expect(mockStore.addMessage).toHaveBeenCalledTimes(3);

      // Re-render the hook
      rerender();

      // Should not call addMessage again
      expect(mockStore.addMessage).toHaveBeenCalledTimes(3);
    });
  });

  describe('Message Timestamps', () => {
    it('should set appropriate timestamps for messages', () => {
      // Reset messages to empty for this test
      mockStore.messages = [];

      renderHook(() => useStoreInitialization());

      // Verify we have the expected number of calls
      expect(mockStore.addMessage).toHaveBeenCalledTimes(3);

      const welcomeMsg = mockStore.addMessage.mock.calls[0][0];
      const userMsg = mockStore.addMessage.mock.calls[1][0];
      const agentMsg = mockStore.addMessage.mock.calls[2][0];

      // Welcome message should be oldest (5 minutes ago)
      expect(welcomeMsg.timestamp.getTime()).toBeLessThan(userMsg.timestamp.getTime());
      // User message should be in middle (4 minutes ago)
      expect(userMsg.timestamp.getTime()).toBeLessThan(agentMsg.timestamp.getTime());
      // Agent message should be newest (3 minutes ago)
      expect(agentMsg.timestamp.getTime()).toBeLessThan(Date.now());
    });
  });

  describe('Message Properties', () => {
    it('should set correct message properties', () => {
      // Reset messages to empty for this test
      mockStore.messages = [];

      renderHook(() => useStoreInitialization());

      const messages = mockStore.addMessage.mock.calls.map(call => call[0]);

      expect(messages).toHaveLength(3);

      messages.forEach(message => {
        expect(message).toHaveProperty('id');
        expect(message).toHaveProperty('content');
        expect(message).toHaveProperty('role');
        expect(message).toHaveProperty('timestamp');
        expect(message).toHaveProperty('status', 'sent');
        expect(message.id).toBeTruthy();
        expect(message.content).toBeTruthy();
        expect(['user', 'assistant']).toContain(message.role);
        expect(message.timestamp).toBeInstanceOf(Date);
      });
    });
  });
});
