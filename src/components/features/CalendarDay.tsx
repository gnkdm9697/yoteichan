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
    w-11 h-11 min-w-[44px] min-h-[44px]
    rounded-full
    text-sm font-medium
    transition-all duration-150
    select-none
  `;

  const stateStyles = isDisabled
    ? 'text-[var(--text-secondary)] opacity-40 cursor-not-allowed'
    : isSelected
      ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
      : isToday
        ? 'bg-[var(--bg-secondary)] text-[var(--primary)] font-bold ring-2 ring-[var(--primary)] ring-inset hover:bg-[var(--border)]'
        : 'text-[var(--text)] hover:bg-[var(--bg-secondary)]';

  const focusStyles = !isDisabled
    ? 'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-2'
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
