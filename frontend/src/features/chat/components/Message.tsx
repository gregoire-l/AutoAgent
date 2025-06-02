import { cn } from '@/lib/utils';
import type { MessageData } from '../types'
import { ProgressiveText } from '@/components/ui/progressive-text'
import { getChatMessageConfidence } from '@/lib/confidence-utils'
import { TextAnimate } from '@/components/magicui/text-animate'

interface MessageProps {
  message: MessageData;
  messageIndex?: number;
  className?: string;
}

interface MessageContentProps {
  message: MessageData;
  messageIndex?: number;
}

function MessageContent({ message, messageIndex = 0 }: MessageContentProps) {
  if (message.role === 'assistant') {
    return (
      <ProgressiveText
        confidence={getChatMessageConfidence(message.role, message.content, messageIndex)}
        animation="blurInUp"
        by="word"
        delay={0.2}
        className="text-sm whitespace-pre-wrap break-words"
        startOnView={false}
      >
        {message.content}
      </ProgressiveText>
    );
  }

  return (
    <div className="text-sm">
      <TextAnimate animation="fadeIn" className="whitespace-pre-wrap break-words" startOnView={false}>
        {message.content}
      </TextAnimate>
    </div>
  );
}

export function Message({ message, messageIndex = 0, className }: MessageProps) {
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
              : 'bg-muted'
          )}
        >
          <MessageContent message={message} messageIndex={messageIndex} />
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
