import { useCallback, useTransition } from 'react';
import { useBoundStore } from '@/store';
import { ANIMATIONS } from '@/lib/constants';
import type { MissionSectionData } from '@/features/canvas/types';

/**
 * Hook for progressive canvas loading with staggered animations
 * Provides functionality to load canvas sections progressively with delays
 */
export function useProgressiveCanvasLoading() {
  const addSection = useBoundStore(state => state.addSection);
  const setMissionTitle = useBoundStore(state => state.setMissionTitle);
  const [isPending, startTransition] = useTransition();

  /**
   * Start progressive loading of canvas sections with staggered animations
   * @param sections - Array of sections to load progressively
   * @param title - Mission title to set
   */
  const startProgressiveLoading = useCallback((
    sections: Omit<MissionSectionData, 'id'>[],
    title?: string
  ) => {
    // Set mission title first if provided
    if (title) {
      setMissionTitle(title);
    }

    // Load sections progressively with staggered delays
    sections.forEach((section, index) => {
      setTimeout(() => {
        startTransition(() => {
          addSection(section);
        });
      }, index * ANIMATIONS.SECTION_STAGGER_DELAY);
    });
  }, [addSection, setMissionTitle]);

  /**
   * Load a single section with optional delay
   * @param section - Section to add
   * @param delay - Optional delay in milliseconds
   */
  const loadSection = useCallback((
    section: Omit<MissionSectionData, 'id'>,
    delay = 0
  ) => {
    setTimeout(() => {
      startTransition(() => {
        addSection(section);
      });
    }, delay);
  }, [addSection]);

  return {
    startProgressiveLoading,
    loadSection,
    isPending
  };
}
