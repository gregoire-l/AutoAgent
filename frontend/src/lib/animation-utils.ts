/**
 * Animation utilities for performance optimization
 */

// Optimized spring configuration for 60fps
export const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
  mass: 1,
};

// Fast spring for micro-interactions
export const FAST_SPRING = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 17,
  mass: 0.8,
};

// Smooth easing for layout animations
export const SMOOTH_EASING = [0.4, 0, 0.2, 1] as const;

// Performance-optimized animation variants
export const OPTIMIZED_VARIANTS = {
  // Fade animations (opacity only)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: SPRING_CONFIG,
  },

  // Scale animations (transform only)
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: SPRING_CONFIG,
  },

  // Slide animations (transform only)
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: SPRING_CONFIG,
  },

  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
    transition: SPRING_CONFIG,
  },

  slideLeft: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: SPRING_CONFIG,
  },

  slideRight: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: SPRING_CONFIG,
  },

  // Hover effects
  hover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: FAST_SPRING,
  },

  // Glow effect
  glow: {
    whileHover: {
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
      scale: 1.02,
    },
    transition: FAST_SPRING,
  },
};

/**
 * Apply hardware acceleration to an element
 */
export const applyHardwareAcceleration = (element: HTMLElement) => {
  element.style.willChange = 'transform, opacity';
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
};

/**
 * Remove hardware acceleration from an element
 */
export const removeHardwareAcceleration = (element: HTMLElement) => {
  element.style.willChange = 'auto';
  element.style.transform = '';
  element.style.backfaceVisibility = '';
  element.style.perspective = '';
};

/**
 * Stagger animation delays for multiple elements
 */
export const createStaggeredDelay = (index: number, baseDelay = 0.1) => {
  return baseDelay * index;
};

/**
 * Create optimized transition for layout animations
 */
export const createLayoutTransition = (duration = 0.3) => ({
  layout: true,
  transition: {
    duration,
    ease: SMOOTH_EASING,
  },
});

/**
 * Performance monitoring for animations
 */
export const monitorAnimationPerformance = (name: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if (duration > 16.67) { // More than one frame at 60fps
        console.warn(`Animation "${name}" took ${duration.toFixed(2)}ms (> 16.67ms)`);
      }
    };
  }
  
  return () => {}; // No-op for SSR
};
