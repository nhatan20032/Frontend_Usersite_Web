import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'underline';
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', error, icon, rightElement, className = '', disabled, id, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const describedBy = error ? errorId : ariaDescribedBy;

    if (variant === 'underline') {
      return (
        <div className="relative w-full">
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full bg-transparent border-0 border-b-2 border-[var(--google-blue)]/80 pb-2 text-xl font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--google-blue)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              error ? 'border-red-400 focus:border-red-400' : ''
            } ${className}`}
            {...props}
          />
          {error && <p id={errorId} role="alert" className="text-[11px] text-red-400 mt-1">{error}</p>}
        </div>
      );
    }

    return (
      <div className="relative w-full">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-[var(--text-secondary)] pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full h-9 bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:outline-none focus:border-[var(--google-blue)] focus:ring-1 focus:ring-[var(--google-blue)] disabled:opacity-50 disabled:cursor-not-allowed ${
              icon ? 'pl-9 pr-3' : 'px-3'
            } ${rightElement ? 'pr-9' : ''} ${
              error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2.5 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p id={errorId} role="alert" className="text-[11px] text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
