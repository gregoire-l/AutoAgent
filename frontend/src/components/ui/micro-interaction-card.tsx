"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MicroInteractionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  hoverScale?: number;
  tapScale?: number;
  enableParallax?: boolean;
}

export const MicroInteractionCard = React.forwardRef<
  HTMLDivElement,
  MicroInteractionCardProps
>(({ 
  children, 
  className, 
  glowColor = '#3B82F6', 
  hoverScale = 1.02,
  tapScale = 0.98,
  enableParallax = false,
  ...props 
}, ref) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableParallax) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    if (enableParallax) {
      setMousePosition({ x: 0, y: 0 });
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
        "hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "cursor-pointer",
        className
      )}
      whileHover={{
        scale: hoverScale,
        boxShadow: `0 10px 25px rgba(0,0,0,0.1), 0 0 20px ${glowColor}20`,
        y: -2,
        rotateX: enableParallax ? mousePosition.y * 0.5 : 0,
        rotateY: enableParallax ? mousePosition.x * 0.5 : 0,
      }}
      whileTap={{ scale: tapScale }}
      whileFocus={{
        boxShadow: `0 0 0 3px ${glowColor}50`,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r opacity-0 pointer-events-none"
        style={{
          background: `linear-gradient(110deg, transparent 25%, ${glowColor}40 50%, transparent 75%)`,
          backgroundSize: '200% 100%',
        }}
        whileHover={{
          opacity: 1,
          backgroundPosition: '200% 0',
        }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Glow effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r opacity-0 pointer-events-none"
        style={{ 
          background: `linear-gradient(45deg, ${glowColor}15, transparent)` 
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
});

MicroInteractionCard.displayName = 'MicroInteractionCard';
