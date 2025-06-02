// Canvas types and interfaces
// Define all canvas-related types here

export type MissionStatus =
  | 'pending'
  | 'in_progress'
  | 'confirmed'
  | 'to_define';

export interface MissionSectionData {
  id: string;
  title: string;
  status: MissionStatus;
  content?: string;
  isEditable: boolean;
  options?: MissionOption[];
}

export interface MissionOption {
  id: string;
  label: string;
  value: string;
  selected?: boolean;
}

export interface CanvasState {
  sections: MissionSectionData[];
  selectedSectionId?: string;
  editingMode: boolean;
  missionTitle: string;
}

// Status indicator mapping
export const STATUS_INDICATORS = {
  pending: '❔',
  in_progress: '🟡',
  confirmed: '✔️',
  to_define: '❔',
} as const;

export const STATUS_COLORS = {
  pending: '#A1A1AA', // gray
  in_progress: '#FACC15', // yellow
  confirmed: '#10B981', // green
  to_define: '#A1A1AA', // gray
} as const;
