import { useCallback } from 'react';
import { useBoundStore } from '@/store';
import type { MissionStatus } from '../types';

/**
 * Hook for managing canvas interactions and business logic
 */
export function useCanvasInteractions() {
  const sections = useBoundStore(state => state.sections);
  const selectedSectionId = useBoundStore(state => state.selectedSectionId);
  const updateSectionStatus = useBoundStore(state => state.updateSectionStatus);
  const updateSectionContent = useBoundStore(
    state => state.updateSectionContent
  );
  const selectSection = useBoundStore(state => state.selectSection);
  const clearSelection = useBoundStore(state => state.clearSelection);
  const selectOption = useBoundStore(state => state.selectOption);

  // Get selected section
  const selectedSection = selectedSectionId
    ? sections.find(s => s.id === selectedSectionId)
    : undefined;

  // Calculate progress metrics
  const progressMetrics = useCallback(() => {
    const total = sections.length;
    const confirmed = sections.filter(s => s.status === 'confirmed').length;
    const inProgress = sections.filter(s => s.status === 'in_progress').length;
    const pending = sections.filter(
      s => s.status === 'pending' || s.status === 'to_define'
    ).length;

    return {
      total,
      confirmed,
      inProgress,
      pending,
      percentage: total > 0 ? Math.round((confirmed / total) * 100) : 0,
    };
  }, [sections]);

  // Update section with validation
  const updateSection = useCallback(
    (sectionId: string, content: string, newStatus?: MissionStatus) => {
      updateSectionContent(sectionId, content);

      // Auto-determine status if not provided
      if (!newStatus) {
        const status = content.trim() ? 'confirmed' : 'to_define';
        updateSectionStatus(sectionId, status);
      } else {
        updateSectionStatus(sectionId, newStatus);
      }
    },
    [updateSectionContent, updateSectionStatus]
  );

  // Handle option selection with status update
  const handleOptionSelect = useCallback(
    (sectionId: string, optionId: string) => {
      selectOption(sectionId, optionId);
      updateSectionStatus(sectionId, 'confirmed');
    },
    [selectOption, updateSectionStatus]
  );

  // Toggle section selection
  const toggleSectionSelection = useCallback(
    (sectionId: string) => {
      if (selectedSectionId === sectionId) {
        clearSelection();
      } else {
        selectSection(sectionId);
      }
    },
    [selectedSectionId, selectSection, clearSelection]
  );

  // Check if mission is ready for validation
  const isMissionReady = useCallback(() => {
    const metrics = progressMetrics();
    return metrics.confirmed >= Math.ceil(metrics.total * 0.7); // At least 70% confirmed
  }, [progressMetrics]);

  // Get sections by status
  const getSectionsByStatus = useCallback(
    (status: MissionStatus) => {
      return sections.filter(s => s.status === status);
    },
    [sections]
  );

  // Get next section to work on
  const getNextSection = useCallback(() => {
    return sections.find(
      s => s.status === 'to_define' || s.status === 'pending'
    );
  }, [sections]);

  return {
    // State
    sections,
    selectedSection,
    selectedSectionId,

    // Metrics
    progressMetrics: progressMetrics(),
    isMissionReady: isMissionReady(),

    // Actions
    updateSection,
    handleOptionSelect,
    toggleSectionSelection,
    clearSelection,

    // Utilities
    getSectionsByStatus,
    getNextSection,
  };
}
