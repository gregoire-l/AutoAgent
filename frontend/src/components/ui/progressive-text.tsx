"use client";

import { motion, MotionProps } from 'motion/react';
import { ElementType, memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TextAnimate } from '@/components/magicui/text-animate';
import { getColorFromConfidence, getMissionClarificationConfidence } from '@/lib/confidence-utils';
import { ANIMATIONS } from '@/lib/constants';

interface ProgressiveTextProps extends Omit<MotionProps, 'children'> {
  /**
   * The text content to display with progressive coloring
   */
  children: string;
  /**
   * Manual confidence override (0-1). If not provided, will be calculated from text
   */
  confidence?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Element type to render
   */
  as?: ElementType;
  /**
   * TextAnimate animation type
   */
  animation?: "fadeIn" | "blurIn" | "blurInUp" | "blurInDown" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleUp" | "scaleDown";
  /**
   * How to split text for animation
   */
  by?: "text" | "word" | "character" | "line";
  /**
   * Animation delay
   */
  delay?: number;
  /**
   * Whether to start animation on view
   */
  startOnView?: boolean;
  /**
   * Whether to animate only once
   */
  once?: boolean;
  /**
   * Whether to show confidence indicator
   */
  showConfidenceIndicator?: boolean;
}

const ProgressiveTextBase = ({
  children,
  confidence: manualConfidence,
  className,
  as: Component = "p",
  animation = "fadeIn",
  by = "word",
  delay = 0,
  startOnView = true,
  once = false,
  showConfidenceIndicator = false,
  ...motionProps
}: ProgressiveTextProps) => {
  const [currentConfidence, setCurrentConfidence] = useState(0);
  
  // Calculate or use provided confidence
  const targetConfidence = manualConfidence ?? getMissionClarificationConfidence(children, 'initial');
  
  // Animate confidence change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentConfidence(targetConfidence);
    }, (delay || 0) * 1000);

    return () => clearTimeout(timer);
  }, [targetConfidence, delay]);
  
  // Get color from current confidence
  const textColor = getColorFromConfidence(currentConfidence);
  
  return (
    <motion.div
      className={cn("relative", className)}
      {...motionProps}
    >
      {/* Main text with progressive color */}
      <motion.div
        animate={{ color: textColor }}
        transition={{
          duration: ANIMATIONS.CONFIDENCE_COLOR_TRANSITION / 1000,
          ease: 'easeInOut'
        }}
      >
        <TextAnimate
          animation={animation}
          by={by}
          as={Component}
          delay={delay}
          startOnView={startOnView}
          once={once}
          className="transition-colors duration-1200"
        >
          {children}
        </TextAnimate>
      </motion.div>
      
      {/* Optional confidence indicator */}
      {showConfidenceIndicator && (
        <motion.div
          className="mt-2 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.5, duration: 0.4 }}
        >
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: textColor }}
              initial={{ width: 0 }}
              animate={{ width: `${currentConfidence * 100}%` }}
              transition={{
                duration: ANIMATIONS.CONFIDENCE_COLOR_TRANSITION / 1000,
                ease: 'easeOut'
              }}
            />
          </div>
          <motion.span
            className="text-xs font-medium"
            animate={{ color: textColor }}
            transition={{
              duration: ANIMATIONS.CONFIDENCE_COLOR_TRANSITION / 1000,
              ease: 'easeInOut'
            }}
          >
            {Math.round(currentConfidence * 100)}%
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * ProgressiveText component that changes color based on confidence level
 * Integrates with TextAnimate for sophisticated text animations
 */
export const ProgressiveText = memo(ProgressiveTextBase);

/**
 * Simple confidence indicator bar component
 */
interface ConfidenceIndicatorProps {
  confidence: number;
  className?: string;
  showPercentage?: boolean;
}

export const ConfidenceIndicator = memo(({ 
  confidence, 
  className,
  showPercentage = true 
}: ConfidenceIndicatorProps) => {
  const color = getColorFromConfidence(confidence);
  
  return (
    <motion.div
      className={cn("flex items-center gap-2", className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${confidence * 100}%` }}
          transition={{
            duration: ANIMATIONS.CONFIDENCE_COLOR_TRANSITION / 1000,
            ease: 'easeOut'
          }}
        />
      </div>
      {showPercentage && (
        <motion.span
          className="text-sm font-medium min-w-[3rem] text-right"
          animate={{ color }}
          transition={{
            duration: ANIMATIONS.CONFIDENCE_COLOR_TRANSITION / 1000,
            ease: 'easeInOut'
          }}
        >
          {Math.round(confidence * 100)}%
        </motion.span>
      )}
    </motion.div>
  );
});

ConfidenceIndicator.displayName = 'ConfidenceIndicator';
