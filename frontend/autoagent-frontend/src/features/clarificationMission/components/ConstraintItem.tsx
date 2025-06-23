import React from 'react';
import type { Constraint } from '@/types/mission';
import { DynamicIcon, CheckIcon, type IconName } from '@/components/icons/HeroIcons';

interface ConstraintItemProps {
  constraint: Constraint;
}

const ConstraintItem: React.FC<ConstraintItemProps> = ({ constraint }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'item-confirmed';
      case 'in-discussion': return 'item-in-discussion';
      case 'suggestion': return 'item-suggested';
      default: return 'item-unaddressed';
    }
  };

  const getIconClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'icon-default';
      case 'in-discussion': return 'icon-status-discussion';
      case 'suggestion': return 'icon-status-discussion';
      default: return 'icon-default';
    }
  };

  return (
    <div className={`constraint-item ${getStatusClass(constraint.status)}`}>
      <div className="constraint-icon-wrapper">
        <DynamicIcon
          name={constraint.icon as IconName}
          className={`heroicon ${getIconClass(constraint.status)}`}
        />
      </div>
      <div className="constraint-content">
        <div className="constraint-main-line">
          <span className="constraint-label">{constraint.label}</span>
          <div className="constraint-value-wrapper">
            <span className="constraint-value">{constraint.value}</span>
            {constraint.tag && (
              <span className="constraint-tag">{constraint.tag}</span>
            )}
          </div>
          {constraint.status === 'confirmed' && (
            <div className="status-indicator">
              <CheckIcon className="heroicon icon-status-confirmed" />
            </div>
          )}
        </div>
        {constraint.secondaryDetails && constraint.secondaryDetails.length > 0 && (
          <div className="constraint-secondary-details">
            {constraint.secondaryDetails.map((detail, index) => (
              <div key={index}>{detail}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstraintItem;
