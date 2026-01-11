import { ResponseStatus } from '@/types';

interface DateOptionDisplay {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
}

// 回答データ（ステータスと備考）
interface AnswerData {
  status: ResponseStatus;
  notes: string | null;
}

interface ResponseData {
  name: string;
  answers: Record<string, AnswerData>;
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
  onNameClick?: (name: string, answers: Record<string, AnswerData>) => void;
}

const statusDisplay: Record<ResponseStatus, { label: string; colorClass: string }> = {
  ok: { label: '○', colorClass: 'text-[var(--ok)]' },
  maybe: { label: '△', colorClass: 'text-[var(--maybe)]' },
  ng: { label: '×', colorClass: 'text-[var(--ng)]' },
};

/**
 * 日付文字列を短縮形式に変換
 */
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * 曜日を取得
 */
function getWeekday(dateStr: string): string {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const date = new Date(dateStr);
  return weekdays[date.getDay()];
}

/**
 * 時間範囲をフォーマット
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
 * 回答一覧テーブルコンポーネント（転置版）
 * 行=日付、列=参加者 の構造
 */
export function ResponseTable({ dateOptions, responses, summary, onNameClick }: ResponseTableProps) {
  const bestDateIds = findBestDates(summary);
  const totalResponses = responses.length;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden shadow-[var(--shadow-md)]">
      {/* ヘッダー */}
      <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          みんなの回答
          <span className="ml-2 text-base font-normal text-[var(--text-secondary)]">
            ({totalResponses}人)
          </span>
        </h2>
      </div>

      {/* テーブル本体 */}
      {totalResponses === 0 ? (
        <div className="px-5 py-10 text-center text-lg text-[var(--text-secondary)]">
          まだ回答がありません
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            {/* ヘッダー: 日付 | 参加者名... | 集計 */}
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="sticky left-0 z-10 bg-[var(--bg-elevated)] px-4 py-3 text-left text-base font-semibold text-[var(--text)]">
                  日程
                </th>
                {responses.map((response) => (
                  <th
                    key={response.name}
                    className="px-4 py-3 text-center text-base font-semibold text-[var(--text)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                    onClick={() => onNameClick?.(response.name, response.answers)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onNameClick?.(response.name, response.answers);
                      }
                    }}
                  >
                    {response.name}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-base font-semibold text-[var(--text)] bg-[var(--bg-secondary)]">
                  集計
                </th>
              </tr>
            </thead>
            {/* ボディ: 各日付の行 */}
            <tbody>
              {dateOptions.map((option) => {
                const isBestDate = bestDateIds.includes(option.id);
                const timeRange = formatTimeRange(option.startTime, option.endTime);
                const counts = summary[option.id] || { ok: 0, maybe: 0, ng: 0 };

                return (
                  <tr
                    key={option.id}
                    className={`
                      border-b border-[var(--border)] transition-colors duration-150
                      ${isBestDate ? 'bg-[var(--ok)]/5' : 'hover:bg-[var(--bg-secondary)]/50'}
                    `.trim().replace(/\s+/g, ' ')}
                  >
                    {/* 日付セル */}
                    <td className={`
                      sticky left-0 z-10 px-4 py-3 whitespace-nowrap
                      ${isBestDate ? 'bg-[var(--ok)]/10' : 'bg-[var(--bg-elevated)]'}
                    `.trim().replace(/\s+/g, ' ')}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-medium ${isBestDate ? 'text-[var(--ok)]' : 'text-[var(--text)]'}`}>
                            {formatDateShort(option.date)}
                            <span className="text-sm ml-1">({getWeekday(option.date)})</span>
                          </span>
                          {option.title && (
                            <span className="text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded">
                              {option.title}
                            </span>
                          )}
                        </div>
                        {timeRange && (
                          <span className="text-sm text-[var(--text-secondary)]">
                            {timeRange}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 各参加者の回答セル */}
                    {responses.map((response) => {
                      const answer = response.answers[option.id];
                      const status = answer?.status;
                      const notes = answer?.notes;
                      const display = status ? statusDisplay[status] : null;

                      return (
                        <td key={response.name} className="px-4 py-3 text-center">
                          {display ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className={`text-2xl font-semibold ${display.colorClass}`}>
                                {display.label}
                              </span>
                              {notes && (
                                <span className="text-xs text-[var(--text-secondary)] break-words">
                                  {notes}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-lg text-[var(--text-muted)]">-</span>
                          )}
                        </td>
                      );
                    })}

                    {/* 集計セル */}
                    <td className={`
                      px-4 py-3 text-center text-sm font-medium bg-[var(--bg-secondary)]
                      ${isBestDate ? 'bg-[var(--ok)]/10' : ''}
                    `.trim().replace(/\s+/g, ' ')}>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[var(--ok)] font-semibold">{counts.ok}</span>
                        <span className="text-[var(--text-muted)]">/</span>
                        <span className="text-[var(--maybe)] font-semibold">{counts.maybe}</span>
                        <span className="text-[var(--text-muted)]">/</span>
                        <span className="text-[var(--ng)] font-semibold">{counts.ng}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
