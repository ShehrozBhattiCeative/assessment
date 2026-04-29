'use client';

import { ButtonHTMLAttributes, CSSProperties, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const SIZE: Record<ButtonSize, CSSProperties> = {
  xs: { padding: '5px 12px',  fontSize: 11 },
  sm: { padding: '7px 16px',  fontSize: 12 },
  md: { padding: '10px 22px', fontSize: 13 },
  lg: { padding: '12px 28px', fontSize: 14 },
  xl: { padding: '14px 36px', fontSize: 16 },
};

const VARIANT: Record<ButtonVariant, CSSProperties> = {
  primary:   { background: 'var(--grad-primary)',                             color: '#04060c', boxShadow: '0 10px 30px -10px rgba(34,211,238,0.55)' },
  secondary: { background: 'var(--bg-card)',   border: '1px solid var(--border)', color: 'var(--text-primary)' },
  accent:    { background: 'linear-gradient(135deg,#a78bfa,#f472b6)',         color: '#fff',   boxShadow: '0 10px 30px -10px rgba(167,139,250,0.6)' },
  outline:   { background: 'transparent',      border: '1.5px solid var(--accent)', color: 'var(--accent)' },
  ghost:     { background: 'transparent',      border: '1px solid transparent',    color: 'var(--text-secondary)' },
  danger:    { background: 'linear-gradient(135deg,#fb7185,#f43f5e)',         color: '#fff',   boxShadow: '0 10px 30px -10px rgba(251,113,133,0.5)' },
  success:   { background: 'var(--grad-emerald)',                             color: '#fff',   boxShadow: '0 10px 30px -10px rgba(52,211,153,0.5)' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, fullWidth = false, style, children, disabled, ...props }, ref) => {
    const off = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={off}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.01em',
          borderRadius: 'var(--radius-btn)', border: 'none',
          cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.5 : 1,
          transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
          whiteSpace: 'nowrap', width: fullWidth ? '100%' : undefined,
          ...SIZE[size], ...VARIANT[variant], ...style,
        }}
        onMouseEnter={(e) => { if (!off) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.08)'; } }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
        onMouseDown={(e) => { if (!off) e.currentTarget.style.transform = 'scale(0.97)'; }}
        onMouseUp={(e)   => { if (!off) e.currentTarget.style.transform = 'translateY(-2px)'; }}
        {...props}
      >
        {loading ? (
          <svg style={{ width: 15, height: 15, flexShrink: 0, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : leftIcon && <span style={{ flexShrink: 0, display: 'flex' }}>{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && <span style={{ flexShrink: 0, display: 'flex' }}>{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
