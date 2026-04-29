import { Badge } from './Badge';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
type BlogStatus = 'published' | 'draft';

interface StatusBadgeProps {
  status: AppointmentStatus | BlogStatus | string;
}

const statusMap: Record<string, { variant: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'success' | 'neutral'; label: string }> = {
  pending: { variant: 'pending', label: 'Pending' },
  confirmed: { variant: 'confirmed', label: 'Confirmed' },
  cancelled: { variant: 'cancelled', label: 'Cancelled' },
  completed: { variant: 'completed', label: 'Completed' },
  published: { variant: 'success', label: 'Published' },
  draft: { variant: 'neutral', label: 'Draft' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusMap[status] ?? { variant: 'neutral' as const, label: status };
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}
