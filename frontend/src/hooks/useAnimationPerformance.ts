import { useEffect, useRef, useCallback } from 'react';
import { applyHardwareAcceleration, removeHardwareAcceleration } from '@/lib/animation-utils';

interface AnimationPerformanceOptions {
  enableHardwareAcceleration?: boolean;
  monitorPerformance?: boolean;
  autoCleanup?: boolean;
}

/**
 * Hook to optimize animation performance
 */
export const useAnimationPerformance = (
  options: AnimationPerformanceOptions = {}
) => {
  const {
    enableHardwareAcceleration = true,
    monitorPerformance = false,
    autoCleanup = true,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const performanceStartRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);

  // Apply hardware acceleration to element
  const applyOptimizations = useCallback((element: HTMLElement) => {
    if (enableHardwareAcceleration) {
      applyHardwareAcceleration(element);
    }
  }, [enableHardwareAcceleration]);

  // Remove optimizations from element
  const removeOptimizations = useCallback((element: HTMLElement) => {
    if (autoCleanup) {
      removeHardwareAcceleration(element);
    }
  }, [autoCleanup]);

  // Start performance monitoring
  const startPerformanceMonitoring = useCallback((animationName?: string) => {
    if (monitorPerformance && typeof window !== 'undefined' && window.performance) {
      performanceStartRef.current = performance.now();
      isAnimatingRef.current = true;
      
      if (animationName) {
        console.log(`🎬 Animation "${animationName}" started`);
      }
    }
  }, [monitorPerformance]);

  // End performance monitoring
  const endPerformanceMonitoring = useCallback((animationName?: string) => {
    if (monitorPerformance && isAnimatingRef.current && typeof window !== 'undefined' && window.performance) {
      const duration = performance.now() - performanceStartRef.current;
      isAnimatingRef.current = false;
      
      // Log performance warning if animation took longer than one frame (16.67ms at 60fps)
      if (duration > 16.67) {
        console.warn(`⚠️ Animation "${animationName || 'unknown'}" took ${duration.toFixed(2)}ms (> 16.67ms)`);
      } else if (animationName) {
        console.log(`✅ Animation "${animationName}" completed in ${duration.toFixed(2)}ms`);
      }
    }
  }, [monitorPerformance]);

  // Ref callback to apply optimizations
  const optimizedRef = useCallback((element: HTMLElement | null) => {
    // Clean up previous element
    if (elementRef.current) {
      removeOptimizations(elementRef.current);
    }

    // Apply optimizations to new element
    if (element) {
      applyOptimizations(element);
      elementRef.current = element;
    }
  }, [applyOptimizations, removeOptimizations]);

  // Animation lifecycle handlers
  const onAnimationStart = useCallback((animationName?: string) => {
    startPerformanceMonitoring(animationName);
    
    if (elementRef.current) {
      elementRef.current.classList.add('optimized-animation');
      elementRef.current.classList.remove('animation-complete');
    }
  }, [startPerformanceMonitoring]);

  const onAnimationComplete = useCallback((animationName?: string) => {
    endPerformanceMonitoring(animationName);
    
    if (elementRef.current) {
      elementRef.current.classList.remove('optimized-animation');
      elementRef.current.classList.add('animation-complete');
      
      // Clean up will-change after animation completes
      if (autoCleanup) {
        setTimeout(() => {
          if (elementRef.current) {
            elementRef.current.style.willChange = 'auto';
          }
        }, 100);
      }
    }
  }, [endPerformanceMonitoring, autoCleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (elementRef.current) {
        removeOptimizations(elementRef.current);
      }
    };
  }, [removeOptimizations]);

  return {
    optimizedRef,
    onAnimationStart,
    onAnimationComplete,
    startPerformanceMonitoring,
    endPerformanceMonitoring,
  };
};
