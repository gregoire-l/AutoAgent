import React from 'react';
import { useMissionStore } from '@/lib/store';
import ConstraintItem from './ConstraintItem';
import SuccessCriteriaItem from './SuccessCriteriaItem';
import DeliverableSection from './DeliverableSection';
import MilestonesSection from './MilestonesSection';

interface CanvasPanelProps {
  className?: string;
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({ className = '' }) => {
  const { currentMission, updateMissionStatus } = useMissionStore();
  
  if (!currentMission) return null;

  const handleCriteriaConfirm = (criteriaId: string) => {
    updateMissionStatus(criteriaId, 'confirmed');
  };

  return (
    <div className={`canvas-container ${className}`}>
      <div className="canvas-panel">
        {/* Mission Header */}
        <div className="mission-title">{currentMission.title}</div>
        <div className="mission-objective">
          {currentMission.objective}
        </div>

        {/* Constraints Section */}
        <div className="section status-in-discussion">
          <div className="main-margin-bar">
            <div className="main-margin-bar-line h-full"></div>
          </div>
          <div className="section-title">Contraintes</div>
          <div className="space-y-0">
            {currentMission.constraints.map((constraint) => (
              <ConstraintItem 
                key={constraint.id} 
                constraint={constraint} 
              />
            ))}
          </div>
        </div>

        {/* Success Criteria Section */}
        <div className="section status-in-discussion">
          <div className="main-margin-bar">
            <div className="main-margin-bar-line h-full"></div>
          </div>
          <div className="section-title">Critères de Succès</div>
          <ul className="criteria-list">
            {currentMission.successCriteria.map((criteria) => (
              <SuccessCriteriaItem 
                key={criteria.id} 
                criteria={criteria}
                onConfirm={handleCriteriaConfirm}
              />
            ))}
          </ul>
        </div>

        {/* Key Deliverable Section */}
        <DeliverableSection deliverable={currentMission.deliverable} />

        {/* Review Milestones Section */}
        <MilestonesSection milestones={currentMission.milestones} />
      </div>
    </div>
  );
};

export default CanvasPanel;
