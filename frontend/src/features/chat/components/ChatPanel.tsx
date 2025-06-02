import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { AgentStateIndicator } from './AgentStateIndicator';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  className?: string;
}

export function ChatPanel({ className }: ChatPanelProps) {
  const agentState = useBoundStore(state => state.agentState);

  return (
    <div className={cn('bg-background flex h-full flex-col', className)}>
      {/* Header */}
      <ChatHeader />

      {/* Messages */}
      <MessageList className='flex-1' />

      {/* Agent State Indicator */}
      {agentState !== 'idle' && (
        <div className="px-4 py-2 border-t border-border/50">
          <AgentStateIndicator state={agentState} />
        </div>
      )}

      {/* Input */}
      <MessageInput />
    </div>
  );
}
