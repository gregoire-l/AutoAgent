import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';

interface MessageListProps {
  className?: string;
}

export function MessageList({ className }: MessageListProps) {
  const messages = useBoundStore(state => state.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div
        className={cn('flex flex-1 items-center justify-center p-8', className)}
      >
        <div className='space-y-2 text-center'>
          <div className='text-2xl'>💬</div>
          <p className='text-muted-foreground'>Aucun message pour le moment</p>
          <p className='text-muted-foreground text-sm'>
            Commencez la conversation en tapant un message ci-dessous
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('custom-scrollbar flex-1 overflow-y-auto', className)}>
      <div className='space-y-1'>
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
