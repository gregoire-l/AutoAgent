import type { ScriptedResponse, UserInteraction, ClarificationPhase } from '../types';
import type { MissionSectionData } from '@/features/canvas/types';

// Lyon-Paris example message from user story
export const LYON_PARIS_EXAMPLE = "Hello, j'aurais besoin d'organiser un A/R Lyon-Paris pour 4 potes. On a un budget de 100€ max. Faut qu'on soit à Paris le vendredi 4 avril avant 20h et qu'on reparte le dimanche soir.";

// Pre-defined mission sections for Lyon-Paris trip
export const LYON_PARIS_MISSION_SECTIONS: MissionSectionData[] = [
  {
    id: 'objectif',
    title: 'Objectif',
    status: 'in_progress',
    content: 'Organiser un voyage aller-retour Lyon-Paris pour 4 personnes',
    isEditable: true,
  },
  {
    id: 'contraintes',
    title: 'Contraintes',
    status: 'in_progress',
    content: 'Budget: 100€ ?, Dates: ✓, Horaires: ?',
    isEditable: true,
  },
  {
    id: 'livrable-cle',
    title: 'Livrable Clé',
    status: 'to_define',
    content: '',
    isEditable: false,
    options: [
      { id: 'tableau-comparatif', label: 'Tableau Comparatif', value: 'table' },
      { id: 'simple-liste', label: 'Simple Liste des Options', value: 'list' },
    ],
  },
  {
    id: 'critere-succes',
    title: 'Critère de Succès Principal',
    status: 'to_define',
    content: '',
    isEditable: false,
    options: [
      { id: 'prix-bas', label: 'Prix le plus bas', value: 'price' },
      { id: 'temps-minimal', label: 'Temps de trajet minimal', value: 'time' },
    ],
  },
  {
    id: 'validateur',
    title: 'Validateur',
    status: 'confirmed',
    content: 'Vous',
    isEditable: false,
  },
  {
    id: 'contexte-motivation',
    title: 'Contexte/Motivation',
    status: 'to_define',
    content: '',
    isEditable: true,
  },
];

// Complete scripted conversation flow for Lyon-Paris clarification
export const LYON_PARIS_SCRIPT: ScriptedResponse[] = [
  // Phase A2 - Step 1: Initial clarification
  {
    id: 'clarification-budget-horaires',
    phase: 'A2',
    step: 1,
    content: "Ok, ça marche pour le trip Lyon-Paris ! Deux petites précisions pour être sûr : le budget de 100€, c'est par tête ou pour tout le groupe ? Et pour le retour dimanche soir, 'pas avant 18h', ça te va ?",
    canvasUpdates: [
      {
        sectionId: 'contraintes',
        status: 'in_progress',
        highlight: true,
        animation: 'glow',
      },
    ],
    delay: 2000,
    triggerCondition: 'user_message_sent',
    suggestedUserResponse: "Ah yes, 100€ par personne (donc 400€ total). Et oui, départ après 18h c'est parfait.",
  },

  // Phase A2 - Step 2: Budget confirmation
  {
    id: 'confirmation-budget',
    phase: 'A2',
    step: 2,
    content: "Super clair ! Budget max 400€ et départ >18h dimanche, c'est noté et validé.",
    canvasUpdates: [
      {
        sectionId: 'contraintes',
        status: 'confirmed',
        content: 'Budget: 400€ total, Horaire Retour: >18h',
        highlight: false,
        animation: 'none',
      },
    ],
    delay: 1500,
    triggerCondition: 'user_budget_response',
  },

  // Phase A2 - Step 3: Canvas modification feedback
  {
    id: 'budget-modification-feedback',
    phase: 'A2',
    step: 3,
    content: "Bien noté ! Budget mis à jour à 450€ max total sur le Canvas.",
    canvasUpdates: [
      {
        sectionId: 'contraintes',
        status: 'confirmed',
        content: 'Budget: 450€ total, Horaire Retour: >18h',
        highlight: false,
        animation: 'none',
      },
    ],
    delay: 1000,
    triggerCondition: 'canvas_budget_edit',
  },

  // Phase A2 - Step 4: Livrable suggestion
  {
    id: 'livrable-suggestion',
    phase: 'A2',
    step: 4,
    content: "Maintenant, qu'est-ce que tu attends comme résultat concret de ma part ? Souvent, pour ce genre de demande, un tableau comparatif des options est le plus utile.",
    canvasUpdates: [
      {
        sectionId: 'livrable-cle',
        status: 'in_progress',
        highlight: true,
        animation: 'pulse',
      },
    ],
    delay: 2500,
    triggerCondition: 'auto_advance',
  },

  // Phase A2 - Step 5: Livrable confirmation
  {
    id: 'livrable-confirmation',
    phase: 'A2',
    step: 5,
    content: "Parfait pour le tableau comparatif détaillé !",
    canvasUpdates: [
      {
        sectionId: 'livrable-cle',
        status: 'confirmed',
        content: 'Tableau Comparatif',
        highlight: false,
        animation: 'none',
      },
    ],
    delay: 1000,
    triggerCondition: 'canvas_option_select',
  },

  // Phase A2 - Step 6: Critère de succès question
  {
    id: 'critere-succes-question',
    phase: 'A2',
    step: 6,
    content: "Ok. Et pour choisir la meilleure option dans ce tableau, qu'est-ce qui primera vraiment pour toi, vu le budget qu'on a fixé ? Le Prix le plus bas (même si le trajet est un peu plus long), ou un Temps de trajet minimal (quitte à payer un peu plus) ?",
    canvasUpdates: [
      {
        sectionId: 'critere-succes',
        status: 'in_progress',
        highlight: true,
        animation: 'pulse',
      },
    ],
    delay: 3000,
    triggerCondition: 'auto_advance',
  },

  // Phase A2 - Step 7: Critère confirmation
  {
    id: 'critere-confirmation',
    phase: 'A2',
    step: 7,
    content: "Noté, priorité absolue au prix le plus bas parmi les options valides !",
    canvasUpdates: [
      {
        sectionId: 'critere-succes',
        status: 'confirmed',
        content: 'Prix le plus bas',
        highlight: false,
        animation: 'none',
      },
    ],
    delay: 1500,
    triggerCondition: 'canvas_radio_select',
  },

  // Phase A3 - Step 1: Contexte question
  {
    id: 'contexte-question',
    phase: 'A3',
    step: 1,
    content: "Une dernière petite chose : c'est pour quelle occasion ce voyage ? Ça m'aiderait à mieux cibler les recommandations (transport, timing, etc.).",
    canvasUpdates: [
      {
        sectionId: 'contexte-motivation',
        status: 'in_progress',
        highlight: true,
        animation: 'glow',
      },
    ],
    delay: 2000,
    triggerCondition: 'auto_advance',
    suggestedUserResponse: "C'est pour un weekend entre potes, rien de spécial, juste se retrouver à Paris.",
  },

  // Phase A3 - Step 2: Final confirmation
  {
    id: 'final-confirmation',
    phase: 'A3',
    step: 2,
    content: "Super, on a fait le tour de tous les points importants ! Ça te semble bien complet comme ça ? Si tout est bon pour toi, je te prépare le récapitulatif final avant de lancer la recherche.",
    canvasUpdates: [
      {
        sectionId: 'contexte-motivation',
        status: 'confirmed',
        highlight: false,
        animation: 'none',
      },
    ],
    delay: 2500,
    triggerCondition: 'user_context_response',
    suggestedUserResponse: "Oui, ça me semble parfait ! On peut y aller.",
  },
];

