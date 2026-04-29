'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface StatCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function StatCounter({ end, duration = 2000, suffix = '', prefix = '', label, icon, className }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = performance.now();
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * end));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [hasStarted, end, duration]);

  return (
    <div ref={ref} className={cn('text-center', className)}>
      {icon && (
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#eff6ff] text-[#0f4c81] mb-4 mx-auto">
          {icon}
        </div>
      )}
      <div className="text-4xl font-bold font-[var(--font-heading)] text-[#1a1a2e] tabular-nums">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p className="text-[#6b7280] text-sm mt-1 font-medium">{label}</p>
    </div>
  );
}
