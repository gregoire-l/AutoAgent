import { motion } from 'motion/react';
import { useRef, forwardRef } from 'react';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { StatusIndicator } from './StatusIndicator';
import { TextAnimate } from '@/components/ui/text-animate';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/lib/constants';
import type { MissionSectionData } from '../types';

interface ProgressiveCanvasSectionProps {
  section: MissionSectionData;
  index: number;
  previousRef?: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

// Motion variants for staggered animations
const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const ProgressiveCanvasSection = forwardRef<
  HTMLDivElement,
  ProgressiveCanvasSectionProps
>(({ section, index, previousRef, containerRef, isSelected, onSelect, className }, ref) => {
  const currentRef = useRef<HTMLDivElement>(null);
  
  // Use the forwarded ref or fallback to internal ref
  const sectionRef = (ref as React.RefObject<HTMLDivElement>) || currentRef;

  // Calculate stagger delay based on index
  const staggerDelay = index * (ANIMATIONS.SECTION_STAGGER_DELAY / 1000);

  return (
    <motion.div
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: staggerDelay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'relative',
        className
      )}
    >
      {/* AnimatedBeam connection to previous section */}
      {previousRef && containerRef.current && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={previousRef}
          toRef={sectionRef}
          duration={ANIMATIONS.BEAM_ANIMATION_DURATION / 1000}
          delay={staggerDelay + 0.3}
          curvature={15}
          gradientStartColor="hsl(var(--primary))"
          gradientStopColor="hsl(var(--primary) / 0.6)"
          pathColor="hsl(var(--muted-foreground))"
          pathOpacity={0.2}
        />
      )}

      {/* Section Header with ShimmerButton */}
      <ShimmerButton
        className={cn(
          'w-full mb-3 justify-start text-left p-3',
          'bg-background/50 backdrop-blur-sm',
          'border border-border/50',
          'hover:bg-background/80 transition-all duration-300',
          isSelected && 'ring-2 ring-primary ring-offset-2'
        )}
        onClick={onSelect}
        shimmerColor="hsl(var(--primary) / 0.3)"
        shimmerDuration={`${ANIMATIONS.SHIMMER_DURATION}ms`}
        background="hsl(var(--background) / 0.8)"
      >
        <div className="flex items-center gap-3 w-full">
          <StatusIndicator
            status={section.status}
            sectionId={section.id}
            enableAnimations={true}
            className="flex-shrink-0"
          />
          <TextAnimate
            animation="slideUp"
            className="font-medium text-sm flex-1"
          >
            {section.title}
          </TextAnimate>
        </div>
      </ShimmerButton>

      {/* Section Content with progressive reveal */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: staggerDelay + 0.4,
          duration: 0.4,
          ease: "easeOut",
        }}
        className={cn(
          'bg-card/50 backdrop-blur-sm rounded-lg border border-border/50',
          'p-4 space-y-3',
          'hover:bg-card/80 transition-all duration-300',
          'hover:shadow-lg hover:shadow-primary/5'
        )}
      >
        {/* Content */}
        {section.content && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: staggerDelay + 0.6 }}
            className="text-muted-foreground text-sm leading-relaxed"
          >
            {section.content}
          </motion.p>
        )}

        {/* Options */}
        {section.options && section.options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay + 0.7 }}
            className="space-y-2"
          >
            {section.options.map((option, optionIndex) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: staggerDelay + 0.8 + (optionIndex * 0.1),
                  duration: 0.3,
                }}
                className={cn(
                  'flex items-center space-x-2 p-2 rounded',
                  'hover:bg-muted/50 transition-colors duration-200',
                  option.selected && 'bg-primary/10 border border-primary/20'
                )}
              >
                <div className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  option.selected ? 'bg-primary' : 'bg-muted-foreground/30'
                )} />
                <span className={cn(
                  'text-sm transition-colors duration-200',
                  option.selected ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  {option.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state with subtle animation */}
        {!section.content && (!section.options || section.options.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: staggerDelay + 0.6 }}
            className="text-center py-4"
          >
            <div className="text-muted-foreground/60 text-xs italic">
              {section.isEditable
                ? 'Cliquez pour ajouter du contenu'
                : 'Aucun contenu disponible'}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Glow effect during loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{
          delay: staggerDelay,
          duration: 1.5,
          ease: "easeInOut",
        }}
        className={cn(
          'absolute inset-0 rounded-lg',
          'bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10',
          'blur-xl -z-10',
          'pointer-events-none'
        )}
      />
    </motion.div>
  );
});

ProgressiveCanvasSection.displayName = 'ProgressiveCanvasSection';
