'use client';

import { type InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-base font-medium text-[var(--text)]"
          >
            {label}
            {required && (
              <span className="text-[var(--ng)] ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            min-h-[52px] px-4 text-lg
            w-full rounded-xl
            border border-[var(--border)]
            bg-[var(--bg-elevated)] text-[var(--text)]
            placeholder:text-[var(--text-muted)]
            transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[var(--ng)] focus-visible:ring-[var(--ng)]' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-base text-[var(--ng)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
