import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MissionSection } from './MissionSection';
import type { MissionSectionData } from '../types';

// Mock the store
const mockStore = {
  updateSectionContent: vi.fn(),
  updateSectionStatus: vi.fn(),
  selectOption: vi.fn(),
  addUserInteraction: vi.fn(),
  highlightedSections: [],
};

vi.mock('@/store', () => ({
  useBoundStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector(mockStore);
    }
    return mockStore;
  }),
}));

describe('MissionSection Interactive Elements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSection: MissionSectionData = {
    id: 'livrable-cle',
    title: 'Livrable Clé',
    status: 'suggestion_pending',
    content: '',
    isEditable: false,
    options: [],
  };

  it('renders interactive buttons for Livrable Clé section with suggestion_pending status', () => {
    render(<MissionSection section={mockSection} />);
    
    expect(screen.getByText('Tableau Comparatif')).toBeInTheDocument();
    expect(screen.getByText('Simple Liste des Options')).toBeInTheDocument();
  });

  it('handles button click and records user interaction', () => {
    render(<MissionSection section={mockSection} />);
    
    const tableauButton = screen.getByText('Tableau Comparatif');
    fireEvent.click(tableauButton);
    
    expect(mockStore.updateSectionStatus).toHaveBeenCalledWith('livrable-cle', 'confirmed');
    expect(mockStore.addUserInteraction).toHaveBeenCalledWith({
      type: 'button_click',
      content: 'Selected "Tableau Comparatif" for Livrable Clé',
      sectionId: 'livrable-cle',
      optionId: 'table',
    });
  });

  it('provides visual feedback for selected button', () => {
    render(<MissionSection section={mockSection} />);
    
    const tableauButton = screen.getByText('Tableau Comparatif');
    fireEvent.click(tableauButton);
    
    // After click, the button should have default variant (selected state)
    expect(tableauButton.closest('button')).toHaveClass('bg-primary');
  });

  it('handles radio group selection and records user interaction', () => {
    const sectionWithOptions: MissionSectionData = {
      id: 'critere-succes',
      title: 'Critère de Succès Principal',
      status: 'to_define',
      content: '',
      isEditable: false,
      options: [
        { id: 'prix', label: 'Prix le plus bas', value: 'prix', selected: false },
        { id: 'temps', label: 'Temps de trajet minimal', value: 'temps', selected: false },
      ],
    };

    render(<MissionSection section={sectionWithOptions} />);
    
    const prixOption = screen.getByLabelText('Prix le plus bas');
    fireEvent.click(prixOption);
    
    expect(mockStore.selectOption).toHaveBeenCalledWith('critere-succes', 'prix');
    expect(mockStore.updateSectionStatus).toHaveBeenCalledWith('critere-succes', 'confirmed');
    expect(mockStore.addUserInteraction).toHaveBeenCalledWith({
      type: 'radio_select',
      content: 'Selected "Prix le plus bas" for Critère de Succès Principal',
      sectionId: 'critere-succes',
      optionId: 'prix',
    });
  });

  it('does not render buttons for non-Livrable Clé sections', () => {
    const otherSection: MissionSectionData = {
      id: 'objectif',
      title: 'Objectif',
      status: 'suggestion_pending',
      content: '',
      isEditable: true,
      options: [],
    };

    render(<MissionSection section={otherSection} />);
    
    expect(screen.queryByText('Tableau Comparatif')).not.toBeInTheDocument();
    expect(screen.queryByText('Simple Liste des Options')).not.toBeInTheDocument();
  });

  it('does not render buttons when status is not suggestion_pending', () => {
    const confirmedSection: MissionSectionData = {
      ...mockSection,
      status: 'confirmed',
    };

    render(<MissionSection section={confirmedSection} />);
    
    expect(screen.queryByText('Tableau Comparatif')).not.toBeInTheDocument();
    expect(screen.queryByText('Simple Liste des Options')).not.toBeInTheDocument();
  });
});
