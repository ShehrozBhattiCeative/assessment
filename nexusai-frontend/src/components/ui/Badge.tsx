import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-[#eff6ff] text-[#0f4c81] border border-[#bfdbfe]',
  accent: 'bg-[#fff7ed] text-[#c05a35] border border-[#fed7aa]',
  success: 'bg-[#d1fae5] text-[#065f46] border border-[#6ee7b7]',
  warning: 'bg-[#fef3c7] text-[#78350f] border border-[#fcd34d]',
  error: 'bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]',
  info: 'bg-[#dbeafe] text-[#1e40af] border border-[#93c5fd]',
  neutral: 'bg-[#f3f4f6] text-[#374151] border border-[#d1d5db]',
  pending: 'bg-[#fef3c7] text-[#92400e] border border-[#fcd34d]',
  confirmed: 'bg-[#d1fae5] text-[#065f46] border border-[#6ee7b7]',
  cancelled: 'bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]',
  completed: 'bg-[#f3f4f6] text-[#374151] border border-[#d1d5db]',
};

const dotColors: Record<BadgeVariant, string> = {
  primary: 'bg-[#0f4c81]',
  accent: 'bg-[#e8734a]',
  success: 'bg-[#10b981]',
  warning: 'bg-[#f59e0b]',
  error: 'bg-[#ef4444]',
  info: 'bg-[#3b82f6]',
  neutral: 'bg-[#6b7280]',
  pending: 'bg-[#f59e0b]',
  confirmed: 'bg-[#10b981]',
  cancelled: 'bg-[#ef4444]',
  completed: 'bg-[#6b7280]',
};

export function Badge({ variant = 'neutral', size = 'md', dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}
