"use client";

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { OPTIMIZED_VARIANTS } from '@/lib/animation-utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  glowColor?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ 
    children, 
    className, 
    glowColor = '#3B82F6', 
    glowIntensity = 'medium',
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const glowIntensityMap = {
      low: '10px',
      medium: '20px',
      high: '30px',
    };

    const sizeMap = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 py-3 text-base',
    };

    const variantMap = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    };

    // Optimized animation variants
    const animationVariants = useOptimizedAnimation({
      ...OPTIMIZED_VARIANTS.glow,
      whileHover: {
        scale: 1.05,
        boxShadow: `0 0 ${glowIntensityMap[glowIntensity]} ${glowColor}60`,
      },
      whileTap: { scale: 0.95 },
    });

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium",
          "ring-offset-background transition-all duration-300 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50 overflow-hidden optimized-animation",
          sizeMap[size],
          variantMap[variant],
          className
        )}
        {...animationVariants}
        {...props}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: `linear-gradient(45deg, ${glowColor}20, transparent, ${glowColor}20)`,
            backgroundSize: '200% 200%',
          }}
          whileHover={{
            opacity: 1,
            backgroundPosition: '200% 200%',
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: `linear-gradient(110deg, transparent 25%, ${glowColor}60 50%, transparent 75%)`,
            backgroundSize: '200% 100%',
          }}
          whileHover={{
            opacity: 0.3,
            backgroundPosition: '200% 0',
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        {/* Pulse effect on focus */}
        <motion.div
          className="absolute inset-0 rounded-md opacity-0"
          style={{
            boxShadow: `0 0 0 2px ${glowColor}40`,
          }}
          whileFocus={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

GlowButton.displayName = 'GlowButton';
