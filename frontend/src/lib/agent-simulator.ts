import type { MessageData } from '@/features/chat/types';
import {
  getRandomAgentResponse,
  simulateTypingDelay,
} from './demo-data';
import type {
  ScriptedResponse,
  ClarificationPhase,
  CanvasUpdate
} from '@/features/mission-clarification/types';
import { TIMING_CONFIG } from '@/features/mission-clarification/data/scriptedContent';

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
  // Clarification-specific intents
  CLARIFICATION_CONFIRM: ['confirme', 'valide', 'approuve', 'accepte', 'c\'est bon'],
  CLARIFICATION_MODIFY: ['modifie', 'change', 'corrige', 'ajuste', 'différent'],
  CANVAS_INTERACTION: ['clique', 'sélectionne', 'choisit', 'option', 'bouton'],
  OBJECTIVE_CLARIFICATION: ['objectif', 'but', 'mission', 'goal'],
  CONSTRAINT_CLARIFICATION: ['contrainte', 'limite', 'restriction', 'condition'],
} as const;

// Agent response patterns based on user input
export class AgentSimulator {
  private conversationContext: string[] = [];

  // Clarification mode properties
  private clarificationMode = false;
  private scriptedResponses: ScriptedResponse[] = [];
  private currentPhase: ClarificationPhase = 'A2';
  private currentStep = 0;

