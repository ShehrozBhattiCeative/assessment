'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {label && (
          <label htmlFor={selectId} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
            {label}
            {props.required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          <select
            ref={ref}
            id={selectId}
            className={`input-base${className ? ' ' + className : ''}`}
            style={{
              appearance: 'none',
              paddingRight: 36,
              cursor: 'pointer',
              borderColor: error ? '#ef4444' : undefined,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-light)';
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
              props.onBlur?.(e);
            }}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}
                style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                {opt.label}
              </option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}
        {hint && !error && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
