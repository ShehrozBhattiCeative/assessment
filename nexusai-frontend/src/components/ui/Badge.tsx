import { CSSProperties, HTMLAttributes } from 'react';

type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const VARIANT_STYLES: Record<BadgeVariant, CSSProperties> = {
  primary:   { background: 'rgba(34,211,238,0.12)',  color: '#22d3ee', border: '1px solid rgba(34,211,238,0.25)' },
  accent:    { background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' },
  success:   { background: 'rgba(52,211,153,0.12)',  color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' },
  warning:   { background: 'rgba(245,158,11,0.12)',  color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' },
  error:     { background: 'rgba(251,113,133,0.12)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.25)' },
  info:      { background: 'rgba(34,211,238,0.12)',  color: '#22d3ee', border: '1px solid rgba(34,211,238,0.25)' },
  neutral:   { background: 'var(--bg-card)',         color: 'var(--text-secondary)', border: '1px solid var(--border)' },
  pending:   { background: 'rgba(245,158,11,0.12)',  color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' },
  confirmed: { background: 'rgba(52,211,153,0.12)',  color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' },
  cancelled: { background: 'rgba(251,113,133,0.12)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.25)' },
  completed: { background: 'var(--bg-card)',         color: 'var(--text-secondary)', border: '1px solid var(--border)' },
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  primary:   '#22d3ee',
  accent:    '#a78bfa',
  success:   '#34d399',
  warning:   '#f59e0b',
  error:     '#fb7185',
  info:      '#22d3ee',
  neutral:   'var(--text-secondary)',
  pending:   '#f59e0b',
  confirmed: '#34d399',
  cancelled: '#fb7185',
  completed: 'var(--text-secondary)',
};

export function Badge({ variant = 'neutral', size = 'md', dot = false, style, children, ...props }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontWeight: 500,
        borderRadius: 999,
        fontSize: 12,
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        fontFamily: 'var(--font-body)',
        ...VARIANT_STYLES[variant],
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: DOT_COLORS[variant],
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}