// User interaction templates for realistic responses
export const USER_RESPONSE_TEMPLATES = {
  budget_clarification: [
    "Ah yes, 100€ par personne (donc 400€ total). Et oui, départ après 18h c'est parfait.",
    "C'est 100€ par tête, donc 400€ au total. Pour le retour, après 18h ça marche très bien.",
  ],
  context_responses: [
    "C'est pour un weekend entre potes, rien de spécial, juste se retrouver à Paris.",
    "Weekend détente entre amis, on veut juste profiter de Paris sans stress.",
    "C'est un petit trip entre copains, on veut découvrir Paris ensemble.",
  ],
  confirmation_responses: [
    "Oui, ça me semble parfait ! On peut y aller.",
    "Parfait, tout est clair. Tu peux lancer la recherche !",
    "Super, c'est exactement ce qu'il nous faut. Go !",
  ],
};

// Timing configuration for realistic delays
export const TIMING_CONFIG = {
  TYPING_DELAY: 1500, // Base typing delay
  THINKING_DELAY: 800, // Agent thinking time
  CANVAS_UPDATE_DELAY: 300, // Canvas animation delay
  USER_RESPONSE_DELAY: 2000, // Simulated user response time
  PHASE_TRANSITION_DELAY: 1000, // Delay between phases
};

// Helper function to get response by trigger condition
export function getResponseByTrigger(trigger: string, phase: ClarificationPhase): ScriptedResponse | undefined {
  return LYON_PARIS_SCRIPT.find(
    response => response.triggerCondition === trigger && response.phase === phase
  );
}

// Helper function to get next response in sequence
export function getNextResponse(
  userInteraction: UserInteraction | null,
  scriptedResponses: ScriptedResponse[],
  currentPhase: ClarificationPhase,
  currentStep: number
): ScriptedResponse | undefined {
  // First try to find a response that matches the current step + 1
  const nextStepResponse = scriptedResponses.find(
    response => response.phase === currentPhase && response.step === currentStep + 1
  );

  if (nextStepResponse) {
    return nextStepResponse;
  }

  // If no direct next step, try to find based on trigger conditions
  if (userInteraction) {
    const triggerResponse = scriptedResponses.find(
      response => {
        // Match based on interaction type and current context
        if (userInteraction.type === 'message' && response.triggerCondition === 'user_message_sent') {
          return response.phase === currentPhase;
        }
        if (userInteraction.type === 'canvas_click' && response.triggerCondition === 'canvas_interaction') {
          return response.phase === currentPhase;
        }
        return false;
      }
    );

    if (triggerResponse) {
      return triggerResponse;
    }
  }

  return undefined;
}

// Helper function to get next response by step (legacy compatibility)
export function getNextResponseByStep(currentPhase: ClarificationPhase, currentStep: number): ScriptedResponse | undefined {
  return LYON_PARIS_SCRIPT.find(
    response => response.phase === currentPhase && response.step === currentStep + 1
  );
}

// Helper function to get random user response template
export function getRandomUserResponse(type: keyof typeof USER_RESPONSE_TEMPLATES): string {
  const templates = USER_RESPONSE_TEMPLATES[type];
  return templates[Math.floor(Math.random() * templates.length)];
}
