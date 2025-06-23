import { create } from 'zustand';
import { mockMissionData } from '@/types/mission';
import type { Mission, StatusType } from '@/types/mission';

interface MissionStore {
  currentMission: Mission | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMission: (mission: Mission) => void;
  updateMissionStatus: (sectionId: string, status: string) => void;
  selectSuggestion: (suggestionId: string) => void;
  toggleAccordion: (milestoneId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface UIStore {
  expandedMilestones: Set<string>;
  selectedSuggestions: Record<string, string>;
  
  // Actions
  toggleMilestone: (milestoneId: string) => void;
  selectSuggestion: (groupId: string, suggestionId: string) => void;
  clearSelections: () => void;
}

export const useMissionStore = create<MissionStore>((set) => ({
  currentMission: mockMissionData,
  isLoading: false,
  error: null,
  
  setMission: (mission) => set({ currentMission: mission }),
  
  updateMissionStatus: (sectionId, status) => set((state) => {
    if (!state.currentMission) return state;
    
    // Update constraint status
    const updatedConstraints = state.currentMission.constraints.map(constraint =>
      constraint.id === sectionId ? { ...constraint, status: status as StatusType } : constraint
    );

    // Update criteria status
    const updatedCriteria = state.currentMission.successCriteria.map(criteria =>
      criteria.id === sectionId ? { ...criteria, status: status as StatusType } : criteria
    );
    
    return {
      currentMission: {
        ...state.currentMission,
        constraints: updatedConstraints,
        successCriteria: updatedCriteria
      }
    };
  }),
  
  selectSuggestion: (suggestionId) => set((state) => {
    if (!state.currentMission) return state;
    
    const updatedDeliverable = {
      ...state.currentMission.deliverable,
      status: 'confirmed' as const,
      suggestions: state.currentMission.deliverable.suggestions?.map(suggestion =>
        suggestion.id === suggestionId 
          ? { ...suggestion, selected: true }
          : { ...suggestion, selected: false }
      )
    };
    
    return {
      currentMission: {
        ...state.currentMission,
        deliverable: updatedDeliverable
      }
    };
  }),
  
  toggleAccordion: (milestoneId) => set((state) => {
    if (!state.currentMission) return state;
    
    const updatedMilestones = state.currentMission.milestones.map(milestone =>
      milestone.id === milestoneId 
        ? { ...milestone, expanded: !milestone.expanded }
        : milestone
    );
    
    return {
      currentMission: {
        ...state.currentMission,
        milestones: updatedMilestones
      }
    };
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));

export const useUIStore = create<UIStore>((set) => ({
  expandedMilestones: new Set(),
  selectedSuggestions: {},
  
  toggleMilestone: (milestoneId) => set((state) => {
    const newExpanded = new Set(state.expandedMilestones);
    if (newExpanded.has(milestoneId)) {
      newExpanded.delete(milestoneId);
    } else {
      newExpanded.add(milestoneId);
    }
    return { expandedMilestones: newExpanded };
  }),
  
  selectSuggestion: (groupId, suggestionId) => set((state) => ({
    selectedSuggestions: {
      ...state.selectedSuggestions,
      [groupId]: suggestionId
    }
  })),
  
  clearSelections: () => set({ selectedSuggestions: {}, expandedMilestones: new Set() })
}));
