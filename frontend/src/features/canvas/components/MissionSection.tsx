import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { StatusIndicator } from './StatusIndicator';
import { useBoundStore } from '@/store';
import { cn } from '@/lib/utils';
import type { MissionSectionData } from '../types';

interface MissionSectionProps {
  section: MissionSectionData;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function MissionSection({
  section,
  isSelected = false,
  onSelect,
  className,
}: MissionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(section.content || '');
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  const updateSectionContent = useBoundStore(
    state => state.updateSectionContent
  );
  const updateSectionStatus = useBoundStore(state => state.updateSectionStatus);
  const selectOption = useBoundStore(state => state.selectOption);

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
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    }
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
          <div className='flex items-center gap-2'>
            <StatusIndicator
              status={section.status}
              sectionId={section.id}
              enableAnimations={true}
            />
            <h3 className='text-sm font-medium'>{section.title}</h3>
          </div>

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
              <p className='text-muted-foreground mb-3 text-sm'>
                {section.content}
              </p>
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
                        className='h-4 w-4'
                      />
                      <Label
                        htmlFor={option.id}
                        className='cursor-pointer text-sm'
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
