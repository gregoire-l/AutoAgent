/**
 * Utilities for confidence-based color calculations
 * Used to create progressive color transitions based on confidence levels
 */

/**
 * Calculate color based on confidence level
 * @param confidence - Number between 0 (low confidence) and 1 (high confidence)
 * @returns HSL color string
 */
export function getColorFromConfidence(confidence: number): string {
  // Clamp confidence between 0 and 1
  const clampedConfidence = Math.max(0, Math.min(1, confidence));
  
  // Map confidence to lightness: 0 = 80% (light gray), 1 = 20% (dark/black)
  const lightness = 80 - (clampedConfidence * 60);
  
  return `hsl(0, 0%, ${lightness}%)`;
}

/**
 * Get confidence level for mission clarification content
 * Based on the clarification progress and content specificity
 * @param content - The content to evaluate
 * @param clarificationStage - Current stage of clarification
 * @returns Confidence level between 0 and 1
 */
export function getMissionClarificationConfidence(
  content: string,
  clarificationStage: 'initial' | 'clarifying' | 'confirmed' = 'initial'
): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  // Base confidence on clarification stage
  switch (clarificationStage) {
    case 'initial':
      return 0.3; // Initial user request - low confidence, needs clarification
    case 'clarifying':
      return 0.6; // Agent is asking questions - medium confidence
    case 'confirmed':
      return 0.9; // User has confirmed details - high confidence
    default:
      return 0.3;
  }
}

/**
 * Get confidence level for mission status
 * @param status - Mission status
 * @returns Confidence level between 0 and 1
 */
export function getConfidenceFromStatus(status: string): number {
  switch (status) {
    case 'confirmed':
      return 1.0;
    case 'in_progress':
      return 0.6;
    case 'pending':
    case 'to_define':
      return 0.2;
    default:
      return 0;
  }
}

/**
 * Confidence levels for different states
 */
export const CONFIDENCE_LEVELS = {
  VERY_LOW: 0.0,
  LOW: 0.25,
  MEDIUM: 0.5,
  HIGH: 0.75,
  VERY_HIGH: 1.0,
} as const;

/**
 * Get confidence for Lyon-Paris example based on clarification progress
 * This simulates how confidence evolves during mission clarification
 */
export function getLyonParisExampleConfidence(sectionTitle: string, step: number = 1): number {
  const confidenceMap: Record<string, number[]> = {
    'Objectif': [0.2, 0.4, 0.7, 0.9], // Starts vague, becomes specific
    'Contraintes': [0.1, 0.3, 0.6, 0.8], // Initially unknown, clarified through questions
    'Budget': [0.0, 0.2, 0.5, 0.9], // Not mentioned initially, then specified
    'Participants': [0.3, 0.5, 0.8, 0.9], // "4 potes" is vague, then clarified
    'Dates': [0.1, 0.3, 0.7, 0.9], // Not specified initially
    'Transport': [0.2, 0.4, 0.6, 0.8], // Implied train, then confirmed
    'Livrable Clé': [0.0, 0.2, 0.4, 0.8], // Emerges during clarification
  };

  const steps = confidenceMap[sectionTitle] || [0.3, 0.5, 0.7, 0.9];
  const stepIndex = Math.min(Math.max(step - 1, 0), steps.length - 1);
  return steps[stepIndex];
}

/**
 * Get confidence for chat messages based on role and clarification context
 */
export function getChatMessageConfidence(
  role: 'user' | 'assistant',
  content: string,
  messageIndex: number = 0
): number {
  if (role === 'user') {
    // User messages start with low confidence (vague request) and increase as they provide details
    if (messageIndex === 0) return 0.3; // Initial request
    if (content.includes('oui') || content.includes('non')) return 0.7; // Confirmations
    if (content.includes('€') || content.includes('euro')) return 0.8; // Specific details
    return 0.6; // General responses
  } else {
    // Assistant messages have higher confidence as they guide the clarification
    if (content.includes('?')) return 0.7; // Questions for clarification
    if (content.includes('parfait') || content.includes('excellent')) return 0.9; // Confirmations
    if (content.includes('je vais') || content.includes('je peux')) return 0.8; // Action statements
    return 0.6; // General responses
  }
}

/**
 * Get confidence description
 * @param confidence - Confidence level between 0 and 1
 * @returns Human-readable confidence description
 */
export function getConfidenceDescription(confidence: number): string {
  if (confidence >= 0.9) return 'Très élevée';
  if (confidence >= 0.7) return 'Élevée';
  if (confidence >= 0.5) return 'Moyenne';
  if (confidence >= 0.3) return 'Faible';
  return 'Très faible';
}
