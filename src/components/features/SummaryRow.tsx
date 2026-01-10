interface SummaryRowProps {
  summary: Record<string, { ok: number; maybe: number; ng: number }>;
  dateOptionIds: string[];
  bestDateIds: string[];
}

/**
 * 集計行コンポーネント
 * 各候補日の○/△/×の人数を表示
 */
export function SummaryRow({ summary, dateOptionIds, bestDateIds }: SummaryRowProps) {
  return (
    <tr className="bg-[var(--bg-secondary)] border-t-2 border-[var(--border)]">
      <td className="sticky left-0 z-10 bg-[var(--bg-secondary)] px-4 py-3 text-base font-semibold text-[var(--text)]">
        集計
      </td>
      {dateOptionIds.map((dateOptionId) => {
        const counts = summary[dateOptionId] || { ok: 0, maybe: 0, ng: 0 };
        const isBestDate = bestDateIds.includes(dateOptionId);

        return (
          <td
            key={dateOptionId}
            className={`
              px-4 py-3 text-center text-sm font-medium
              transition-colors duration-200
              ${isBestDate ? 'bg-[var(--ok)]/10' : ''}
            `.trim().replace(/\s+/g, ' ')}
          >
            <div className="flex items-center justify-center gap-1">
              <span className="text-[var(--ok)] font-semibold">{counts.ok}</span>
              <span className="text-[var(--text-muted)]">/</span>
              <span className="text-[var(--maybe)] font-semibold">{counts.maybe}</span>
              <span className="text-[var(--text-muted)]">/</span>
              <span className="text-[var(--ng)] font-semibold">{counts.ng}</span>
            </div>
          </td>
        );
      })}
    </tr>
  );
}
