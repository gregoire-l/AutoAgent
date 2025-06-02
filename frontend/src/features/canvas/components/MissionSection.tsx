import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { StatusIndicator } from './StatusIndicator';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { TextAnimate } from '@/components/magicui/text-animate';
import { ProgressiveText } from '@/components/ui/progressive-text';
import { getLyonParisExampleConfidence } from '@/lib/confidence-utils';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/lib/constants';
import type { MissionSectionData } from '../types';

interface MissionSectionProps {
  section: MissionSectionData;
  isSelected?: boolean;
  onSelect?: () => void;
  clarificationStep?: number;
  className?: string;
}

export function MissionSection({
  section,
  isSelected = false,
  onSelect,
  clarificationStep = 1,
  className,
}: MissionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(section.content || '');
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null);

  const updateSectionContent = useBoundStore(
    state => state.updateSectionContent
  );
  const updateSectionStatus = useBoundStore(state => state.updateSectionStatus);
  const selectOption = useBoundStore(state => state.selectOption);
  const addUserInteraction = useBoundStore(state =>
    'addUserInteraction' in state ? state.addUserInteraction : () => {}
  );

  // Get highlighted sections from clarification store for halo effect
  const highlightedSections = useBoundStore(state =>
    'highlightedSections' in state ? state.highlightedSections : []
  );

  // Check if this section is highlighted (has halo effect)
  const isHighlighted = highlightedSections.includes(section.id);

  // Track status changes for animations
  useEffect(() => {
    setIsStatusChanging(true);
    const timer = setTimeout(() => setIsStatusChanging(false), 600);
    return () => clearTimeout(timer);
  }, [section.status]);

  const handleSave = () => {
    updateSectionContent(section.id, editContent);
    updateSectionStatus(
      section.id,
      editContent.trim() ? 'confirmed' : 'to_define'
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(section.content || '');
    setIsEditing(false);
  };

  const handleOptionSelect = (optionId: string) => {
    selectOption(section.id, optionId);
    updateSectionStatus(section.id, 'confirmed');

    // Record user interaction for clarification flow
    const selectedOption = section.options?.find(opt => opt.id === optionId);
    if (selectedOption) {
      addUserInteraction({
        type: 'radio_select',
        content: `Selected "${selectedOption.label}" for ${section.title}`,
        sectionId: section.id,
        optionId: optionId,
      });
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const handleButtonSelect = (buttonId: string, buttonLabel: string) => {
    setSelectedButtonId(buttonId);
    updateSectionStatus(section.id, 'confirmed');

    // Record user interaction for clarification flow
    addUserInteraction({
      type: 'button_click',
      content: `Selected "${buttonLabel}" for ${section.title}`,
      sectionId: section.id,
      optionId: buttonId,
    });
  };

  const selectedOption = section.options?.find(opt => opt.selected);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 ease-in-out',
        'hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1',
        isSelected && 'ring-primary ring-2 ring-offset-2',
        isHighlighted && 'ring-2 ring-yellow-400 ring-opacity-50 shadow-yellow-400/20 shadow-lg',
        isStatusChanging && 'scale-[1.01] shadow-lg',
        className
      )}
      onClick={handleCardClick}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <ShimmerButton
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg',
              'bg-background/50 backdrop-blur-sm border border-border/50',
              'hover:bg-background/80 transition-all duration-300',
              'flex-1 justify-start text-left mr-2'
            )}
            onClick={handleCardClick}
            shimmerColor="hsl(var(--primary) / 0.3)"
            shimmerDuration={`${ANIMATIONS.SHIMMER_DURATION}ms`}
            background="hsl(var(--background) / 0.8)"
          >
            <StatusIndicator
              status={section.status}
              sectionId={section.id}
              enableAnimations={true}
              className="flex-shrink-0"
            />
            <TextAnimate
              animation="slideUp"
              className="text-sm font-medium flex-1"
            >
              {section.title}
            </TextAnimate>
          </ShimmerButton>

          {section.isEditable && !isEditing && (
            <Button
              variant='ghost'
              size='sm'
              onClick={e => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className='h-6 px-2 text-xs'
            >
              Éditer
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {/* Editable Content */}
        {section.isEditable && isEditing ? (
          <div className='space-y-3'>
            <Textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              placeholder={`Décrivez ${section.title.toLowerCase()}...`}
              className='min-h-[80px] text-sm'
              autoFocus
            />
            <div className='flex gap-2'>
              <Button size='sm' onClick={handleSave}>
                Sauvegarder
              </Button>
              <Button size='sm' variant='outline' onClick={handleCancel}>
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Text Content */}
            {section.content && (
              <ProgressiveText
                confidence={getLyonParisExampleConfidence(section.title, clarificationStep)}
                animation="blurInUp"
                by="word"
                delay={0.3}
                className='mb-3 text-sm'
                startOnView={false}
              >
                {section.content}
              </ProgressiveText>
            )}

            {/* Options */}
            {section.options && section.options.length > 0 && (
              <div className='space-y-2'>
                <RadioGroup
                  value={selectedOption?.id || ''}
                  onValueChange={handleOptionSelect}
                  className='space-y-2'
                >
                  {section.options.map(option => (
                    <div
                      key={option.id}
                      className='flex items-center space-x-2'
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className='h-4 w-4 transition-all duration-200'
                      />
                      <Label
                        htmlFor={option.id}
                        className='cursor-pointer text-sm transition-colors duration-200 hover:text-primary'
                      >
                        <ProgressiveText
                          confidence={option.selected ? 1.0 : 0.6}
                          animation="fadeIn"
                          by="word"
                          delay={0.1}
                          className="text-sm"
                          startOnView={false}
                        >
                          {option.label}
                        </ProgressiveText>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Interactive Buttons for Livrable Clé section */}
            {section.title === 'Livrable Clé' && section.status === 'suggestion_pending' && (
              <div className='mt-3 flex gap-2'>
                <Button
                  variant={selectedButtonId === 'table' ? 'default' : 'outline'}
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonSelect('table', 'Tableau Comparatif');
                  }}
                  className='transition-all duration-200 hover:scale-105'
                >
                  Tableau Comparatif
                </Button>
                <Button
                  variant={selectedButtonId === 'list' ? 'default' : 'outline'}
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonSelect('list', 'Simple Liste des Options');
                  }}
                  className='transition-all duration-200 hover:scale-105'
                >
                  Simple Liste des Options
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!section.content &&
              (!section.options || section.options.length === 0) && (
                <p className='text-muted-foreground text-xs italic'>
                  {section.isEditable
                    ? 'Cliquez sur "Éditer" pour ajouter du contenu'
                    : 'Aucun contenu'}
                </p>
              )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
