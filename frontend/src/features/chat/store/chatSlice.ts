import type { StateCreator } from 'zustand';
import type { ChatState, MessageData, AgentResponse } from '../types';
import { generateId } from '@/lib/helpers';
import { agentSimulator } from '@/lib/agent-simulator';
import { getCurrentDemoData } from '@/lib/demo-data';

// Chat slice interface
export interface ChatSlice extends ChatState {
  // Actions
  sendMessage: (content: string) => Promise<void>;
  receiveMessage: (response: AgentResponse) => void;
  setComposerInput: (input: string) => void;
  setTyping: (isTyping: boolean) => void;
  setConnectionStatus: (isConnected: boolean) => void;
  clearMessages: () => void;
  addMessage: (message: MessageData) => void;
  initializeDemoData: () => void;
}

// Chat slice creator
export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (
  set
) => ({
  // Initial state
  messages: [],
  isTyping: false,
  composerInput: '',
  isConnected: true,

  // Actions
  sendMessage: async (content: string) => {
    const userMessage: MessageData = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message
    set(state => ({
      messages: [...state.messages, userMessage],
      composerInput: '',
    }));

    // Simulate agent typing
    set({ isTyping: true });

    try {
      // Generate intelligent agent response
      const { message: agentMessage, canvasUpdates } =
        await agentSimulator.generateResponse(content);

      // Add agent message
      set(state => ({
        messages: [...state.messages, agentMessage],
        isTyping: false,
      }));

      // Handle canvas updates if provided
      if (canvasUpdates && canvasUpdates.length > 0) {
        // This will trigger canvas updates
        console.log('Canvas updates triggered:', canvasUpdates);
      }
    } catch (error) {
      console.error('Error generating agent response:', error);

      // Fallback response
      const fallbackMessage: MessageData = {
        id: generateId(),
        content:
          "Désolé, j'ai rencontré un problème. Pouvez-vous reformuler votre demande ?",
        role: 'assistant',
        timestamp: new Date(),
      };

      set(state => ({
        messages: [...state.messages, fallbackMessage],
        isTyping: false,
      }));
    }
  },

  receiveMessage: (response: AgentResponse) => {
    const agentMessage: MessageData = {
      id: generateId(),
      content: response.content,
      role: 'assistant',
      timestamp: new Date(),
    };

    set(state => ({
      messages: [...state.messages, agentMessage],
      isTyping: false,
    }));

    // Handle canvas updates if provided
    if (response.canvasUpdates) {
      console.log('Canvas updates:', response.canvasUpdates);
    }
  },

  setComposerInput: (input: string) => {
    set({ composerInput: input });
  },

  setTyping: (isTyping: boolean) => {
    set({ isTyping });
  },

  setConnectionStatus: (isConnected: boolean) => {
    set({ isConnected });
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  addMessage: (message: MessageData) => {
    set(state => ({
      messages: [...state.messages, message],
    }));
  },

  // Initialize with demo data
  initializeDemoData: () => {
    const demoData = getCurrentDemoData();
    set({
      messages: demoData.conversation,
      isConnected: true,
      isTyping: false,
      composerInput: '',
    });
  },
});
