import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MissionStatus } from '../types';
import { STATUS_INDICATORS, STATUS_COLORS } from '../types';

interface StatusIndicatorProps {
  status: MissionStatus;
  className?: string;
  showLabel?: boolean;
}

export function StatusIndicator({
  status,
  className,
  showLabel = false,
}: StatusIndicatorProps) {
  const indicator = STATUS_INDICATORS[status];
  const color = STATUS_COLORS[status];

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

  if (showLabel) {
    return (
      <Badge
        variant={getStatusVariant(status)}
        className={cn('gap-1', className)}
      >
        <span className='text-sm'>{indicator}</span>
        <span>{getStatusLabel(status)}</span>
      </Badge>
    );
  }

  return (
    <span
      className={cn('text-lg', className)}
      style={{ color }}
      title={getStatusLabel(status)}
    >
      {indicator}
    </span>
  );
}
