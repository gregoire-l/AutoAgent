import { useState, useRef, type KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { GlowButton } from '@/components/ui/glow-button';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { useAnimationPerformance } from '@/hooks/useAnimationPerformance';
import { OPTIMIZED_VARIANTS } from '@/lib/animation-utils';

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
  // Use global composerInput state instead of local state
  const input = useBoundStore(state => state.composerInput);
  const setInput = useBoundStore(state => state.setComposerInput);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addMessage = useBoundStore(state => state.addMessage);
  const connectionStatus = useBoundStore(state => state.isConnected);
  const preloadedMessage = useBoundStore(state => state.preloadedMessage);
  const applyPreloadedMessage = useBoundStore(state => state.usePreloadedMessage);

  // Performance optimization hooks
  const { optimizedRef, onAnimationStart, onAnimationComplete } = useAnimationPerformance({
    enableHardwareAcceleration: true,
    monitorPerformance: false, // Disable in production
  });

  // Optimized animation variants
  const containerVariants = useOptimizedAnimation({
    ...OPTIMIZED_VARIANTS.slideUp,
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  });

  const inputContainerVariants = useOptimizedAnimation({
    ...OPTIMIZED_VARIANTS.hover,
    whileHover: { scale: 1.01 },
  });

  const focusVariants = useOptimizedAnimation({
    whileFocus: { scale: 1.02 },
  });

  // Clarification mode detection and actions
  const isInClarificationMode = useBoundStore(state => state.isActive);
  const addUserInteraction = useBoundStore(state => state.addUserInteraction);

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

    if (isInClarificationMode) {
      // Route through clarification flow system
      addUserInteraction({
        type: 'message',
        content: trimmedInput,
      });

      // Don't simulate agent response - let clarification flow handle it
      return;
    }

    // Normal message flow for non-clarification mode
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
    <motion.div
      ref={optimizedRef}
      className={cn('border-border border-t p-4 optimized-animation', className)}
      {...containerVariants}
      onAnimationStart={() => onAnimationStart('MessageInput')}
      onAnimationComplete={() => onAnimationComplete('MessageInput')}
    >
      {/* Preloaded message indicator */}
      {preloadedMessage && (
        <motion.div
          className="mb-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-600 dark:text-blue-400">
              Message préchargé: {preloadedMessage.substring(0, 50)}...
            </span>
            <motion.button
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              onClick={() => applyPreloadedMessage()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Utiliser
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className='flex items-end gap-2'>
        <motion.div
          className='flex-1 optimized-animation'
          {...inputContainerVariants}
        >
          <motion.div
            className="relative optimized-animation"
            {...focusVariants}
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isDisabled}
              className={cn(
                'max-h-[120px] min-h-[40px] resize-none transition-all duration-200',
                'hover:border-muted-foreground/50 focus:shadow-lg',
                input.length > 0 && 'border-primary/50'
              )}
              rows={1}
            />

            {/* Glow effect when focused */}
            <motion.div
              className="absolute inset-0 rounded-md opacity-0 pointer-events-none"
              style={{
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
              }}
              animate={{
                opacity: input.length > 0 ? 0.5 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>

        <GlowButton
          onClick={() => void handleSubmit()}
          disabled={!canSend}
          size="md"
          className={cn(
            'h-10 w-10 flex-shrink-0 p-0',
            canSend && 'animate-micro-pulse'
          )}
          glowColor={canSend ? '#10B981' : '#6B7280'}
          glowIntensity={canSend ? 'medium' : 'low'}
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <Send className='h-4 w-4' />
            </motion.div>
          )}
        </GlowButton>
      </div>

      {!connectionStatus && (
        <motion.p
          className='mt-2 text-xs text-red-500'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Connexion perdue - Reconnexion en cours...
        </motion.p>
      )}
    </motion.div>
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
