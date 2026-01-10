import { ResponseStatus } from '@/types';
import { ResponseRow } from './ResponseRow';
import { SummaryRow } from './SummaryRow';

interface DateOptionDisplay {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
}

interface ResponseData {
  name: string;
  answers: Record<string, ResponseStatus>;
}

interface SummaryData {
  ok: number;
  maybe: number;
  ng: number;
}

interface ResponseTableProps {
  dateOptions: DateOptionDisplay[];
  responses: ResponseData[];
  summary: Record<string, SummaryData>;
}

/**
 * 日付文字列を短縮形式に変換
 * 例: "2024-01-08" -> "1/8"
 */
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * 時間範囲をフォーマット
 * 例: "09:00", "12:00" -> "9:00-12:00"
 */
function formatTimeRange(startTime: string | null, endTime: string | null): string | null {
  if (!startTime) return null;
  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    return `${parseInt(h)}:${m}`;
  };
  if (endTime) {
    return `${formatTime(startTime)}-${formatTime(endTime)}`;
  }
  return formatTime(startTime);
}

/**
 * 最適な日程（○が最も多い）を計算
 */
function findBestDates(summary: Record<string, SummaryData>): string[] {
  const entries = Object.entries(summary);
  if (entries.length === 0) return [];

  const maxOk = Math.max(...entries.map(([, counts]) => counts.ok));
  if (maxOk === 0) return [];

  return entries
    .filter(([, counts]) => counts.ok === maxOk)
    .map(([id]) => id);
}

/**
 * 回答一覧テーブルコンポーネント
 * 参加者全員の回答を一覧表示し、集計結果を表示
 */
export function ResponseTable({ dateOptions, responses, summary }: ResponseTableProps) {
  const dateOptionIds = dateOptions.map((opt) => opt.id);
  const bestDateIds = findBestDates(summary);
  const totalResponses = responses.length;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden shadow-sm">
      {/* ヘッダー */}
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <h2 className="text-base font-semibold text-[var(--text)]">
          みんなの回答
          <span className="ml-2 text-sm font-normal text-[var(--text-secondary)]">
            ({totalResponses}人)
          </span>
        </h2>
      </div>

      {/* テーブル本体 */}
      {totalResponses === 0 ? (
        <div className="px-4 py-8 text-center text-[var(--text-secondary)]">
          まだ回答がありません
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="sticky left-0 z-10 bg-[var(--bg)] px-3 py-2.5 text-left text-sm font-semibold text-[var(--text)]">
                  名前
                </th>
                {dateOptions.map((option) => {
                  const isBestDate = bestDateIds.includes(option.id);
                  const timeRange = formatTimeRange(option.startTime, option.endTime);

                  return (
                    <th
                      key={option.id}
                      className={`
                        px-3 py-2.5 text-center text-sm font-semibold
                        transition-colors duration-200
                        ${isBestDate ? 'bg-[var(--ok)]/10 text-[var(--ok)]' : 'text-[var(--text)]'}
                      `.trim().replace(/\s+/g, ' ')}
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span>{formatDateShort(option.date)}</span>
                        {timeRange && (
                          <span className="text-xs font-normal text-[var(--text-secondary)]">
                            {timeRange}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <ResponseRow
                  key={response.name}
                  name={response.name}
                  answers={response.answers}
                  dateOptionIds={dateOptionIds}
                />
              ))}
              <SummaryRow
                summary={summary}
                dateOptionIds={dateOptionIds}
                bestDateIds={bestDateIds}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
