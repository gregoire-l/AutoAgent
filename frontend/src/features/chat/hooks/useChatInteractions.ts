import { useCallback } from 'react';
import { useBoundStore } from '@/store';
import type { MessageData } from '../types';

/**
 * Hook for managing chat interactions and business logic
 */
export function useChatInteractions() {
  const messages = useBoundStore(state => state.messages);
  const connectionStatus = useBoundStore(state => state.isConnected);
  const addMessage = useBoundStore(state => state.addMessage);
  const clearMessages = useBoundStore(state => state.clearMessages);
  const setConnectionStatus = useBoundStore(state => state.setConnectionStatus);

  // Send a message with proper error handling
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !connectionStatus) return;

      // Add user message
      const userMessage: MessageData = {
        id: `user-${Date.now()}`,
        content: content.trim(),
        role: 'user',
        timestamp: new Date(),
        status: 'sent',
      };

      addMessage(userMessage);

      // Simulate agent processing
      try {
        // Add typing indicator or loading state here if needed

        // Simulate API delay
        await new Promise(resolve =>
          setTimeout(resolve, 1000 + Math.random() * 2000)
        );

        // Generate agent response
        const agentMessage: MessageData = {
          id: `agent-${Date.now()}`,
          content: generateAgentResponse(content),
          role: 'assistant',
          timestamp: new Date(),
          status: 'sent',
        };

        addMessage(agentMessage);

        // Trigger mission section updates based on conversation
        updateMissionFromConversation(content);
      } catch (error) {
        console.error('Error sending message:', error);

        // Add error message
        const errorMessage: MessageData = {
          id: `error-${Date.now()}`,
          content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
          role: 'assistant',
          timestamp: new Date(),
          status: 'error',
        };

        addMessage(errorMessage);
      }
    },
    [connectionStatus, addMessage]
  );

  // Clear conversation with confirmation
  const clearConversation = useCallback(() => {
    if (messages.length === 0) return;

    if (
      window.confirm('Êtes-vous sûr de vouloir effacer toute la conversation ?')
    ) {
      clearMessages();
    }
  }, [messages.length, clearMessages]);

  // Get conversation statistics
  const getConversationStats = useCallback(() => {
    const userMessages = messages.filter(m => m.role === 'user').length;
    const assistantMessages = messages.filter(
      m => m.role === 'assistant'
    ).length;
    const totalMessages = messages.length;

    return {
      userMessages,
      assistantMessages,
      totalMessages,
      hasMessages: totalMessages > 0,
    };
  }, [messages]);

  // Check if agent is currently responding
  const isAgentResponding = useCallback(() => {
    // This could be enhanced to track actual loading states
    return false;
  }, []);

  return {
    // State
    messages,
    connectionStatus,

    // Actions
    sendMessage,
    clearConversation,
    setConnectionStatus,

    // Utilities
    getConversationStats: getConversationStats(),
    isAgentResponding: isAgentResponding(),
  };
}

// Simulate agent responses based on user input
function generateAgentResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  // Context-aware responses for travel planning
  if (input.includes('lyon') || input.includes('paris')) {
    return 'Parfait ! Je vois que vous planifiez un voyage Lyon-Paris. Laissez-moi mettre à jour les sections de mission avec ces informations.';
  }

  if (
    input.includes('budget') ||
    input.includes('prix') ||
    input.includes('coût')
  ) {
    return "Merci pour cette information sur le budget. Je vais l'ajouter aux contraintes de votre mission.";
  }

  if (
    input.includes('train') ||
    input.includes('avion') ||
    input.includes('voiture')
  ) {
    return 'Noté ! Je prends en compte votre préférence de transport dans les critères de recherche.';
  }

  if (
    input.includes('urgent') ||
    input.includes('rapide') ||
    input.includes('vite')
  ) {
    return "Je comprends l'urgence. Je vais prioriser les options les plus rapides dans mes recommandations.";
  }

  // Generic helpful responses
  const responses = [
    'Je comprends votre demande. Laissez-moi analyser les informations pour votre mission.',
    'Excellente question ! Je vais mettre à jour les sections de mission en conséquence.',
    "D'accord, je note cette information. Cela va m'aider à affiner les recommandations.",
    'Merci pour ces détails. Je vais maintenant rechercher les meilleures options pour vous.',
    "Parfait ! Pour mieux vous aider, j'ai besoin de quelques précisions supplémentaires.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// Update mission sections based on conversation context
function updateMissionFromConversation(userInput: string) {
  // This would integrate with the canvas store to update mission sections
  // For now, we'll just log the intent
  console.log('Updating mission based on:', userInput);

  // Future implementation could:
  // - Extract entities (dates, locations, preferences)
  // - Update relevant mission sections
  // - Trigger canvas re-render
}
