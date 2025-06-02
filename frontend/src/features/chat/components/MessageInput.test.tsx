import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageInput } from './MessageInput';
import { useBoundStore } from '@/store';

// Mock the store
vi.mock('@/store', () => ({
  useBoundStore: vi.fn(),
}));

describe('MessageInput', () => {
  const mockStore = {
    composerInput: '',
    setComposerInput: vi.fn(),
    addMessage: vi.fn(),
    isConnected: true,
    isActive: false, // clarification mode
    addUserInteraction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset store state
    mockStore.composerInput = '';
    mockStore.isConnected = true;
    mockStore.isActive = false;
    
    // Mock the store selectors
    (useBoundStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: typeof mockStore) => unknown) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });
  });

  describe('Rendering', () => {
    it('should render textarea and send button', () => {
      render(<MessageInput />);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should use global composerInput state', () => {
      mockStore.composerInput = 'Test input from store';
      
      render(<MessageInput />);
      
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Test input from store');
    });

    it('should show custom placeholder', () => {
      render(<MessageInput placeholder="Custom placeholder" />);
      
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });

    it('should show connection status warning when disconnected', () => {
      mockStore.isConnected = false;
      
      render(<MessageInput />);
      
      expect(screen.getByText('Connexion perdue - Reconnexion en cours...')).toBeInTheDocument();
    });
  });

  describe('Input Handling', () => {
    it('should update global state when typing', async () => {
      const user = userEvent.setup();
      render(<MessageInput />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello world');

      // userEvent.type triggers onChange for each character
      expect(mockStore.setComposerInput).toHaveBeenCalledTimes(11);
      expect(mockStore.setComposerInput).toHaveBeenLastCalledWith('Hello world');
    });

    it('should handle Enter key to submit', async () => {
      const user = userEvent.setup();
      mockStore.composerInput = 'Test message';
      
      render(<MessageInput />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '{enter}');
      
      expect(mockStore.addMessage).toHaveBeenCalled();
    });

    it('should handle Shift+Enter for new line', async () => {
      const user = userEvent.setup();
      render(<MessageInput />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Line 1{shift}{enter}Line 2');
      
      // Should not submit message
      expect(mockStore.addMessage).not.toHaveBeenCalled();
    });
  });

  describe('Normal Mode Message Sending', () => {
    beforeEach(() => {
      mockStore.isActive = false; // Normal mode
      mockStore.composerInput = 'Test message';
    });

    it('should add user message in normal mode', async () => {
      const user = userEvent.setup();
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockStore.addMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test message',
          role: 'user',
          status: 'sent',
        })
      );
    });

    it('should clear input after sending in normal mode', async () => {
      const user = userEvent.setup();
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockStore.setComposerInput).toHaveBeenCalledWith('');
    });

    it('should simulate agent response in normal mode', async () => {
      const user = userEvent.setup();
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Should add user message immediately
      expect(mockStore.addMessage).toHaveBeenCalledTimes(1);
      
      // Should add agent response after delay
      await waitFor(() => {
        expect(mockStore.addMessage).toHaveBeenCalledTimes(2);
      }, { timeout: 5000 });
      
      const agentMessage = mockStore.addMessage.mock.calls[1][0];
      expect(agentMessage.role).toBe('assistant');
    });
  });

  describe('Clarification Mode Message Sending', () => {
    beforeEach(() => {
      mockStore.isActive = true; // Clarification mode
      mockStore.composerInput = 'Test clarification message';
    });

    it('should add user message in clarification mode', async () => {
      const user = userEvent.setup();
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockStore.addMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test clarification message',
          role: 'user',
          status: 'sent',
        })
      );
    });

    it('should add user interaction in clarification mode', async () => {
      const user = userEvent.setup();
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockStore.addUserInteraction).toHaveBeenCalledWith({
        type: 'message',
        content: 'Test clarification message',
      });
    });

    it('should not simulate agent response in clarification mode', async () => {
      const user = userEvent.setup();
      render(<MessageInput />);

      const button = screen.getByRole('button');
      await user.click(button);

      // Should only add user message, no agent response
      expect(mockStore.addMessage).toHaveBeenCalledTimes(1);

      // Verify the message is from user
      const userMessage = mockStore.addMessage.mock.calls[0][0];
      expect(userMessage.role).toBe('user');
      expect(userMessage.content).toBe('Test clarification message');

      // Wait to ensure no agent response is added
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockStore.addMessage).toHaveBeenCalledTimes(1);
    });

    it('should clear input after sending in clarification mode', async () => {
      const user = userEvent.setup();
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockStore.setComposerInput).toHaveBeenCalledWith('');
    });
  });

  describe('Button States', () => {
    it('should disable button when input is empty', () => {
      mockStore.composerInput = '';
      
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should enable button when input has content', () => {
      mockStore.composerInput = 'Some content';
      
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should disable button when disconnected', () => {
      mockStore.composerInput = 'Some content';
      mockStore.isConnected = false;
      
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should disable button when explicitly disabled', () => {
      mockStore.composerInput = 'Some content';
      
      render(<MessageInput disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should not submit empty or whitespace-only messages', async () => {
      const user = userEvent.setup();
      mockStore.composerInput = '   ';
      mockStore.isActive = false; // Ensure we're in normal mode for this test

      render(<MessageInput />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockStore.addMessage).not.toHaveBeenCalled();
      expect(mockStore.addUserInteraction).not.toHaveBeenCalled();
    });

    it('should trim whitespace from messages', async () => {
      const user = userEvent.setup();
      mockStore.composerInput = '  Test message  ';
      
      render(<MessageInput />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockStore.addMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test message',
        })
      );
    });
  });
});
