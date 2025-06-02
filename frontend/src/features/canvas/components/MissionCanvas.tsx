// import { ScrollArea } from '@/components/ui/scroll-area' // Temporarily disabled due to React 19 compatibility
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MissionSection } from './MissionSection';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';

interface MissionCanvasProps {
  className?: string;
}

export function MissionCanvas({ className }: MissionCanvasProps) {
  const missionTitle = useBoundStore(state => state.missionTitle);
  const sections = useBoundStore(state => state.sections);
  const selectedSectionId = useBoundStore(state => state.selectedSectionId);
  const selectSection = useBoundStore(state => state.selectSection);
  const clearSelection = useBoundStore(state => state.clearSelection);

  // Calculate progress
  const confirmedSections = sections.filter(
    s => s.status === 'confirmed'
  ).length;
  const totalSections = sections.length;
  const progressPercentage =
    totalSections > 0
      ? Math.round((confirmedSections / totalSections) * 100)
      : 0;

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
            <Badge variant='secondary' className='text-xs'>
              {confirmedSections}/{totalSections} confirmés
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
            <div className='bg-muted h-2 w-full rounded-full'>
              <div
                className='bg-primary h-2 rounded-full transition-all duration-300'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='custom-scrollbar flex-1 overflow-y-auto'>
        <div className='space-y-4 p-4'>
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
            <div className='grid gap-3'>
              {sections.map(section => (
                <MissionSection
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onSelect={() => handleSectionSelect(section.id)}
                />
              ))}
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
