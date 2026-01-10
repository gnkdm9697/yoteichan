'use client';

type StatusValue = 'ok' | 'maybe' | 'ng';

interface StatusButtonProps {
  status: StatusValue | null;
  onSelect: (status: StatusValue) => void;
}

const statusConfig: Record<StatusValue, { label: string; color: string; activeColor: string }> = {
  ok: {
    label: '○',
    color: 'bg-[var(--ok-light)] border-[var(--ok)]/30 text-[var(--ok)] hover:border-[var(--ok)] hover:bg-[var(--ok)]/20',
    activeColor: 'bg-[var(--ok)] text-white border-[var(--ok)] shadow-md',
  },
  maybe: {
    label: '△',
    color: 'bg-[var(--maybe-light)] border-[var(--maybe)]/30 text-[var(--maybe)] hover:border-[var(--maybe)] hover:bg-[var(--maybe)]/20',
    activeColor: 'bg-[var(--maybe)] text-white border-[var(--maybe)] shadow-md',
  },
  ng: {
    label: '×',
    color: 'bg-[var(--ng-light)] border-[var(--ng)]/30 text-[var(--ng)] hover:border-[var(--ng)] hover:bg-[var(--ng)]/20',
    activeColor: 'bg-[var(--ng)] text-white border-[var(--ng)] shadow-md',
  },
};

const statusOrder: StatusValue[] = ['ok', 'maybe', 'ng'];

export function StatusButton({ status, onSelect }: StatusButtonProps) {
  return (
    <div className="inline-flex gap-2" role="group" aria-label="回答選択">
      {statusOrder.map((value) => {
        const config = statusConfig[value];
        const isActive = status === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={isActive}
            className={`
              w-14 h-14 text-3xl font-medium
              border-2 rounded-xl
              transition-all duration-150
              active:scale-95
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2
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
