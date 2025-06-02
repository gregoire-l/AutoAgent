import { useEffect } from 'react';
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

  useEffect(() => {
    // Initialize mission sections with default data
    initializeMissionSections();

    // Set initial connection status
    setConnectionStatus(true);

    // Add welcome message and demo conversation
    const welcomeMessage = {
      id: 'welcome-message',
      content: 'Salut ! Prêt(e) à démarrer une mission ? Dis-moi tout...',
      role: 'assistant' as const,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      status: 'sent' as const,
    };

    const userMessage = {
      id: 'user-demo-1',
      content: 'Je dois organiser un voyage Lyon-Paris pour 4 personnes',
      role: 'user' as const,
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
      status: 'sent' as const,
    };

    const agentMessage = {
      id: 'agent-demo-1',
      content:
        "Parfait ! Je vais t'aider à organiser ce voyage. J'ai créé les sections de mission sur le canvas. Peux-tu me donner plus de détails sur tes contraintes ? Par exemple, le budget ou les dates ?",
      role: 'assistant' as const,
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
      status: 'sent' as const,
    };

    addMessage(welcomeMessage);
    addMessage(userMessage);
    addMessage(agentMessage);
  }, [initializeMissionSections, setConnectionStatus, addMessage]);
}

// useWelcomeMessage is now integrated into useStoreInitialization
