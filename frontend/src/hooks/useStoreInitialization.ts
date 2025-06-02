import { useEffect, useRef } from 'react';
import { useBoundStore } from '@/store';

/**
 * Hook to initialize the store with default data
 * This should be called once at the app level
 */
export function useStoreInitialization() {
  const initializeMissionSections = useBoundStore(
    state => state.initializeMissionSections
  );
  const setConnectionStatus = useBoundStore(state => state.setConnectionStatus);
  const addMessage = useBoundStore(state => state.addMessage);
  const messages = useBoundStore(state => state.messages);

  // Use ref to track if initialization has already occurred
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent duplicate initialization
    if (hasInitialized.current) return;

    // Check if demo messages already exist to prevent duplicates
    const hasWelcomeMessage = messages.some(msg => msg.id === 'welcome-message');
    if (hasWelcomeMessage) {
      hasInitialized.current = true;
      return;
    }

    // Initialize mission sections with default data
    initializeMissionSections();

    // Set initial connection status
    setConnectionStatus(true);

    // Add welcome message and demo conversation with unique IDs
    const timestamp = Date.now();
    const welcomeMessage = {
      id: `welcome-message-${timestamp}`,
      content: 'Salut ! Prêt(e) à démarrer une mission ? Dis-moi tout...',
      role: 'assistant' as const,
      timestamp: new Date(timestamp - 300000), // 5 minutes ago
      status: 'sent' as const,
    };

    const userMessage = {
      id: `user-demo-${timestamp}`,
      content: 'Je dois organiser un voyage Lyon-Paris pour 4 personnes',
      role: 'user' as const,
      timestamp: new Date(timestamp - 240000), // 4 minutes ago
      status: 'sent' as const,
    };

    const agentMessage = {
      id: `agent-demo-${timestamp}`,
      content:
        "Parfait ! Je vais t'aider à organiser ce voyage. J'ai créé les sections de mission sur le canvas. Peux-tu me donner plus de détails sur tes contraintes ? Par exemple, le budget ou les dates ?",
      role: 'assistant' as const,
      timestamp: new Date(timestamp - 180000), // 3 minutes ago
      status: 'sent' as const,
    };

    addMessage(welcomeMessage);
    addMessage(userMessage);
    addMessage(agentMessage);

    hasInitialized.current = true;
  }, [initializeMissionSections, setConnectionStatus, addMessage, messages]);
}

// useWelcomeMessage is now integrated into useStoreInitialization
