export type StatusType = 'confirmed' | 'in-discussion' | 'suggestion' | 'unaddressed';

export type PriorityLevel = 'imperative' | 'essential' | 'appreciable' | 'optional';

export interface Constraint {
  id: string;
  label: string;
  value: string;
  status: StatusType;
  icon: string;
  secondaryDetails?: string[];
  tag?: string;
}

export interface SuccessCriteria {
  id: string;
  text: string;
  priority: PriorityLevel;
  status: StatusType;
  isSuggested?: boolean;
}

export interface SuggestionOption {
  id: string;
  text: string;
  selected?: boolean;
}

export interface DeliverableSection {
  id: string;
  title: string;
  status: StatusType;
  icon: string;
  value?: string;
  suggestions?: SuggestionOption[];
}

export interface Milestone {
  id: string;
  number: number;
  title: string;
  when: string;
  status: StatusType;
  checkpoints: string[];
  position: number; // percentage position on timeline
  expanded?: boolean; // for UI state
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  constraints: Constraint[];
  successCriteria: SuccessCriteria[];
  deliverable: DeliverableSection;
  milestones: Milestone[];
  chatMessages: ChatMessage[];
}

// Mock data based on the HTML prototype
export const mockMissionData: Mission = {
  id: 'mission-1',
  title: 'Organisation Voyage Lyon-Paris',
  objective: 'Organiser un voyage aller-retour entre Lyon et Paris pour un groupe de 4 amis.',
  constraints: [
    {
      id: 'constraint-1',
      label: 'Voyageurs',
      value: '4 personnes',
      status: 'confirmed',
      icon: 'users'
    },
    {
      id: 'constraint-2',
      label: 'Budget',
      value: '100€',
      status: 'in-discussion',
      icon: 'currency-euro',
      tag: 'Par tête ou total ?',
      secondaryDetails: ['Clarification nécessaire pour ce point.']
    },
    {
      id: 'constraint-3',
      label: 'Période',
      value: 'Vendredi 4 Avril → Dimanche 6 Avril',
      status: 'confirmed',
      icon: 'calendar-days',
      secondaryDetails: [
        'Aller : arrivée avant 20h',
        'Retour : départ après 18h'
      ]
    },
    {
      id: 'constraint-4',
      label: 'Trajet',
      value: 'Lyon → Paris',
      status: 'confirmed',
      icon: 'arrows-up-down'
    }
  ],
  successCriteria: [
    {
      id: 'criteria-1',
      text: 'Respect du budget total (450€ max)',
      priority: 'imperative',
      status: 'confirmed'
    },
    {
      id: 'criteria-2',
      text: 'Temps de trajet optimisé',
      priority: 'essential',
      status: 'confirmed'
    },
    {
      id: 'criteria-3',
      text: 'Confort des transports (suggestion agent)',
      priority: 'appreciable',
      status: 'suggestion',
      isSuggested: true
    },
    {
      id: 'criteria-4',
      text: 'Flexibilité pour modification de dernière minute (suggestion agent)',
      priority: 'optional',
      status: 'suggestion',
      isSuggested: true
    }
  ],
  deliverable: {
    id: 'deliverable-1',
    title: 'Format du Résultat',
    status: 'suggestion',
    icon: 'document-text',
    value: 'Quel format préférez-vous ?',
    suggestions: [
      { id: 'suggestion-1', text: 'Tableau Comparatif Détaillé' },
      { id: 'suggestion-2', text: 'Simple Liste des Options' }
    ]
  },
  milestones: [
    {
      id: 'milestone-1',
      number: 1,
      title: 'Validation du Plan de Recherche',
      when: 'Avant lancement des recherches approfondies',
      status: 'suggestion',
      position: 20,
      checkpoints: [
        'Sources de données proposées pertinentes',
        'Méthodologie de comparaison claire'
      ]
    },
    {
      id: 'milestone-2',
      number: 2,
      title: 'Approbation du Livrable Final',
      when: 'À la réception du tableau comparatif',
      status: 'confirmed',
      position: 85,
      checkpoints: [
        'Conformité aux critères Impératifs',
        'Qualité globale de la réalisation'
      ]
    }
  ],
  chatMessages: [
    {
      id: 'msg-1',
      type: 'user',
      content: 'Hello, j\'aurais besoin d\'organiser un A/R Lyon-Paris pour 4 potes. On a un budget de 100€ max. Faut qu\'on soit à Paris le vendredi 4 avril avant 20h et qu\'on reparte le dimanche soir.',
      timestamp: new Date('2024-01-15T10:00:00')
    },
    {
      id: 'msg-2',
      type: 'agent',
      content: 'Ok, ça marche pour le trip Lyon-Paris ! Deux petites précisions pour être sûr : le budget de **100€**, c\'est par tête ou pour tout le groupe ? Et pour le retour dimanche soir, \'pas avant 18h\', ça te va ?',
      timestamp: new Date('2024-01-15T10:01:00')
    },
    {
      id: 'msg-3',
      type: 'user',
      content: 'Ah yes, 100€ par personne (donc 400€ total). Et oui, départ après 18h c\'est parfait.',
      timestamp: new Date('2024-01-15T10:02:00')
    },
    {
      id: 'msg-4',
      type: 'agent',
      content: 'Super clair ! Budget max **400€** et départ **>18h dimanche**, c\'est noté et validé.',
      timestamp: new Date('2024-01-15T10:03:00')
    },
    {
      id: 'msg-5',
      type: 'agent',
      content: 'Maintenant, qu\'est-ce que tu attends comme résultat concret de ma part ? Souvent, pour ce genre de demande, un **tableau comparatif** des options est le plus utile.',
      timestamp: new Date('2024-01-15T10:04:00')
    },
    {
      id: 'msg-6',
      type: 'user',
      content: 'Oui, un tableau comparatif détaillé, c\'est exactement ça.',
      timestamp: new Date('2024-01-15T10:05:00')
    },
    {
      id: 'msg-7',
      type: 'agent',
      content: 'Parfait pour le tableau comparatif détaillé !',
      timestamp: new Date('2024-01-15T10:06:00')
    },
    {
      id: 'msg-8',
      type: 'agent',
      content: 'Pour être sûr de bien cibler, quel est l\'**objectif principal** de ce voyage ? Détente entre amis, événement spécifique à Paris ?',
      timestamp: new Date('2024-01-15T10:07:00')
    },
    {
      id: 'msg-9',
      type: 'user',
      content: 'C\'est surtout pour un week-end détente et revoir un concert d\'un groupe qu\'on adore.',
      timestamp: new Date('2024-01-15T10:08:00')
    },
    {
      id: 'msg-10',
      type: 'agent',
      content: 'Excellent ! Et en termes de **critères de succès**, outre le respect du budget, y a-t-il autre chose d\'important ? Confort des transports, proximité du lieu du concert pour l\'hébergement ?',
      timestamp: new Date('2024-01-15T10:09:00')
    }
  ]
};
