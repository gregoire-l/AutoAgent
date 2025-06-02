import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatSlice } from '@/features/chat/store/chatSlice';
import { createChatSlice } from '@/features/chat/store/chatSlice';
import type { CanvasSlice } from '@/features/canvas/store/canvasSlice';
import { createCanvasSlice } from '@/features/canvas/store/canvasSlice';
import type { ClarificationSlice } from '@/features/mission-clarification/store/clarificationSlice';
import { createClarificationSlice } from '@/features/mission-clarification/store/clarificationSlice';

// Combined store type
export type BoundStore = ChatSlice & CanvasSlice & ClarificationSlice;

// Create the combined store with devtools
export const useBoundStore = create<BoundStore>()(
  devtools(
    (...args) => ({
      ...createChatSlice(...args),
      ...createCanvasSlice(...args),
      ...createClarificationSlice(...args),
    }),
    {
      name: 'autoagent-store', // Name for Redux DevTools
    }
  )
);

// Convenience selectors for each slice
export const useChatStore = <T>(selector: (state: ChatSlice) => T) =>
  useBoundStore(selector);

export const useCanvasStore = <T>(selector: (state: CanvasSlice) => T) =>
  useBoundStore(selector);

export const useClarificationStore = <T>(selector: (state: ClarificationSlice) => T) =>
  useBoundStore(selector);

// Export types for external use
export type { ChatSlice, CanvasSlice, ClarificationSlice };
