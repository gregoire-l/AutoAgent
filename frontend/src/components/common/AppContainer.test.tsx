import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContainer } from './AppContainer';
import { useBoundStore } from '@/store';

// Mock all the dependencies
vi.mock('@/store', () => ({
  useBoundStore: vi.fn(),
}));

vi.mock('@/hooks', () => ({
  useStoreInitialization: vi.fn(),
  useDemoInitialization: vi.fn(),
}));

vi.mock('./WelcomePage', () => ({
  WelcomePage: ({ onStartMission }: { onStartMission: (msg: string, clarification?: boolean) => void }) => (
    <div data-testid="welcome-page">
      <button onClick={() => onStartMission('Normal message', false)}>Start Normal</button>
      <button onClick={() => onStartMission('Clarification message', true)}>Start Clarification</button>
    </div>
  ),
}));

vi.mock('./MainLayout', () => ({
  MainLayout: ({ chatPanel, canvasPanel }: { chatPanel: React.ReactNode; canvasPanel: React.ReactNode }) => (
    <div data-testid="main-layout">
      <div data-testid="chat-panel">{chatPanel}</div>
      <div data-testid="canvas-panel">{canvasPanel}</div>
    </div>
  ),
}));

vi.mock('./ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>,
}));

vi.mock('@/features/canvas', () => ({
  MissionCanvas: () => <div data-testid="mission-canvas">Mission Canvas</div>,
}));

vi.mock('@/features/chat', () => ({
  ChatPanel: () => <div data-testid="chat-panel-component">Chat Panel</div>,
}));

vi.mock('@/features/mission-clarification', () => ({
  ClarificationFlowManager: ({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) => (
    <div data-testid="clarification-flow-manager">
      <span>Active: {isActive.toString()}</span>
      <button onClick={onComplete}>Complete</button>
    </div>
  ),
}));

describe('AppContainer', () => {
  const mockStore = {
    sendMessage: vi.fn(),
  };

  const mockUseStoreInitialization = vi.fn();
  const mockUseDemoInitialization = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the store
    (useBoundStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: typeof mockStore) => unknown) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });

    // Mock the hooks
    const { useStoreInitialization, useDemoInitialization } = require('@/hooks');
    useStoreInitialization.mockImplementation(mockUseStoreInitialization);
    useDemoInitialization.mockImplementation(mockUseDemoInitialization);
  });

  describe('Initial State', () => {
    it('should render WelcomePage initially', () => {
      render(<AppContainer />);
      
      expect(screen.getByTestId('welcome-page')).toBeInTheDocument();
      expect(screen.queryByTestId('main-layout')).not.toBeInTheDocument();
    });

    it('should call initialization hooks with default parameters', () => {
      render(<AppContainer />);
      
      expect(mockUseStoreInitialization).toHaveBeenCalledWith(false); // clarificationMode = false initially
      expect(mockUseDemoInitialization).toHaveBeenCalled();
    });
  });

  describe('Normal Mode Transition', () => {
    it('should transition to main layout in normal mode', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Normal');
      await user.click(startButton);
      
      // Should show transition state
      expect(screen.getByText('Initialisation de votre mission...')).toBeInTheDocument();
      
      // Should transition to main layout
      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
      
      expect(screen.queryByTestId('welcome-page')).not.toBeInTheDocument();
    });

    it('should send initial message in normal mode', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Normal');
      await user.click(startButton);
      
      await waitFor(() => {
        expect(mockStore.sendMessage).toHaveBeenCalledWith('Normal message');
      });
    });

    it('should not render ClarificationFlowManager in normal mode', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Normal');
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
      
      expect(screen.queryByTestId('clarification-flow-manager')).not.toBeInTheDocument();
    });
  });

  describe('Clarification Mode Transition', () => {
    it('should transition to main layout in clarification mode', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Clarification');
      await user.click(startButton);
      
      // Should show transition state
      expect(screen.getByText('Initialisation de votre mission...')).toBeInTheDocument();
      
      // Should transition to main layout
      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
    });

    it('should not send initial message in clarification mode', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Clarification');
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
      
      expect(mockStore.sendMessage).not.toHaveBeenCalled();
    });

    it('should render ClarificationFlowManager in clarification mode', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Clarification');
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('clarification-flow-manager')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Active: true')).toBeInTheDocument();
    });

    it('should call useStoreInitialization with clarification mode', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Clarification');
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
      
      // Should be called with clarificationMode = true
      expect(mockUseStoreInitialization).toHaveBeenCalledWith(true);
    });
  });

  describe('Clarification Flow Completion', () => {
    it('should handle clarification flow completion', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      // Start clarification mode
      const startButton = screen.getByText('Start Clarification');
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('clarification-flow-manager')).toBeInTheDocument();
      });
      
      // Complete clarification flow
      const completeButton = screen.getByText('Complete');
      await user.click(completeButton);
      
      // ClarificationFlowManager should be removed
      expect(screen.queryByTestId('clarification-flow-manager')).not.toBeInTheDocument();
    });

    it('should maintain main layout after clarification completion', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      // Start clarification mode
      const startButton = screen.getByText('Start Clarification');
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
      
      // Complete clarification flow
      const completeButton = screen.getByText('Complete');
      await user.click(completeButton);
      
      // Main layout should still be visible
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render ChatPanel and MissionCanvas in main layout', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Normal');
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('chat-panel-component')).toBeInTheDocument();
        expect(screen.getByTestId('mission-canvas')).toBeInTheDocument();
      });
    });

    it('should wrap ClarificationFlowManager in ErrorBoundary', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Clarification');
      await user.click(startButton);
      
      await waitFor(() => {
        const errorBoundary = screen.getByTestId('error-boundary');
        const clarificationManager = screen.getByTestId('clarification-flow-manager');
        
        expect(errorBoundary).toBeInTheDocument();
        expect(errorBoundary).toContainElement(clarificationManager);
      });
    });
  });

  describe('Transition States', () => {
    it('should show loading state during transition', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Normal');
      await user.click(startButton);
      
      // Should immediately show loading state
      expect(screen.getByText('Initialisation de votre mission...')).toBeInTheDocument();
      expect(screen.queryByTestId('main-layout')).not.toBeInTheDocument();
      expect(screen.queryByTestId('welcome-page')).not.toBeInTheDocument();
    });

    it('should complete transition after timeout', async () => {
      const user = userEvent.setup();
      render(<AppContainer />);
      
      const startButton = screen.getByText('Start Normal');
      await user.click(startButton);
      
      // Wait for transition to complete
      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      }, { timeout: 1000 });
      
      expect(screen.queryByText('Initialisation de votre mission...')).not.toBeInTheDocument();
    });
  });
});
