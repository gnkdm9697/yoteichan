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
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            px-4 py-3 text-lg
            w-full rounded-xl
            border border-[var(--border)]
            bg-[var(--bg-elevated)] text-[var(--text)]
            placeholder:text-[var(--text-muted)]
            transition-all duration-150
            resize-y
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

Textarea.displayName = 'Textarea';
