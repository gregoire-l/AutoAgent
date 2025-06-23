import React from 'react';
import type { ChatMessage } from '@/types/mission';
import { useMissionStore } from '@/lib/store';

interface ChatPanelProps {
  className?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ className = '' }) => {
  const { currentMission } = useMissionStore();
  
  if (!currentMission) return null;

  return (
    <div className={`chat-panel ${className}`}>
      <div className="chat-header">Dialogue Mission</div>
      <div className="chat-messages">
        {currentMission.chatMessages.map((message) => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
      </div>
      <div className="chat-input-area">
        <input 
          type="text" 
          placeholder="Votre réponse..." 
          className="chat-input-field"
        />
      </div>
    </div>
  );
};

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'agent-message'}`}>
      {isUser ? (
        <div className="message-content-wrapper">
          <span className="user-prefix">&gt;</span>
          <span className="message-text" dangerouslySetInnerHTML={{ __html: message.content }} />
        </div>
      ) : (
        <span className="message-text" dangerouslySetInnerHTML={{ __html: message.content }} />
      )}
    </div>
  );
};

export default ChatPanel;
