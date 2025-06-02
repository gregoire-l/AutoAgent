import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import { TextAnimate } from '@/components/magicui/text-animate';

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

    // Transition animation - increased delay for smoother choreographed transition
    setTimeout(() => {
      setShowMainLayout(true);
      setIsTransitioning(false);
    }, 800);
  };

  // Handle clarification flow completion
  const handleClarificationComplete = () => {
    setClarificationMode(false);
    // Clarification flow is complete, continue with normal operation
  };

  if (isTransitioning) {
    return (
      <motion.div
        className='bg-background flex min-h-screen items-center justify-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className='space-y-6 text-center'
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className='border-primary mx-auto h-12 w-12 rounded-full border-3 border-t-transparent'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <TextAnimate
            animation="blurInUp"
            by="word"
            as="p"
            className='text-muted-foreground text-lg'
            delay={0.5}
            startOnView={false}
          >
            Initialisation de votre mission...
          </TextAnimate>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!showMainLayout ? (
        <WelcomePage key="welcome" onStartMission={handleStartMission} />
      ) : (
        <motion.div
          key="main-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
