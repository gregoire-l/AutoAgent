import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MissionStatus } from '../types';
import { STATUS_INDICATORS, STATUS_COLORS } from '../types';
import { useBoundStore } from '@/store';
import { useEffect, useState } from 'react';

interface StatusIndicatorProps {
  status: MissionStatus;
  className?: string;
  showLabel?: boolean;
  sectionId?: string;
  enableAnimations?: boolean;
}

export function StatusIndicator({
  status,
  className,
  showLabel = false,
  sectionId,
  enableAnimations = true,
}: StatusIndicatorProps) {
  const indicator = STATUS_INDICATORS[status];
  const color = STATUS_COLORS[status];
  const [isAnimating, setIsAnimating] = useState(false);

  // Get highlighted sections from clarification store
  const highlightedSections = useBoundStore((state) =>
    'highlightedSections' in state ? state.highlightedSections : []
  );

  // Check if this section is highlighted (has halo effect)
  const isHighlighted = sectionId && highlightedSections.includes(sectionId);

  // Trigger animation on status change
  useEffect(() => {
    if (enableAnimations) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [status, enableAnimations]);

  const getStatusLabel = (status: MissionStatus): string => {
    switch (status) {
      case 'pending':
        return 'À définir';
      case 'in_progress':
        return 'En cours';
      case 'confirmed':
        return 'Confirmé';
      case 'to_define':
        return 'À définir';
      default:
        return 'Inconnu';
    }
  };

  const getStatusVariant = (status: MissionStatus) => {
    switch (status) {
      case 'confirmed':
        return 'default'; // green
      case 'in_progress':
        return 'secondary'; // yellow
      case 'pending':
      case 'to_define':
        return 'outline'; // gray
      default:
        return 'outline';
    }
  };

  // Enhanced animation classes
  const animationClasses = cn(
    'transition-all duration-300 ease-in-out',
    isAnimating && 'scale-110',
    status === 'in_progress' && enableAnimations && 'animate-pulse',
    isHighlighted && 'ring-2 ring-yellow-400 ring-opacity-50 rounded-full'
  );

  if (showLabel) {
    return (
      <Badge
        variant={getStatusVariant(status)}
        className={cn(
          'gap-1 transition-all duration-300 ease-in-out',
          isAnimating && 'scale-105 shadow-lg',
          isHighlighted && 'ring-2 ring-yellow-400 ring-opacity-50',
          className
        )}
      >
        <span className={cn('text-sm', animationClasses)}>{indicator}</span>
        <span className='transition-colors duration-300'>
          {getStatusLabel(status)}
        </span>
      </Badge>
    );
  }

  return (
    <span
      className={cn('text-lg', animationClasses, className)}
      style={{ color }}
      title={getStatusLabel(status)}
    >
      {indicator}
    </span>
  );
}
