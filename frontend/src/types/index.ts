// Global types and interfaces
// Define application-wide types here

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface Mission {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'clarifying' | 'executing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Common UI types
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Layout types
export interface LayoutConfig {
  chatPanelWidth: number; // percentage
  canvasPanelWidth: number; // percentage
  showSidebar: boolean;
}
