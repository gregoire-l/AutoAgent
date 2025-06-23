import React from 'react';
import type { Milestone } from '@/types/mission';
import { CalendarDaysIcon, LightBulbIcon, CheckIcon, ChevronDownIcon } from '@/components/icons/HeroIcons';
import { useUIStore } from '@/lib/store';

interface MilestonesSectionProps {
  milestones: Milestone[];
}

const MilestonesSection: React.FC<MilestonesSectionProps> = ({ milestones }) => {
  const { expandedMilestones, toggleMilestone } = useUIStore();

  const handleTimelineNodeClick = (milestoneId: string) => {
    // Close other milestones and toggle current one
    milestones.forEach(milestone => {
      if (milestone.id !== milestoneId && expandedMilestones.has(milestone.id)) {
        toggleMilestone(milestone.id);
      }
    });
    toggleMilestone(milestoneId);
  };

  const handleAccordionToggle = (milestoneId: string) => {
    toggleMilestone(milestoneId);
  };

  return (
    <div className="section status-unaddressed">
      <div className="section-title">Jalons de Revue</div>

      <div className="timeline-horizontal">
        {/* Timeline Track */}
        <div className="timeline-track-container">
          <span className="timeline-track-label">Début</span>
          <div className="timeline-track">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="timeline-node"
                style={{ left: `${milestone.position}%` }}
                onClick={() => handleTimelineNodeClick(milestone.id)}
              >
                {milestone.number}
              </div>
            ))}
          </div>
          <span className="timeline-track-label">Fin</span>
        </div>

        {/* Milestone Legend */}
        <div className="space-y-0">
          {milestones.map((milestone) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              isExpanded={expandedMilestones.has(milestone.id)}
              onToggle={() => handleAccordionToggle(milestone.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface MilestoneItemProps {
  milestone: Milestone;
  isExpanded: boolean;
  onToggle: () => void;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({ 
  milestone, 
  isExpanded, 
  onToggle 
}) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'item-confirmed';
      case 'suggestion': return 'item-suggested';
      default: return 'item-unaddressed';
    }
  };

  return (
    <div className={`milestone-legend-item accordion-item ${getStatusClass(milestone.status)} ${isExpanded ? 'accordion-item--open' : ''}`}>
      <div className="milestone-header" onClick={onToggle}>
        <span className="milestone-number">{milestone.number}.</span>
        <div className="milestone-state-icon-wrapper">
          {milestone.status === 'suggestion' && (
            <span className="status-indicator status-indicator--suggested status-indicator--inline">
              <LightBulbIcon className="heroicon icon-status-discussion" />
            </span>
          )}
          {milestone.status === 'confirmed' && (
            <span className="status-indicator status-indicator--confirmed status-indicator--inline">
              <CheckIcon className="heroicon icon-status-confirmed-alt" />
            </span>
          )}
        </div>
        <div className="milestone-title-container">
          <span className="milestone-title">{milestone.title}</span>
        </div>
        <div className="accordion-icon">
          <ChevronDownIcon className="heroicon" />
        </div>
      </div>
      <div className="milestone-when-info">
        <CalendarDaysIcon className="heroicon heroicon--sm icon-text-faded" />
        <span>Quand : {milestone.when}</span>
      </div>
      {isExpanded && (
        <div className="accordion-content">
          <ul className="milestone-checkpoints">
            {milestone.checkpoints.map((checkpoint, index) => (
              <li key={index} className="checkpoint-item">{checkpoint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MilestonesSection;
