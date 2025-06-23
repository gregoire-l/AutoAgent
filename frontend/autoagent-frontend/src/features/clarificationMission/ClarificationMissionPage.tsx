import React from 'react';
import ChatPanel from './components/ChatPanel';
import CanvasPanel from './components/CanvasPanel';

const ClarificationMissionPage: React.FC = () => {
  return (
    <div className="main-container">
      <ChatPanel />
      <CanvasPanel />
    </div>
  );
};

export default ClarificationMissionPage;
