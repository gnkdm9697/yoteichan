'use client';

interface CalendarDayProps {
  day: number;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export function CalendarDay({
  day,
  isSelected,
  isToday,
  isDisabled,
  onClick,
}: CalendarDayProps) {
  const baseStyles = `
    flex items-center justify-center
    w-12 h-12 min-w-[48px] min-h-[48px]
    rounded-full
    text-base font-medium
    transition-all duration-150
    select-none
    active:scale-95
  `;

  const stateStyles = isDisabled
    ? 'text-[var(--text-muted)] opacity-40 cursor-not-allowed active:scale-100'
    : isSelected
      ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md'
      : isToday
        ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold ring-2 ring-[var(--primary)] ring-inset hover:bg-[var(--primary)]/20'
        : 'text-[var(--text)] hover:bg-[var(--bg-secondary)]';

  const focusStyles = !isDisabled
    ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2'
    : '';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-current={isToday ? 'date' : undefined}
      className={`${baseStyles} ${stateStyles} ${focusStyles}`.trim().replace(/\s+/g, ' ')}
    >
      {day}
    </button>
  );
}
