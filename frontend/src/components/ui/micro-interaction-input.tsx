"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { OPTIMIZED_VARIANTS } from '@/lib/animation-utils';

interface MicroInteractionInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  glowColor?: string;
  enableFloatingLabel?: boolean;
  label?: string;
}

export const MicroInteractionInput = React.forwardRef<
  HTMLInputElement,
  MicroInteractionInputProps
>(({ 
  className, 
  type = 'text',
  glowColor = '#3B82F6',
  enableFloatingLabel = false,
  label,
  placeholder,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  // Optimized animation variants
  const containerVariants = useOptimizedAnimation({
    ...OPTIMIZED_VARIANTS.hover,
    whileHover: { scale: 1.01 },
    whileFocus: { scale: 1.01 },
  });

  const labelVariants = useOptimizedAnimation({
    animate: {
      scale: isFocused || hasValue ? 0.85 : 1,
      y: isFocused || hasValue ? -20 : 0,
    },
  });

  return (
    <div className="relative">
      {/* Floating label */}
      {enableFloatingLabel && label && (
        <motion.label
          className={cn(
            "absolute left-3 text-sm text-muted-foreground pointer-events-none transition-all duration-200",
            isFocused || hasValue
              ? "top-0 -translate-y-1/2 bg-background px-1 text-xs"
              : "top-1/2 -translate-y-1/2"
          )}
          style={{
            color: isFocused ? glowColor : undefined,
          }}
          {...labelVariants}
        >
          {label}
        </motion.label>
      )}

      <motion.div
        className="relative optimized-animation"
        {...containerVariants}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-md opacity-0 pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${glowColor}40`,
          }}
          animate={{
            opacity: isFocused ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Border glow */}
        <motion.div
          className="absolute inset-0 rounded-md border-2 opacity-0 pointer-events-none"
          style={{
            borderColor: glowColor,
          }}
          animate={{
            opacity: isFocused ? 0.6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed",
            "disabled:opacity-50 transition-all duration-200",
            "hover:border-muted-foreground/50",
            enableFloatingLabel && label && "pt-6",
            className
          )}
          placeholder={enableFloatingLabel ? undefined : placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-md opacity-0 pointer-events-none"
          style={{
            background: `linear-gradient(110deg, transparent 25%, ${glowColor}20 50%, transparent 75%)`,
            backgroundSize: '200% 100%',
          }}
          whileHover={{
            opacity: 1,
            backgroundPosition: '200% 0',
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </div>
  );
});

MicroInteractionInput.displayName = 'MicroInteractionInput';
