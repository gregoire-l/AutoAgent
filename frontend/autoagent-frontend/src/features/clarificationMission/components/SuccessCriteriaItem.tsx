import React from 'react';
import type { SuccessCriteria } from '@/types/mission';
import { LightBulbIcon, CheckIcon } from '@/components/icons/HeroIcons';

interface SuccessCriteriaItemProps {
  criteria: SuccessCriteria;
  onConfirm?: (criteriaId: string) => void;
}

const SuccessCriteriaItem: React.FC<SuccessCriteriaItemProps> = ({ 
  criteria, 
  onConfirm 
}) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'imperative': return 'priority-imperative';
      case 'essential': return 'priority-essential';
      case 'appreciable': return 'priority-appreciable';
      case 'optional': return 'priority-optional';
      default: return 'priority-optional';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'imperative': return 'I';
      case 'essential': return 'E';
      case 'appreciable': return 'A';
      case 'optional': return 'O';
      default: return 'O';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'item-confirmed';
      case 'suggestion': return 'item-suggested';
      default: return 'item-unaddressed';
    }
  };

  const handleClick = () => {
    if (criteria.isSuggested && onConfirm) {
      onConfirm(criteria.id);
    }
  };

  return (
    <li 
      className={`criteria-item ${getStatusClass(criteria.status)} ${getPriorityClass(criteria.priority)}`}
      onClick={handleClick}
      style={{ cursor: criteria.isSuggested ? 'pointer' : 'default' }}
    >
      <div className="criteria-item-prefix">
        {criteria.isSuggested && (
          <LightBulbIcon className="suggestion-indicator-icon heroicon icon-status-discussion" />
        )}
        <div className={`priority-badge priority-badge--${criteria.priority}`}>
          {getPriorityLabel(criteria.priority)}
        </div>
      </div>
      <span className="criteria-item-text">{criteria.text}</span>
      {criteria.status === 'confirmed' && (
        <div className="criteria-item-status-icon">
          <CheckIcon className="heroicon icon-status-confirmed" />
        </div>
      )}
    </li>
  );
};

export default SuccessCriteriaItem;
