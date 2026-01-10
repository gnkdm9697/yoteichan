'use client';

import { useEffect, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const typeStyles: Record<ToastType, { bg: string; icon: string }> = {
  success: {
    bg: 'bg-[var(--ok)] text-white',
    icon: 'M5 13l4 4L19 7',
  },
  error: {
    bg: 'bg-[var(--ng)] text-white',
    icon: 'M6 18L18 6M6 6l12 12',
  },
  info: {
    bg: 'bg-[var(--primary)] text-white',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
};

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, handleClose]);

  if (!isVisible && !isExiting) return null;

  const { bg, icon } = typeStyles[type];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        role="alert"
        aria-live="polite"
        className={`
          flex items-center gap-3 px-5 py-4
          rounded-xl shadow-[var(--shadow-lg)]
          ${bg}
          ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}
        `.trim().replace(/\s+/g, ' ')}
      >
        <svg
          className="w-6 h-6 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        <span className="text-base font-medium">{message}</span>
        <button
          type="button"
          onClick={handleClose}
          className="ml-2 p-2 -mr-1 rounded-lg hover:bg-white/20 active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="閉じる"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
