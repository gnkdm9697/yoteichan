'use client';

import { useCallback } from 'react';

// 曜日の日本語表記
const WEEKDAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'] as const;

interface DateOption {
  date: string; // YYYY-MM-DD
  startTime: string | null;
  endTime: string | null;
}

interface TimeSlotPickerProps {
  dateOptions: DateOption[];
  onUpdate: (dateOptions: DateOption[]) => void;
  onRemoveDate: (date: string) => void;
}

/**
 * 日付を日本語の短い形式でフォーマット
 * @example "2025-01-08" -> "1/8(水)"
 */
function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_NAMES[date.getDay()];
  return `${month}/${day}(${weekday})`;
}

/**
 * 時間帯選択コンポーネント
 * 選択した日付に対して終日/時間指定を設定できる
 */
export function TimeSlotPicker({
  dateOptions,
  onUpdate,
  onRemoveDate,
}: TimeSlotPickerProps) {
  /**
   * 終日チェックボックスの切り替え
   */
  const handleAllDayToggle = useCallback(
    (targetDate: string, isAllDay: boolean) => {
      const updated = dateOptions.map((option) => {
        if (option.date !== targetDate) return option;

        if (isAllDay) {
          // 終日にする場合は時間をクリア
          return { ...option, startTime: null, endTime: null };
        } else {
          // 時間指定にする場合はデフォルト時間を設定
          return { ...option, startTime: '19:00', endTime: '21:00' };
        }
      });
      onUpdate(updated);
    },
    [dateOptions, onUpdate]
  );

  /**
   * 時間の変更
   */
  const handleTimeChange = useCallback(
    (targetDate: string, field: 'startTime' | 'endTime', value: string) => {
      const updated = dateOptions.map((option) => {
        if (option.date !== targetDate) return option;
        return { ...option, [field]: value };
      });
      onUpdate(updated);
    },
    [dateOptions, onUpdate]
  );

  if (dateOptions.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        <p>候補日が選択されていません</p>
        <p className="text-sm mt-1">カレンダーから日付を選択してください</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-[var(--text)]">
        選択した候補日
        <span className="ml-2 text-[var(--text-secondary)] font-normal">
          ({dateOptions.length}件)
        </span>
      </h3>

      <div className="flex flex-col gap-3">
        {dateOptions.map((option) => {
          const isAllDay = option.startTime === null && option.endTime === null;

          return (
            <div
              key={option.date}
              className="
                relative
                border border-[var(--border)] rounded-xl
                bg-[var(--bg)] p-4
                transition-shadow duration-150
                hover:shadow-sm
              "
            >
              {/* ヘッダー: 日付と削除ボタン */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-medium text-[var(--text)]">
                  {formatDateShort(option.date)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveDate(option.date)}
                  className="
                    w-8 h-8
                    flex items-center justify-center
                    rounded-lg
                    text-[var(--text-secondary)]
                    hover:text-[var(--ng)] hover:bg-[var(--ng)]/10
                    transition-colors duration-150
                    focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1
                  "
                  aria-label={`${formatDateShort(option.date)}を削除`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>

              {/* 終日チェックボックス */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={(e) =>
                      handleAllDayToggle(option.date, e.target.checked)
                    }
                    className="
                      peer
                      w-5 h-5
                      rounded
                      border-2 border-[var(--border)]
                      bg-[var(--bg)]
                      appearance-none cursor-pointer
                      transition-colors duration-150
                      checked:bg-[var(--primary)] checked:border-[var(--primary)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1
                    "
                    aria-describedby={`allday-hint-${option.date}`}
                  />
                  {/* チェックマーク */}
                  <svg
                    className="
                      absolute top-0.5 left-0.5
                      w-4 h-4 text-white
                      pointer-events-none
                      opacity-0 peer-checked:opacity-100
                      transition-opacity duration-150
                    "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-[var(--text)]">終日</span>
              </label>

              {/* 時間入力欄（終日でない場合のみ表示） */}
              {!isAllDay && (
                <div
                  className="
                    mt-3 pt-3
                    border-t border-[var(--border)]
                    flex items-center gap-2
                  "
                >
                  <div className="flex-1">
                    <label
                      htmlFor={`start-${option.date}`}
                      className="sr-only"
                    >
                      開始時間
                    </label>
                    <input
                      id={`start-${option.date}`}
                      type="time"
                      value={option.startTime || ''}
                      onChange={(e) =>
                        handleTimeChange(option.date, 'startTime', e.target.value)
                      }
                      className="
                        w-full h-11 px-3
                        rounded-lg
                        border border-[var(--border)]
                        bg-[var(--bg)] text-[var(--text)]
                        text-center text-base
                        transition-colors duration-150
                        focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1
                      "
                    />
                  </div>
                  <span
                    className="text-[var(--text-secondary)] font-medium shrink-0"
                    aria-hidden="true"
                  >
                    〜
                  </span>
                  <div className="flex-1">
                    <label htmlFor={`end-${option.date}`} className="sr-only">
                      終了時間
                    </label>
                    <input
                      id={`end-${option.date}`}
                      type="time"
                      value={option.endTime || ''}
                      onChange={(e) =>
                        handleTimeChange(option.date, 'endTime', e.target.value)
                      }
                      className="
                        w-full h-11 px-3
                        rounded-lg
                        border border-[var(--border)]
                        bg-[var(--bg)] text-[var(--text)]
                        text-center text-base
                        transition-colors duration-150
                        focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1
                      "
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
