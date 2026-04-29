'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  shape?: 'circle' | 'square';
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
};

// Titles to strip before computing initials so "Dr. Harshil Patel" → "HP"
const TITLE_PREFIXES = new Set(['dr', 'mr', 'mrs', 'ms', 'prof', 'sir', 'rev']);

function getInitials(name: string): string {
  const words = name
    .split(' ')
    .filter((w) => !TITLE_PREFIXES.has(w.toLowerCase().replace(/\.$/, '')));
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';
}

const COLORS = [
  'bg-[#0f4c81]',
  'bg-[#e8734a]',
  'bg-[#10b981]',
  'bg-[#7c3aed]',
  'bg-[#f59e0b]',
  'bg-[#ef4444]',
  'bg-[#0891b2]',
  'bg-[#db2777]',
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function Avatar({ src, alt, name = '', size = 'md', shape = 'circle', className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when src changes (e.g. navigating between doctor profiles)
  useEffect(() => { setImgError(false); }, [src]);

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn('object-cover shrink-0', sizeClasses[size], shapeClass, className)}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-bold text-white shrink-0',
        sizeClasses[size],
        shapeClass,
        name ? getColorFromName(name) : 'bg-[#e2e8f0] text-[#6b7280]',
        className
      )}
      aria-label={alt || name}
    >
      {name ? getInitials(name) : '?'}
    </div>
  );
}
