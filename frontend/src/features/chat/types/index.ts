// Chat types and interfaces
// Define all chat-related types here

export interface MessageData {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatState {
  messages: MessageData[];
  isTyping: boolean;
  composerInput: string;
  isConnected: boolean;
}

export interface AgentResponse {
  content: string;
  suggestions?: string[];
  canvasUpdates?: unknown[]; // Will be refined later
}

// Chat events
export type ChatEvent =
  | { type: 'message_sent'; payload: MessageData }
  | { type: 'message_received'; payload: MessageData }
  | { type: 'typing_start' }
  | { type: 'typing_stop' }
  | { type: 'connection_status'; payload: boolean };
