'use client';

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, onRightIconClick, className, id, style, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {label && (
          <label htmlFor={inputId} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
            {label}
            {props.required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {leftIcon && (
            <div style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-secondary)', pointerEvents: 'none', display: 'flex',
            }}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`input-base${className ? ' ' + className : ''}`}
            style={{
              paddingLeft: leftIcon ? 38 : undefined,
              paddingRight: rightIcon ? 38 : undefined,
              borderColor: error ? '#ef4444' : undefined,
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--accent)';
              e.currentTarget.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,0.15)' : '0 0 0 3px var(--accent-light)';
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-secondary)', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', padding: 0,
              }}
            >
              {rightIcon}
            </button>
          )}
        </div>
        {error && <p style={{ fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>{error}</p>}
        {hint && !error && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
