// Application constants
// Define all application-wide constants here

// Layout constants
export const LAYOUT = {
  CHAT_PANEL_WIDTH: 40, // percentage
  CANVAS_PANEL_WIDTH: 60, // percentage
  SIDEBAR_WIDTH: 280, // pixels
  HEADER_HEIGHT: 64, // pixels
} as const;

// Animation constants
export const ANIMATIONS = {
  TRANSITION_DURATION: 300, // milliseconds
  TYPING_INDICATOR_DELAY: 1000, // milliseconds
  MESSAGE_FADE_IN: 200, // milliseconds
} as const;

// UI Constants
export const UI = {
  MAX_MESSAGE_LENGTH: 4000,
  COMPOSER_MIN_HEIGHT: 44, // pixels
  COMPOSER_MAX_HEIGHT: 200, // pixels
} as const;

// Colors (complementing Tailwind theme)
export const COLORS = {
  BRAND_PRIMARY: '#3B82F6',
  BRAND_SECONDARY: '#10B981',
  WARNING: '#FACC15',
  ERROR: '#EF4444',
  SUCCESS: '#10B981',
} as const;

// Font configuration
export const FONTS = {
  PRIMARY: '"Inter", system-ui, sans-serif',
  MONO: '"JetBrains Mono", "Consolas", monospace',
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  BASE_URL:
    (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080',
  CHAT: '/api/chat',
  MISSIONS: '/api/missions',
  AGENTS: '/api/agents',
} as const;
