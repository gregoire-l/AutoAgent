"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { OPTIMIZED_VARIANTS } from '@/lib/animation-utils';

interface MessagePreloaderProps {
  messages: string[];
  onMessageSelect?: (message: string) => void;
  className?: string;
}

export const MessagePreloader: React.FC<MessagePreloaderProps> = ({
  messages,
  onMessageSelect,
  className,
}) => {
  const preloadNextMessage = useBoundStore(state => state.preloadNextMessage);
  const applyPreloadedMessage = useBoundStore(state => state.usePreloadedMessage);

  const handlePreloadMessage = (message: string) => {
    preloadNextMessage(message);
    onMessageSelect?.(message);
  };

  const handleUsePreloaded = () => {
    applyPreloadedMessage();
  };

  // Optimized animation variants
  const containerVariants = useOptimizedAnimation({
    ...OPTIMIZED_VARIANTS.fadeIn,
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  });

  const itemVariants = useOptimizedAnimation({
    ...OPTIMIZED_VARIANTS.slideUp,
    whileHover: {
      scale: 1.02,
      y: -2,
    },
    whileTap: {
      scale: 0.98,
    },
  });

  if (messages.length === 0) return null;

  return (
    <motion.div
      className={cn(
        "space-y-2 p-4 bg-background/80 backdrop-blur-sm rounded-lg border",
        "optimized-animation",
        className
      )}
      {...containerVariants}
    >
      <motion.h3
        className="text-sm font-medium text-muted-foreground mb-3"
        {...itemVariants}
      >
        Messages suggérés
      </motion.h3>

      <div className="space-y-2">
        {messages.map((message, index) => (
          <motion.button
            key={index}
            className={cn(
              "w-full text-left p-3 rounded-md border border-border/50",
              "hover:border-primary/50 hover:bg-accent/50 transition-all duration-200",
              "text-sm text-muted-foreground hover:text-foreground",
              "optimized-animation"
            )}
            onClick={() => handlePreloadMessage(message)}
            {...itemVariants}
            custom={index}
          >
            <motion.div
              className="flex items-start gap-2"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="text-xs opacity-60 mt-0.5"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                💬
              </motion.span>
              <span className="flex-1">{message}</span>
            </motion.div>
          </motion.button>
        ))}
      </div>

      <motion.div
        className="pt-2 border-t border-border/50"
        {...itemVariants}
      >
        <motion.button
          className={cn(
            "w-full p-2 rounded-md bg-primary/10 hover:bg-primary/20",
            "text-xs text-primary hover:text-primary/80 transition-all duration-200",
            "optimized-animation"
          )}
          onClick={handleUsePreloaded}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Utiliser le message préchargé
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
