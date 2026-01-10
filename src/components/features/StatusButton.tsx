'use client';

type StatusValue = 'ok' | 'maybe' | 'ng';

interface StatusButtonProps {
  status: StatusValue | null;
  onSelect: (status: StatusValue) => void;
}

const statusConfig: Record<StatusValue, { label: string; color: string; activeColor: string }> = {
  ok: {
    label: '○',
    color: 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--ok)] hover:text-[var(--ok)]',
    activeColor: 'bg-[var(--ok)] text-white border-[var(--ok)]',
  },
  maybe: {
    label: '△',
    color: 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--maybe)] hover:text-[var(--maybe)]',
    activeColor: 'bg-[var(--maybe)] text-white border-[var(--maybe)]',
  },
  ng: {
    label: '×',
    color: 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--ng)] hover:text-[var(--ng)]',
    activeColor: 'bg-[var(--ng)] text-white border-[var(--ng)]',
  },
};

const statusOrder: StatusValue[] = ['ok', 'maybe', 'ng'];

export function StatusButton({ status, onSelect }: StatusButtonProps) {
  return (
    <div className="inline-flex" role="group" aria-label="回答選択">
      {statusOrder.map((value, index) => {
        const config = statusConfig[value];
        const isActive = status === value;
        const isFirst = index === 0;
        const isLast = index === statusOrder.length - 1;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={isActive}
            className={`
              w-11 h-11 text-xl font-medium
              border-2 transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1
              ${isFirst ? 'rounded-l-lg' : ''}
              ${isLast ? 'rounded-r-lg' : ''}
              ${!isFirst ? '-ml-0.5' : ''}
              ${isActive ? config.activeColor : config.color}
            `.trim().replace(/\s+/g, ' ')}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
