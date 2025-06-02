import { useState, useRef, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({
  className,
  placeholder = 'Précisez vos contraintes, budget, dates...',
  disabled = false,
}: MessageInputProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addMessage = useBoundStore(state => state.addMessage);
  const connectionStatus = useBoundStore(state => state.isConnected);

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || disabled) return;

    // Add user message
    const userMessage: import('../types').MessageData = {
      id: `user-${Date.now()}`,
      content: trimmedInput,
      role: 'user' as const,
      timestamp: new Date(),
      status: 'sent' as const,
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // Simulate agent response (replace with real API call)
    try {
      await new Promise(resolve =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      const agentMessage: import('../types').MessageData = {
        id: `agent-${Date.now()}`,
        content: generateAgentResponse(trimmedInput),
        role: 'assistant' as const,
        timestamp: new Date(),
        status: 'sent' as const,
      };

      addMessage(agentMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      // Could add error handling here
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setTimeout(adjustTextareaHeight, 0);
  };

  const isDisabled = disabled || !connectionStatus || isLoading;
  const canSend = input.trim().length > 0 && !isDisabled;

  return (
    <div className={cn('border-border border-t p-4', className)}>
      <div className='flex items-end gap-2'>
        <div className='flex-1'>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled}
            className='max-h-[120px] min-h-[40px] resize-none'
            rows={1}
          />
        </div>

        <Button
          onClick={() => void handleSubmit()}
          disabled={!canSend}
          size='icon'
          className='h-10 w-10 flex-shrink-0'
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Send className='h-4 w-4' />
          )}
        </Button>
      </div>

      {!connectionStatus && (
        <p className='mt-2 text-xs text-red-500'>
          Connexion perdue - Reconnexion en cours...
        </p>
      )}
    </div>
  );
}

// Simulate agent responses (replace with real agent logic)
function generateAgentResponse(_userInput: string): string {
  const responses = [
    'Je comprends votre demande. Laissez-moi analyser les informations pour votre voyage Lyon-Paris.',
    "Parfait ! Pour mieux vous aider, j'ai besoin de quelques précisions sur vos contraintes.",
    'Excellente question ! Je vais mettre à jour les sections de mission en conséquence.',
    "D'accord, je note cette information. Cela va m'aider à affiner les recommandations.",
    'Merci pour ces détails. Je vais maintenant rechercher les meilleures options pour vous.',
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
