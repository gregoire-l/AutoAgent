import type { StateCreator } from 'zustand';
import type {
  CanvasState,
  MissionSectionData,
  MissionStatus,
  MissionOption,
} from '../types';
import { generateId } from '@/lib/helpers';
import { getCurrentDemoData } from '@/lib/demo-data';

// Canvas slice interface
export interface CanvasSlice extends CanvasState {
  // Actions
  updateSectionStatus: (sectionId: string, status: MissionStatus) => void;
  updateSectionContent: (sectionId: string, content: string) => void;
  selectSection: (sectionId: string) => void;
  clearSelection: () => void;
  setEditingMode: (editing: boolean) => void;
  setMissionTitle: (title: string) => void;
  addSection: (section: Omit<MissionSectionData, 'id'>) => void;
  removeSection: (sectionId: string) => void;
  selectOption: (sectionId: string, optionId: string) => void;
  addOption: (sectionId: string, option: Omit<MissionOption, 'id'>) => void;
  setCanvasSections: (sections: MissionSectionData[]) => void;
  initializeMissionSections: () => void;
  initializeDemoData: () => void;
}

// Canvas slice creator
export const createCanvasSlice: StateCreator<
  CanvasSlice,
  [],
  [],
  CanvasSlice
> = set => ({
  // Initial state
  sections: [],
  selectedSectionId: undefined,
  editingMode: false,
  missionTitle: '',

  // Actions
  updateSectionStatus: (sectionId: string, status: MissionStatus) => {
    set(state => ({
      sections: state.sections.map(section =>
        section.id === sectionId ? { ...section, status } : section
      ),
    }));
  },

  updateSectionContent: (sectionId: string, content: string) => {
    set(state => ({
      sections: state.sections.map(section =>
        section.id === sectionId ? { ...section, content } : section
      ),
    }));
  },

  selectSection: (sectionId: string) => {
    set({ selectedSectionId: sectionId });
  },

  clearSelection: () => {
    set({ selectedSectionId: undefined });
  },

  setEditingMode: (editing: boolean) => {
    set({ editingMode: editing });
  },

  setMissionTitle: (title: string) => {
    set({ missionTitle: title });
  },

  addSection: (section: Omit<MissionSectionData, 'id'>) => {
    const newSection: MissionSectionData = {
      ...section,
      id: generateId(),
    };

    set(state => ({
      sections: [...state.sections, newSection],
    }));
  },

  removeSection: (sectionId: string) => {
    set(state => ({
      sections: state.sections.filter(section => section.id !== sectionId),
      selectedSectionId:
        state.selectedSectionId === sectionId
          ? undefined
          : state.selectedSectionId,
    }));
  },

  selectOption: (sectionId: string, optionId: string) => {
    set(state => ({
      sections: state.sections.map(section =>
        section.id === sectionId && section.options
          ? {
              ...section,
              options: section.options.map(option => ({
                ...option,
                selected: option.id === optionId,
              })),
            }
          : section
      ),
    }));
  },

  addOption: (sectionId: string, option: Omit<MissionOption, 'id'>) => {
    const newOption: MissionOption = {
      ...option,
      id: generateId(),
    };

    set(state => ({
      sections: state.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              options: [...(section.options || []), newOption],
            }
          : section
      ),
    }));
  },

  setCanvasSections: (sections: MissionSectionData[]) => {
    set({ sections, selectedSectionId: undefined });
  },

  initializeMissionSections: () => {
    const defaultSections: MissionSectionData[] = [
      {
        id: generateId(),
        title: 'Objectif',
        status: 'in_progress',
        isEditable: true,
        content: 'Organiser un voyage aller-retour Lyon-Paris pour 4 personnes',
      },
      {
        id: generateId(),
        title: 'Contraintes',
        status: 'to_define',
        isEditable: true,
        content: '',
      },
      {
        id: generateId(),
        title: 'Livrable Clé',
        status: 'to_define',
        isEditable: false,
        options: [
          { id: generateId(), label: 'Tableau Comparatif', value: 'table' },
          {
            id: generateId(),
            label: 'Simple Liste des Options',
            value: 'list',
          },
          {
            id: generateId(),
            label: 'Recommandation Unique',
            value: 'recommendation',
          },
        ],
      },
      {
        id: generateId(),
        title: 'Critère de Succès Principal',
        status: 'to_define',
        isEditable: false,
        options: [
          { id: generateId(), label: 'Prix le plus bas', value: 'price' },
          { id: generateId(), label: 'Temps de trajet minimal', value: 'time' },
          { id: generateId(), label: 'Confort maximal', value: 'comfort' },
          {
            id: generateId(),
            label: 'Flexibilité des horaires',
            value: 'flexibility',
          },
        ],
      },
      {
        id: generateId(),
        title: 'Validateur',
        status: 'confirmed',
        isEditable: false,
        content: 'Vous',
      },
      {
        id: generateId(),
        title: 'Contexte/Motivation',
        status: 'to_define',
        isEditable: true,
        content: '',
      },
      {
        id: generateId(),
        title: 'Budget Approximatif',
        status: 'to_define',
        isEditable: true,
        content: '',
      },
    ];

    set({
      sections: defaultSections,
      missionTitle: 'Mission : Organisation Voyage Lyon-Paris',
    });
  },

  // Initialize with demo data
  initializeDemoData: () => {
    const demoData = getCurrentDemoData();
    set({
      sections: demoData.mission.sections,
      missionTitle: demoData.mission.title,
      selectedSectionId: undefined,
      editingMode: false,
    });
  },
});