  /**
   * Analyze user message and generate appropriate agent response
   */
  async generateResponse(
    userMessage: string,
    phase?: ClarificationPhase,
    step?: number
  ): Promise<{
    message: MessageData;
    canvasUpdates?: CanvasUpdate[] | string[];
  }> {
    // Route to clarification mode if enabled
    if (this.clarificationMode && phase !== undefined && step !== undefined) {
      return this.generateClarificationResponse(userMessage, phase, step);
    }

    // Standard mode - existing functionality
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

    // Check for clarification-specific intents first if in clarification mode
    if (this.clarificationMode) {
      if (
        INTENT_KEYWORDS.CLARIFICATION_CONFIRM.some(keyword => lowerMessage.includes(keyword))
      ) {
        return 'CLARIFICATION_CONFIRM';
      }

      if (
        INTENT_KEYWORDS.CLARIFICATION_MODIFY.some(keyword => lowerMessage.includes(keyword))
      ) {
        return 'CLARIFICATION_MODIFY';
      }

      if (
        INTENT_KEYWORDS.OBJECTIVE_CLARIFICATION.some(keyword => lowerMessage.includes(keyword))
      ) {
        return 'OBJECTIVE_CLARIFICATION';
      }

      if (
        INTENT_KEYWORDS.CONSTRAINT_CLARIFICATION.some(keyword => lowerMessage.includes(keyword))
      ) {
        return 'CONSTRAINT_CLARIFICATION';
      }
    }

    // Standard intent detection
    if (
      INTENT_KEYWORDS.GREETING.some(keyword => lowerMessage.includes(keyword))
    ) {
      return 'GREETING';
    }

    if (
      INTENT_KEYWORDS.BUDGET.some(keyword => lowerMessage.includes(keyword))
    ) {
      return 'BUDGET';
    }

    if (INTENT_KEYWORDS.DATES.some(keyword => lowerMessage.includes(keyword))) {
      return 'DATES';
    }

    if (
      INTENT_KEYWORDS.PARTICIPANTS.some(keyword =>
        lowerMessage.includes(keyword)
      )
    ) {
      return 'PARTICIPANTS';
    }

    if (
      INTENT_KEYWORDS.LOCATION.some(keyword => lowerMessage.includes(keyword))
    ) {
      return 'LOCATION';
    }

    if (
      INTENT_KEYWORDS.PREFERENCES.some(keyword =>
        lowerMessage.includes(keyword)
      )
    ) {
      return 'PREFERENCES';
    }

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
   * Enable clarification mode with scripted responses
   */
  enableClarificationMode(script: ScriptedResponse[], phase: ClarificationPhase = 'A2'): void {
    this.clarificationMode = true;
    this.scriptedResponses = script;
    this.currentPhase = phase;
    this.currentStep = 0;
  }

  /**
   * Disable clarification mode and return to standard mode
   */
  disableClarificationMode(): void {
    this.clarificationMode = false;
    this.scriptedResponses = [];
    this.currentPhase = 'A2';
    this.currentStep = 0;
  }

  /**
   * Generate clarification-specific response with scripted content
   */
  async generateClarificationResponse(
    userMessage: string,
    phase: ClarificationPhase,
    step: number
  ): Promise<{
    message: MessageData;
    canvasUpdates?: CanvasUpdate[];
  }> {
    // Update current state
    this.currentPhase = phase;
    this.currentStep = step;

    // Find appropriate scripted response
    const response = this.findScriptedResponse(userMessage, phase, step);

    if (!response) {
      // Fallback to general response if no script found
      return this.generateFallbackResponse(userMessage);
    }

    // Apply realistic timing based on content length and configuration
    const delay = this.calculateRealisticDelay(response);
    await this.simulateRealisticDelay(delay);

    // Add to conversation context
    this.conversationContext.push(userMessage.toLowerCase());

    const agentMessage: MessageData = {
      id: `agent-${Date.now()}`,
      content: response.content,
      role: 'assistant',
      timestamp: new Date(),
    };

    return {
      message: agentMessage,
      canvasUpdates: response.canvasUpdates,
    };
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

  /**
   * Check if clarification mode is enabled
   */
  isClarificationMode(): boolean {
    return this.clarificationMode;
  }

  /**
   * Get current clarification state
   */
  getClarificationState(): { phase: ClarificationPhase; step: number } {
    return {
      phase: this.currentPhase,
      step: this.currentStep,
    };
  }

  /**
   * Find appropriate scripted response based on user message and context
   */
  private findScriptedResponse(
    userMessage: string,
    phase: ClarificationPhase,
    step: number
  ): ScriptedResponse | undefined {
    // First try to find exact phase/step match
    let response = this.scriptedResponses.find(
      r => r.phase === phase && r.step === step
    );

    if (response) {
      return response;
    }

    // If no exact match, try to find by trigger condition
    const intent = this.detectIntent(userMessage);
    response = this.scriptedResponses.find(
      r => r.triggerCondition === intent && r.phase === phase
    );

    if (response) {
      return response;
    }

    // Try to find next logical response in sequence
    response = this.scriptedResponses.find(
      r => r.phase === phase && r.step === step + 1
    );

    return response;
  }

  /**
   * Calculate realistic delay based on response content and configuration
   */
  private calculateRealisticDelay(response: ScriptedResponse): number {
    // Use response-specific delay if provided
    if (response.delay) {
      return response.delay;
    }

    // Calculate based on content length (simulate reading/typing time)
    const baseDelay = TIMING_CONFIG.TYPING_DELAY;
    const contentLength = response.content.length;
    const typingDelay = Math.max(baseDelay, contentLength * 30); // 30ms per character

    return typingDelay;
  }

  /**
   * Simulate realistic delay with thinking and typing phases
   */
  private async simulateRealisticDelay(totalDelay: number): Promise<void> {
    // Thinking phase (shorter)
    const thinkingDelay = Math.min(TIMING_CONFIG.THINKING_DELAY, totalDelay * 0.3);
    await new Promise(resolve => setTimeout(resolve, thinkingDelay));

    // Typing phase (remaining time)
    const typingDelay = totalDelay - thinkingDelay;
    await new Promise(resolve => setTimeout(resolve, typingDelay));
  }

  /**
   * Generate fallback response when no scripted response is found
   */
  private async generateFallbackResponse(userMessage: string): Promise<{
    message: MessageData;
    canvasUpdates?: CanvasUpdate[];
  }> {
    // Use standard response generation as fallback
    await simulateTypingDelay();

    const intent = this.detectIntent(userMessage);
    const response = this.generateResponseByIntent(intent);

    const agentMessage: MessageData = {
      id: `agent-${Date.now()}`,
      content: response,
      role: 'assistant',
      timestamp: new Date(),
    };

    return {
      message: agentMessage,
      canvasUpdates: undefined,
    };
  }
}

// Export singleton instance
export const agentSimulator = new AgentSimulator();
