import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  className?: string;
}

export function ChatHeader({ className }: ChatHeaderProps) {
  const connectionStatus = useBoundStore(state => state.isConnected);
  const messages = useBoundStore(state => state.messages);
  const clearMessages = useBoundStore(state => state.clearMessages);

  const handleClearChat = () => {
    if (
      window.confirm('Êtes-vous sûr de vouloir effacer toute la conversation ?')
    ) {
      clearMessages();
    }
  };

  return (
    <div
      className={cn(
        'border-border bg-background flex items-center justify-between border-b p-4',
        className
      )}
    >
      {/* Agent Info */}
      <div className='flex items-center gap-3'>
        <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium'>
          AI
        </div>

        <div className='flex flex-col'>
          <h3 className='text-sm font-medium'>Agent Orchestrateur</h3>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  connectionStatus ? 'bg-green-500' : 'bg-red-500'
                )}
              />
              <span className='text-muted-foreground text-xs'>
                {connectionStatus ? 'En ligne' : 'Hors ligne'}
              </span>
            </div>
            <span className='text-muted-foreground text-xs'>•</span>
            <span className='text-muted-foreground text-xs'>
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700'
        onClick={handleClearChat}
        disabled={messages.length === 0}
        title='Effacer la conversation'
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}
