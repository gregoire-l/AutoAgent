import React from 'react';
import type { DeliverableSection as DeliverableSectionType } from '@/types/mission';
import { DynamicIcon, type IconName } from '@/components/icons/HeroIcons';
import { useMissionStore } from '@/lib/store';

interface DeliverableSectionProps {
  deliverable: DeliverableSectionType;
}

const DeliverableSection: React.FC<DeliverableSectionProps> = ({ deliverable }) => {
  const { selectSuggestion } = useMissionStore();

  const handleSuggestionClick = (suggestionId: string) => {
    selectSuggestion(suggestionId);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'suggestion': return 'status-suggestion';
      default: return 'status-unaddressed';
    }
  };

  return (
    <div className={`section ${getStatusClass(deliverable.status)}`}>
      <div className="main-margin-bar">
        <div className="main-margin-bar-line h-full"></div>
      </div>
      <div className="section-title">{deliverable.title}</div>
      <div className="suggestion-capsule">
        <div className="suggestion-capsule-header">
          <div className="suggestion-capsule-icon">
            <DynamicIcon
              name={deliverable.icon as IconName}
              className="heroicon"
            />
          </div>
          <span className="suggestion-capsule-title">{deliverable.title}</span>
        </div>
        <div className="suggestion-capsule-value">{deliverable.value}</div>
        {deliverable.suggestions && (
          <div className="space-y-2">
            {deliverable.suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`suggestion-option ${suggestion.selected ? 'suggestion-option--selected' : ''}`}
                onClick={() => handleSuggestionClick(suggestion.id)}
              >
                {suggestion.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliverableSection;
