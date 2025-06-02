import { cn } from '@/lib/utils';
import type { MessageData } from '../types';

interface MessageProps {
  message: MessageData;
  className?: string;
}

export function Message({ message, className }: MessageProps) {
  const isUser = message.role === 'user';

  const getStatusColor = (status: MessageData['status']) => {
    switch (status) {
      case 'sending':
        return 'bg-yellow-500';
      case 'sent':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  return (
    <div
      className={cn('flex gap-3 p-4', isUser && 'flex-row-reverse', className)}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {isUser ? 'U' : 'A'}
      </div>

      {/* Message Content */}
      <div
        className={cn('flex max-w-[80%] flex-col gap-1', isUser && 'items-end')}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-lg px-3 py-2 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <p className='break-words whitespace-pre-wrap'>{message.content}</p>
        </div>

        {/* Message Meta */}
        <div
          className={cn(
            'text-muted-foreground flex items-center gap-2 text-xs',
            isUser && 'flex-row-reverse'
          )}
        >
          <span>{formatTime(message.timestamp)}</span>

          {/* Status Indicator */}
          {message.status && (
            <div className='flex items-center gap-1'>
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  getStatusColor(message.status)
                )}
              />
              <span className='capitalize'>{message.status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
