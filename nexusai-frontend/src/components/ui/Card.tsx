'use client';

import { CSSProperties, HTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PADDING: Record<NonNullable<CardProps['padding']>, CSSProperties> = {
  none: {},
  sm:   { padding: 16 },
  md:   { padding: 24 },
  lg:   { padding: 32 },
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, bordered = true, shadow = 'sm', padding = 'md', className, style, children, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const [hovered, setHovered] = useState(false);

    const shadowStyle: CSSProperties =
      shadow === 'none' ? {} :
      shadow === 'sm'   ? { boxShadow: 'var(--shadow)' } :
      shadow === 'md'   ? { boxShadow: '0 4px 24px -4px rgba(0,0,0,0.18)' } :
                          { boxShadow: '0 10px 40px -8px rgba(0,0,0,0.28)' };

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          background: 'var(--bg-card)',
          border: bordered ? (hovered && hover ? '1px solid var(--accent)' : '1px solid var(--border)') : 'none',
          borderRadius: 'var(--radius)',
          transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
          cursor: hover ? 'pointer' : undefined,
          transform: hover && hovered ? 'translateY(-4px)' : 'translateY(0)',
          ...shadowStyle,
          ...PADDING[padding],
          ...style,
        }}
        onMouseEnter={(e) => { if (hover) setHovered(true); onMouseEnter?.(e); }}
        onMouseLeave={(e) => { if (hover) setHovered(false); onMouseLeave?.(e); }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, style, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mb-4', className)}
    style={{ ...style }}
    {...props}
  >
    {children}
  </div>
);

export const CardBody = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('', className)} {...props}>{children}</div>
);

export const CardFooter = ({ className, style, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-4 pt-4', className)}
    style={{ borderTop: '1px solid var(--border)', ...style }}
    {...props}
  >
    {children}
  </div>
);
