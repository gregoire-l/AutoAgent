import { useState } from 'react';
import { WelcomePage } from './WelcomePage';
import { MainLayout } from './MainLayout';
import { ErrorBoundary } from './ErrorBoundary';
import { useBoundStore } from '@/store';
import { useStoreInitialization, useDemoInitialization } from '@/hooks';
import { MissionCanvas } from '@/features/canvas';
import { ChatPanel } from '@/features/chat';
import { ClarificationFlowManager } from '@/features/mission-clarification';
import { generateId } from '@/lib/helpers';
import type { MessageData } from '@/features/chat/types';

// ChatPanel is now replaced by the actual ChatPanel component from features/chat

// CanvasPanel is now replaced by MissionCanvas component

export function AppContainer() {
  const [showMainLayout, setShowMainLayout] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clarificationMode, setClarificationMode] = useState(false);

  const addMessage = useBoundStore(state => state.addMessage);

  // Initialize store and demo data
  // Pass clarificationMode to skip demo messages when clarification flow will be active
  useStoreInitialization(clarificationMode);
  useDemoInitialization();

  const handleStartMission = (initialMessage: string, isClarificationMode?: boolean) => {
    setIsTransitioning(true);

    // Detect clarification mode
    if (isClarificationMode) {
      setClarificationMode(true);
    }

    // Add the initial message immediately with 'sent' status
    if (!isClarificationMode) {
      const userMessage: MessageData = {
        id: generateId(),
        content: initialMessage,
        role: 'user',
        timestamp: new Date(),
        status: 'sent'
      };
      addMessage(userMessage);
    }

    // Transition animation
    setTimeout(() => {
      setShowMainLayout(true);
      setIsTransitioning(false);
    }, 500);
  };

  // Handle clarification flow completion
  const handleClarificationComplete = () => {
    setClarificationMode(false);
    // Clarification flow is complete, continue with normal operation
  };

  if (isTransitioning) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='space-y-4 text-center'>
          <div className='border-primary mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
          <p className='text-muted-foreground'>
            Initialisation de votre mission...
          </p>
        </div>
      </div>
    );
  }

  if (!showMainLayout) {
    return <WelcomePage onStartMission={handleStartMission} />;
  }

  return (
    <>
      <MainLayout chatPanel={<ChatPanel />} canvasPanel={<MissionCanvas />} />

      {/* Clarification Flow Manager - renders when clarification mode is active */}
      {clarificationMode && (
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('ClarificationFlowManager error:', error, errorInfo);
          }}
        >
          <ClarificationFlowManager
            isActive={clarificationMode}
            onComplete={handleClarificationComplete}
          />
        </ErrorBoundary>
      )}
    </>
  );
}
