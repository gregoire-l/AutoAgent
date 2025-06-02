import { useEffect } from 'react';
import { useBoundStore } from '@/store';

/**
 * Hook to initialize the application with demo data
 * This should be called once when the app starts
 * Canvas is now left empty for progressive loading
 */
export function useDemoInitialization() {
  const initializeChatDemo = useBoundStore(state => state.initializeDemoData);

  useEffect(() => {
    // Initialize only chat with demo data
    // Canvas remains empty for progressive loading system
    initializeChatDemo();
  }, [initializeChatDemo]);
}

/**
 * Hook to check if demo data is loaded
 */
export function useDemoDataStatus() {
  const messages = useBoundStore(state => state.messages);
  const sections = useBoundStore(state => state.sections);

  return {
    chatLoaded: messages.length > 0,
    canvasLoaded: sections.length > 0,
    fullyLoaded: messages.length > 0 && sections.length > 0,
  };
}
