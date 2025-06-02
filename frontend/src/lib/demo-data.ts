import type { MessageData } from '@/features/chat/types';
import type { MissionSectionData } from '@/features/canvas/types';

// Demo mission scenarios for different use cases
export const DEMO_MISSIONS = {
  FAMILY_VACATION: {
    id: 'mission-family-vacation',
    title: 'Vacances familiales à Paris',
    description: 'Organisation d\'un voyage en famille de 5 personnes à Paris',
    status: 'in_progress' as const,
    sections: [
      {
        id: 'participants',
        title: 'Participants',
        status: 'completed' as const,
        content: '2 adultes + 3 enfants (8, 12, 15 ans) - Parents: Marie et Pierre Dubois, Enfants: Emma (15 ans), Lucas (12 ans), Léa (8 ans). Besoins spéciaux: Léa allergique aux fruits à coque',
        isEditable: false,
      },
      {
        id: 'dates',
        title: 'Dates et durée',
        status: 'completed' as const,
        content: '15-22 juillet 2024 (7 jours) - Départ: Dimanche 15 juillet matin, Retour: Dimanche 22 juillet soir. Flexibilité: ±2 jours possible',
        isEditable: false,
      },
      {
        id: 'budget',
        title: 'Budget',
        status: 'in_progress' as const,
        content: '3000-4000€ pour la famille - Hébergement: 1500-2000€, Transport: 500-800€, Activités: 800-1000€, Repas: 200-400€',
        isEditable: true,
      },
      {
        id: 'preferences',
        title: 'Préférences',
        status: 'pending' as const,
        content: 'À clarifier - Type d\'hébergement, Activités prioritaires, Contraintes de mobilité',
        isEditable: true,
      },
    ] as MissionSectionData[],
  },
} as const;

// Demo chat conversations for different scenarios
export const DEMO_CONVERSATIONS = {
  FAMILY_VACATION: [
    {
      id: 'msg-1',
      content: 'Bonjour ! Je souhaite organiser des vacances en famille à Paris pour cet été. Nous sommes 5 personnes.',
      role: 'user' as const,
      timestamp: new Date('2024-01-15T10:00:00'),
    },
    {
      id: 'msg-2',
      content: 'Bonjour ! Je serais ravi de vous aider à organiser vos vacances familiales à Paris. Pour mieux vous conseiller, j\'ai quelques questions à vous poser.',
      role: 'assistant' as const,
      timestamp: new Date('2024-01-15T10:00:30'),
    },
    {
      id: 'msg-3',
      content: 'Pouvez-vous me préciser la composition de votre famille et les âges des enfants ? Cela m\'aidera à vous proposer des activités adaptées.',
      role: 'assistant' as const,
      timestamp: new Date('2024-01-15T10:00:45'),
    },
    {
      id: 'msg-4',
      content: 'Nous sommes 2 adultes et 3 enfants : Emma 15 ans, Lucas 12 ans et Léa 8 ans. Léa est allergique aux fruits à coque.',
      role: 'user' as const,
      timestamp: new Date('2024-01-15T10:02:00'),
    },
    {
      id: 'msg-5',
      content: 'Parfait ! J\'ai noté l\'allergie de Léa, nous en tiendrons compte pour les restaurants. Quelles sont vos dates souhaitées et votre budget approximatif ?',
      role: 'assistant' as const,
      timestamp: new Date('2024-01-15T10:02:30'),
    },
    {
      id: 'msg-6',
      content: 'Nous pensons partir du 15 au 22 juillet, avec un budget de 3000-4000€ pour toute la famille.',
      role: 'user' as const,
      timestamp: new Date('2024-01-15T10:04:00'),
    },
    {
      id: 'msg-7',
      content: 'Excellent ! J\'ai mis à jour votre mission avec ces informations. Il nous reste à clarifier vos préférences d\'hébergement et d\'activités. Préférez-vous un hôtel familial, un appartement ou autre chose ?',
      role: 'assistant' as const,
      timestamp: new Date('2024-01-15T10:04:45'),
    },
  ] as MessageData[],
} as const;

// Current active demo scenario
export const CURRENT_DEMO_SCENARIO = 'FAMILY_VACATION' as const;

// Agent responses templates for realistic interactions
export const AGENT_RESPONSES = {
  GREETING: [
    'Bonjour ! Je suis votre agent de voyage personnel. Comment puis-je vous aider aujourd\'hui ?',
    'Salut ! Ravi de vous rencontrer. Quel voyage avez-vous en tête ?',
    'Bonjour ! Je suis là pour vous aider à organiser le voyage parfait. Parlez-moi de votre projet !',
  ],
  CLARIFICATION: [
    'Pour mieux vous conseiller, pouvez-vous me donner plus de détails sur...',
    'J\'ai besoin de quelques précisions pour vous proposer les meilleures options...',
    'Parfait ! Maintenant, aidez-moi à comprendre vos préférences concernant...',
  ],
  CONFIRMATION: [
    'Excellent ! J\'ai mis à jour votre mission avec ces informations.',
    'Parfait ! J\'ai noté tous ces détails dans votre dossier.',
    'Super ! Ces informations vont m\'aider à vous proposer des options personnalisées.',
  ],
  SUGGESTIONS: [
    'Basé sur vos critères, je vous recommande...',
    'Voici quelques options qui pourraient vous intéresser...',
    'J\'ai trouvé plusieurs possibilités qui correspondent à vos attentes...',
  ],
} as const;

// Demo user personas for testing different scenarios
export const USER_PERSONAS = {
  FAMILY_TRAVELER: {
    name: 'Marie Dubois',
    type: 'Famille avec enfants',
    priorities: ['Sécurité', 'Activités familiales', 'Budget maîtrisé'],
    communication_style: 'Détaillée et prudente',
  },
  BUSINESS_TRAVELER: {
    name: 'Jean-Michel Larsson',
    type: 'Voyageur d\'affaires',
    priorities: ['Efficacité', 'Confort', 'Ponctualité'],
    communication_style: 'Directe et concise',
  },
} as const;

// Helper functions for demo data management
export function getCurrentDemoData() {
  const scenario = CURRENT_DEMO_SCENARIO;
  return {
    mission: DEMO_MISSIONS[scenario],
    conversation: DEMO_CONVERSATIONS[scenario],
    persona: USER_PERSONAS.FAMILY_TRAVELER,
  };
}

export function getRandomAgentResponse(type: keyof typeof AGENT_RESPONSES): string {
  const responses = AGENT_RESPONSES[type];
  return responses[Math.floor(Math.random() * responses.length)];
}

export function simulateTypingDelay(): Promise<void> {
  const delay = Math.random() * 2000 + 1000; // 1-3 seconds
  return new Promise(resolve => setTimeout(resolve, delay));
}
