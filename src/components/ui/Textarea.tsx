'use client';

import { type TextareaHTMLAttributes, forwardRef, useId } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, rows = 4, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            px-3 py-2.5
            w-full rounded-lg
            border border-[var(--border)]
            bg-[var(--bg)] text-[var(--text)]
            placeholder:text-[var(--text-secondary)]
            transition-colors duration-150
            resize-y
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

Textarea.displayName = 'Textarea';
