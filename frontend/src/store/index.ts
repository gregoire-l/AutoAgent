import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatSlice } from '@/features/chat/store/chatSlice';
import { createChatSlice } from '@/features/chat/store/chatSlice';
import type { CanvasSlice } from '@/features/canvas/store/canvasSlice';
import { createCanvasSlice } from '@/features/canvas/store/canvasSlice';

// Combined store type
export type BoundStore = ChatSlice & CanvasSlice;

// Create the combined store with devtools
export const useBoundStore = create<BoundStore>()(
  devtools(
    (...args) => ({
      ...createChatSlice(...args),
      ...createCanvasSlice(...args),
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

// Export types for external use
export type { ChatSlice, CanvasSlice };
