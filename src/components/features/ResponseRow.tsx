type ResponseStatus = 'ok' | 'maybe' | 'ng';

interface ResponseRowProps {
  name: string;
  answers: Record<string, ResponseStatus>;
  dateOptionIds: string[];
}

const statusDisplay: Record<ResponseStatus, { label: string; colorClass: string }> = {
  ok: {
    label: '○',
    colorClass: 'text-[var(--ok)]',
  },
  maybe: {
    label: '△',
    colorClass: 'text-[var(--maybe)]',
  },
  ng: {
    label: '×',
    colorClass: 'text-[var(--ng)]',
  },
};

/**
 * 参加者行コンポーネント
 * 各候補日の回答を○/△/×で表示
 */
export function ResponseRow({ name, answers, dateOptionIds }: ResponseRowProps) {
  return (
    <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)]/50 transition-colors duration-150">
      <td className="sticky left-0 z-10 bg-[var(--bg-elevated)] px-4 py-3 text-base font-medium text-[var(--text)] whitespace-nowrap">
        {name}
      </td>
      {dateOptionIds.map((dateOptionId) => {
        const status = answers[dateOptionId];
        const display = status ? statusDisplay[status] : null;

        return (
          <td
            key={dateOptionId}
            className="px-4 py-3 text-center"
          >
            {display ? (
              <span className={`text-2xl font-semibold ${display.colorClass}`}>
                {display.label}
              </span>
            ) : (
              <span className="text-lg text-[var(--text-muted)]">-</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}
