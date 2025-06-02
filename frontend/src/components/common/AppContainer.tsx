import { useState } from 'react';
import { WelcomePage } from './WelcomePage';
import { MainLayout } from './MainLayout';
import { useBoundStore } from '@/store';
import { useStoreInitialization, useDemoInitialization } from '@/hooks';
import { MissionCanvas } from '@/features/canvas';
import { ChatPanel } from '@/features/chat';

// ChatPanel is now replaced by the actual ChatPanel component from features/chat

// CanvasPanel is now replaced by MissionCanvas component

export function AppContainer() {
  const [showMainLayout, setShowMainLayout] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sendMessage = useBoundStore(state => state.sendMessage);

  // Initialize store and demo data
  useStoreInitialization();
  useDemoInitialization();

  const handleStartMission = (initialMessage: string) => {
    setIsTransitioning(true);

    // Transition animation
    setTimeout(() => {
      setShowMainLayout(true);
      setIsTransitioning(false);

      // Send the initial message
      void sendMessage(initialMessage);
    }, 500);
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
    <MainLayout chatPanel={<ChatPanel />} canvasPanel={<MissionCanvas />} />
  );
}
