import { cn } from '@/lib/utils';
import type { MessageData } from '../types'
import { TypingAnimation } from '@/components/ui/typing-animation'
import { TextAnimate } from '@/components/magicui/text-animate'
import { ANIMATIONS } from '@/lib/constants';

interface MessageProps {
  message: MessageData;
  className?: string;
}

interface MessageContentProps {
  message: MessageData
}

function MessageContent({ message }: MessageContentProps) {
  if (message.role === 'assistant') {
    return (
      <TypingAnimation
        duration={ANIMATIONS.TYPING_CHARACTER_DELAY}
        className="text-sm whitespace-pre-wrap break-words"
        as="p"
      >
        {message.content}
      </TypingAnimation>
    );
  }

  return (
    <TextAnimate animation="fadeIn" className="text-sm">
      <p className="whitespace-pre-wrap break-words">
        {message.content}
      </p>
    </TextAnimate>
  );
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
            'rounded-lg px-3 py-2',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <MessageContent message={message} />
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
