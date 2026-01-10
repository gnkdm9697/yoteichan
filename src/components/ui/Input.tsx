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
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text)]"
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
            h-11 px-3
            w-full rounded-lg
            border border-[var(--border)]
            bg-[var(--bg)] text-[var(--text)]
            placeholder:text-[var(--text-secondary)]
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[var(--ng)] focus:ring-[var(--ng)]' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-[var(--ng)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
