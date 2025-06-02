// import { ScrollArea } from '@/components/ui/scroll-area' // Temporarily disabled due to React 19 compatibility
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MissionSection } from './MissionSection';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { ANIMATIONS } from '@/lib/constants';
import { motion, AnimatePresence } from 'motion/react';

interface MissionCanvasProps {
  className?: string;
}

export function MissionCanvas({ className }: MissionCanvasProps) {
  const missionTitle = useBoundStore(state => state.missionTitle);
  const sections = useBoundStore(state => state.sections);
  const selectedSectionId = useBoundStore(state => state.selectedSectionId);
  const selectSection = useBoundStore(state => state.selectSection);
  const clearSelection = useBoundStore(state => state.clearSelection);
  const [progressAnimating, setProgressAnimating] = useState(false);

  // Refs for AnimatedBeam connections
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Get clarification flow state for real-time updates
  const isActive = useBoundStore(state =>
    'isActive' in state ? state.isActive : false
  );
  const agentTyping = useBoundStore(state =>
    'agentTyping' in state ? state.agentTyping : false
  );

  // Calculate progress
  const confirmedSections = sections.filter(
    s => s.status === 'confirmed'
  ).length;
  const totalSections = sections.length;
  const progressPercentage =
    totalSections > 0
      ? Math.round((confirmedSections / totalSections) * 100)
      : 0;

  // Animate progress bar when progress changes
  useEffect(() => {
    setProgressAnimating(true);
    const timer = setTimeout(() => setProgressAnimating(false), 800);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const handleSectionSelect = (sectionId: string) => {
    if (selectedSectionId === sectionId) {
      clearSelection();
    } else {
      selectSection(sectionId);
    }
  };

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className='border-border border-b p-4'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h1 className='text-lg font-semibold'>Canvas de Mission</h1>
            <Badge
              variant='secondary'
              className={cn(
                'text-xs transition-all duration-300',
                progressAnimating && 'scale-110 shadow-lg',
                isActive && 'ring-2 ring-blue-400 ring-opacity-50'
              )}
            >
              {confirmedSections}/{totalSections} confirmés
              {agentTyping && (
                <span className="ml-1 animate-pulse">⚡</span>
              )}
            </Badge>
          </div>

          {missionTitle && (
            <h2 className='text-muted-foreground text-base font-medium'>
              {missionTitle}
            </h2>
          )}

          {/* Progress Bar */}
          <div className='space-y-1'>
            <div className='text-muted-foreground flex justify-between text-xs'>
              <span>Progression</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className='bg-muted h-2 w-full rounded-full overflow-hidden'>
              <div
                className={cn(
                  'bg-primary h-2 rounded-full transition-all duration-500 ease-out',
                  progressAnimating && 'shadow-lg shadow-primary/50',
                  isActive && 'animate-pulse'
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='custom-scrollbar flex-1 overflow-y-auto' ref={containerRef}>
        <div className='space-y-4 p-4 relative'>
          {sections.length === 0 ? (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground'>
                Aucune section de mission disponible.
              </p>
              <p className='text-muted-foreground mt-2 text-sm'>
                Commencez une conversation pour initialiser votre mission.
              </p>
            </div>
          ) : (
            <div className='grid gap-4 relative'>
              <AnimatePresence mode="popLayout">
                {sections.map((section, index) => {
                  const previousRef = index > 0 ?
                    { current: sectionRefs.current.get(sections[index - 1].id) || null } :
                    undefined;

                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{
                        duration: 0.6,
                        delay: index * (ANIMATIONS.SECTION_STAGGER_DELAY / 1000),
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      ref={(el) => {
                        if (el) {
                          sectionRefs.current.set(section.id, el);
                        }
                      }}
                      className={cn(
                        'relative transition-all duration-300 ease-in-out',
                        isActive && 'animate-in fade-in slide-in-from-left-4',
                      )}
                    >
                      {/* AnimatedBeam connection to previous section */}
                      {previousRef && containerRef.current && (
                        <AnimatedBeam
                          containerRef={containerRef}
                          fromRef={previousRef}
                          toRef={{ current: sectionRefs.current.get(section.id) || null }}
                          duration={ANIMATIONS.BEAM_ANIMATION_DURATION / 1000}
                          delay={index * (ANIMATIONS.SECTION_STAGGER_DELAY / 1000) + 0.3}
                          curvature={15}
                          gradientStartColor="hsl(var(--primary))"
                          gradientStopColor="hsl(var(--primary) / 0.6)"
                          pathColor="hsl(var(--muted-foreground))"
                          pathOpacity={0.2}
                        />
                      )}

                      <MissionSection
                        section={section}
                        isSelected={selectedSectionId === section.id}
                        onSelect={() => handleSectionSelect(section.id)}
                      />

                      {/* Glow effect during progressive loading */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        transition={{
                          delay: index * (ANIMATIONS.SECTION_STAGGER_DELAY / 1000),
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
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className='border-border border-t p-4'>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex-1'
            disabled={confirmedSections === 0}
          >
            Valider la Mission
          </Button>
          <Button variant='ghost' size='sm' onClick={clearSelection}>
            Tout Déselectionner
          </Button>
        </div>
      </div>
    </div>
  );
}
