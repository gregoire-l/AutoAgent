import type { MessageData } from '@/features/chat/types';
import {
  getRandomAgentResponse,
  simulateTypingDelay,
} from './demo-data';

// Keywords for intent recognition
const INTENT_KEYWORDS = {
  GREETING: ['bonjour', 'salut', 'hello', 'bonsoir'],
  BUDGET: ['budget', 'prix', 'coût', 'euros', '€', 'cher', 'économique'],
  DATES: ['date', 'quand', 'juillet', 'août', 'septembre', 'weekend'],
  PARTICIPANTS: ['personnes', 'famille', 'enfants', 'adultes', 'couple'],
  LOCATION: ['paris', 'londres', 'rome', 'barcelone', 'où', 'destination'],
  PREFERENCES: [
    'préfère',
    'aime',
    'souhaite',
    'veux',
    'activités',
    'hébergement',
  ],
  CONFIRMATION: ['oui', 'ok', 'parfait', 'exactement', 'correct'],
  NEGATION: ['non', 'pas', 'jamais', 'aucun'],
} as const;

// Agent response patterns based on user input
export class AgentSimulator {
  private conversationContext: string[] = [];

  /**
   * Analyze user message and generate appropriate agent response
   */
  async generateResponse(
    userMessage: string
  ): Promise<{
    message: MessageData;
    canvasUpdates?: string[];
  }> {
    await simulateTypingDelay();

    const intent = this.detectIntent(userMessage);
    const response = this.generateResponseByIntent(intent);
    const canvasUpdates = this.detectCanvasUpdates(userMessage, intent);

    // Add to conversation context
    this.conversationContext.push(userMessage.toLowerCase());

    const agentMessage: MessageData = {
      id: `agent-${Date.now()}`,
      content: response,
      role: 'assistant',
      timestamp: new Date(),
    };

    return {
      message: agentMessage,
      canvasUpdates: canvasUpdates.length > 0 ? canvasUpdates : undefined,
    };
  }

  /**
   * Detect user intent from message content
   */
  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Check for greeting
    if (
      INTENT_KEYWORDS.GREETING.some(keyword => lowerMessage.includes(keyword))
    ) {
      return 'GREETING';
    }

    // Check for budget-related content
    if (
      INTENT_KEYWORDS.BUDGET.some(keyword => lowerMessage.includes(keyword))
    ) {
      return 'BUDGET';
    }

    // Check for date-related content
    if (INTENT_KEYWORDS.DATES.some(keyword => lowerMessage.includes(keyword))) {
      return 'DATES';
    }

    // Check for participants
    if (
      INTENT_KEYWORDS.PARTICIPANTS.some(keyword =>
        lowerMessage.includes(keyword)
      )
    ) {
      return 'PARTICIPANTS';
    }

    // Check for location
    if (
      INTENT_KEYWORDS.LOCATION.some(keyword => lowerMessage.includes(keyword))
    ) {
      return 'LOCATION';
    }

    // Check for preferences
    if (
      INTENT_KEYWORDS.PREFERENCES.some(keyword =>
        lowerMessage.includes(keyword)
      )
    ) {
      return 'PREFERENCES';
    }

    // Check for confirmation
    if (
      INTENT_KEYWORDS.CONFIRMATION.some(keyword =>
        lowerMessage.includes(keyword)
      )
    ) {
      return 'CONFIRMATION';
    }

    return 'GENERAL';
  }

  /**
   * Generate response based on detected intent
   */
  private generateResponseByIntent(intent: string): string {
    switch (intent) {
      case 'GREETING':
        return getRandomAgentResponse('GREETING');

      case 'BUDGET':
        return this.generateBudgetResponse();

      case 'DATES':
        return this.generateDatesResponse();

      case 'PARTICIPANTS':
        return this.generateParticipantsResponse();

      case 'LOCATION':
        return this.generateLocationResponse();

      case 'PREFERENCES':
        return this.generatePreferencesResponse();

      case 'CONFIRMATION':
        return getRandomAgentResponse('CONFIRMATION');

      default:
        return this.generateGeneralResponse();
    }
  }

  /**
   * Detect which canvas sections should be updated
   */
  private detectCanvasUpdates(message: string, intent: string): string[] {
    const updates: string[] = [];
    const lowerMessage = message.toLowerCase();

    // Map intents to canvas sections
    if (intent === 'PARTICIPANTS' || lowerMessage.includes('famille')) {
      updates.push('participants');
    }

    if (intent === 'DATES' || lowerMessage.includes('juillet')) {
      updates.push('dates');
    }

    if (intent === 'BUDGET' || lowerMessage.includes('euros')) {
      updates.push('budget');
    }

    if (intent === 'PREFERENCES' || lowerMessage.includes('préfère')) {
      updates.push('preferences');
    }

    return updates;
  }

  // Specific response generators
  private generateBudgetResponse(): string {
    const responses = [
      "Parfait ! J'ai noté votre budget. Cela m'aidera à vous proposer des options adaptées.",
      'Merci pour cette information sur le budget. Je vais chercher des solutions dans cette gamme de prix.',
      'Excellent ! Avec ce budget, nous avons de belles possibilités. Laissez-moi vous proposer quelques options.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateDatesResponse(): string {
    const responses = [
      'Ces dates me conviennent parfaitement ! Je vais vérifier les disponibilités.',
      "Parfait pour les dates ! C'est une excellente période pour voyager.",
      "J'ai noté vos dates. Maintenant, parlons de vos autres préférences.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateParticipantsResponse(): string {
    const responses = [
      "Merci pour ces détails sur votre groupe ! Cela m'aide beaucoup pour les recommandations.",
      "Parfait ! J'ai bien noté la composition de votre groupe.",
      'Excellent ! Ces informations vont me permettre de personnaliser mes suggestions.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateLocationResponse(): string {
    const responses = [
      "Excellent choix de destination ! J'ai plein d'idées pour vous.",
      'Cette destination est fantastique ! Laissez-moi vous préparer quelque chose de spécial.',
      'Parfait ! Je connais très bien cette région, vous allez adorer.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generatePreferencesResponse(): string {
    const responses = [
      "J'ai bien noté vos préférences ! Cela va m'aider à personnaliser votre voyage.",
      'Parfait ! Ces détails sont précieux pour créer votre voyage idéal.',
      "Excellent ! Vos préférences sont claires, je vais pouvoir vous proposer exactement ce qu'il vous faut.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateGeneralResponse(): string {
    const responses = [
      'Je comprends. Pouvez-vous me donner plus de détails pour que je puisse mieux vous aider ?',
      'Intéressant ! Dites-moi en plus pour que je puisse vous proposer les meilleures options.',
      "D'accord ! J'ai besoin de quelques précisions supplémentaires pour vous conseiller au mieux.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Reset conversation context
   */
  resetContext(): void {
    this.conversationContext = [];
  }

  /**
   * Get conversation context for debugging
   */
  getContext(): string[] {
    return [...this.conversationContext];
  }
}

// Export singleton instance
export const agentSimulator = new AgentSimulator();
