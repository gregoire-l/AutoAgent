import { useMemo } from 'react';
import { useReducedMotion } from './useReducedMotion';
import type { TargetAndTransition, Transition } from 'motion/react';

interface AnimationVariants {
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  transition?: Transition;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  whileFocus?: TargetAndTransition;
}

interface OptimizedAnimationOptions {
  shouldAnimate?: boolean;
  enableHardwareAcceleration?: boolean;
  respectReducedMotion?: boolean;
}

/**
 * Hook to optimize animations based on user preferences and performance
 */
export const useOptimizedAnimation = (
  animationVariants: AnimationVariants,
  options: OptimizedAnimationOptions = {}
) => {
  const {
    shouldAnimate = true,
    enableHardwareAcceleration = true,
    respectReducedMotion = true,
  } = options;

  const prefersReducedMotion = useReducedMotion();

  return useMemo(() => {
    // If reduced motion is preferred and we should respect it, return empty variants
    if (respectReducedMotion && prefersReducedMotion) {
      return {
        initial: {},
        animate: {},
        exit: {},
        transition: { duration: 0 },
        whileHover: {},
        whileTap: {},
        whileFocus: {},
      };
    }

    // If animation is disabled, return empty variants
    if (!shouldAnimate) {
      return {
        initial: {},
        animate: {},
        exit: {},
        transition: { duration: 0 },
        whileHover: {},
        whileTap: {},
        whileFocus: {},
      };
    }

    // Apply hardware acceleration optimizations
    const optimizedVariants = { ...animationVariants };

    if (enableHardwareAcceleration) {
      // Add will-change and transform3d for hardware acceleration
      const addHardwareAcceleration = (variant: TargetAndTransition): TargetAndTransition => {
        if (variant && typeof variant === 'object') {
          return {
            ...variant,
            willChange: 'transform, opacity',
            transform: variant.transform || 'translateZ(0)',
          };
        }
        return variant;
      };

      if (optimizedVariants.initial) {
        optimizedVariants.initial = addHardwareAcceleration(optimizedVariants.initial);
      }
      if (optimizedVariants.animate) {
        optimizedVariants.animate = addHardwareAcceleration(optimizedVariants.animate);
      }
      if (optimizedVariants.whileHover) {
        optimizedVariants.whileHover = addHardwareAcceleration(optimizedVariants.whileHover);
      }
      if (optimizedVariants.whileTap) {
        optimizedVariants.whileTap = addHardwareAcceleration(optimizedVariants.whileTap);
      }
    }

    // Optimize transition for 60fps
    if (optimizedVariants.transition) {
      optimizedVariants.transition = {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        ...optimizedVariants.transition,
      } as Transition;
    }

    return optimizedVariants;
  }, [animationVariants, shouldAnimate, enableHardwareAcceleration, respectReducedMotion, prefersReducedMotion]);
};
