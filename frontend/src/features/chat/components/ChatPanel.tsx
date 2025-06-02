import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  className?: string;
}

export function ChatPanel({ className }: ChatPanelProps) {
  return (
    <div className={cn('bg-background flex h-full flex-col', className)}>
      {/* Header */}
      <ChatHeader />

      {/* Messages */}
      <MessageList className='flex-1' />

      {/* Input */}
      <MessageInput />
    </div>
  );
}
