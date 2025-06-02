import { PulsatingButton } from '@/components/ui/pulsating-button';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { ANIMATIONS, COLORS } from '@/lib/constants';

export type AgentState = 'thinking' | 'analyzing' | 'typing' | 'idle';

interface AgentStateIndicatorProps {
  state: AgentState;
  className?: string;
}

/**
 * Sophisticated agent state indicator with Magic UI animations
 * Shows different visual states during agent processing
 */
export function AgentStateIndicator({ state, className }: AgentStateIndicatorProps) {
  switch (state) {
    case 'thinking':
      return (
        <PulsatingButton
          pulseColor={COLORS.BRAND_PRIMARY}
          duration={`${ANIMATIONS.PULSATING_DURATION}ms`}
          className={`text-sm font-medium text-primary-foreground bg-primary/90 ${className}`}
          disabled
        >
          <span className="flex items-center gap-2">
            🤔 <span>Réflexion...</span>
          </span>
        </PulsatingButton>
      );

    case 'analyzing':
      return (
        <ShimmerButton
          shimmerColor="#ffffff"
          shimmerDuration={`${ANIMATIONS.SHIMMER_DURATION}ms`}
          background={COLORS.BRAND_SECONDARY}
          className={`text-sm font-medium text-white ${className}`}
          disabled
        >
          <span className="flex items-center gap-2">
            🔍 <span>Analyse...</span>
          </span>
        </ShimmerButton>
      );

    case 'typing':
      return (
        <div className={`flex items-center gap-2 text-sm font-medium text-muted-foreground ${className}`}>
          <span>✍️</span>
          <TypingAnimation
            duration={ANIMATIONS.TYPING_CHARACTER_DELAY}
            className="text-sm font-medium"
          >
            Rédaction...
          </TypingAnimation>
        </div>
      );

    case 'idle':
    default:
      return null;
  }
}
