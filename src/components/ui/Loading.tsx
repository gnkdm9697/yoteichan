'use client';

type LoadingSize = 'sm' | 'md' | 'lg';

interface LoadingProps {
  size?: LoadingSize;
  className?: string;
}

const sizeStyles: Record<LoadingSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function Loading({ size = 'md', className = '' }: LoadingProps) {
  return (
    <div
      role="status"
      aria-label="読み込み中"
      className={`${sizeStyles[size]} ${className}`.trim()}
    >
      <svg
        className="w-full h-full animate-spinner"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="var(--primary)"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="var(--primary)"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
}
