'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  footer?: ReactNode;
}

const SIZE_STYLES: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[95vw]',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', closeOnOverlayClick = true, footer }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        className="absolute inset-0"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal box */}
      <div
        className={cn(
          'relative w-full flex flex-col max-h-[90vh]',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          SIZE_STYLES[size]
        )}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div
            className="flex items-center justify-between p-6 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <h2
              id="modal-title"
              style={{
                fontSize: 20, fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                padding: 8, borderRadius: 10, border: 'none',
                background: 'transparent', cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-6">{children}</div>

        {footer && (
          <div
            className="p-6 shrink-0 flex justify-end gap-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
