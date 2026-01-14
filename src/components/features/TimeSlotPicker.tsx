'use client';

import { useCallback, useState, useEffect, useRef } from 'react';

// 曜日の日本語表記
const WEEKDAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'] as const;

interface DateOption {
  date: string; // YYYY-MM-DD
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
}

interface TimeSlotPickerProps {
  dateOptions: DateOption[];
  onUpdate: (dateOptions: DateOption[]) => void;
  onRemoveDateByIndex: (index: number) => void;
}

/**
 * 日付を日本語の短い形式でフォーマット
 */
function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_NAMES[date.getDay()];
  return `${month}/${day}(${weekday})`;
}

/**
 * 時間帯フォーマット
 */
function formatTimeRange(startTime: string | null, endTime: string | null): string {
  if (!startTime && !endTime) return '終日';
  if (startTime && endTime) return `${startTime}〜${endTime}`;
  if (startTime) return `${startTime}〜`;
  return `〜${endTime}`;
}

/**
 * 時間帯選択コンポーネント
 * 選択した日付に対して終日/時間指定を設定できる
 * 同じ日付を複数持てるため、インデックスベースで識別
 */
export function TimeSlotPicker({
  dateOptions,
  onUpdate,
  onRemoveDateByIndex,
}: TimeSlotPickerProps) {
  // 展開中のインデックスを管理
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // 前回の件数を保持（新規追加検出用）
  const prevLengthRef = useRef<number>(0);

  // 新しい候補が追加されたら自動的に展開
  useEffect(() => {
    if (dateOptions.length > prevLengthRef.current) {
      // 新規追加された → 最後の要素を展開
      setExpandedIndex(dateOptions.length - 1);
    }
    prevLengthRef.current = dateOptions.length;
  }, [dateOptions.length]);

  /**
   * 終日チェックボックスの切り替え（インデックスベース）
   */
  const handleAllDayToggle = useCallback(
    (targetIndex: number, isAllDay: boolean) => {
      const updated = dateOptions.map((option, i) => {
        if (i !== targetIndex) return option;

        if (isAllDay) {
          return { ...option, startTime: null };
        } else {
          return { ...option, startTime: '19:00' };
        }
      });
      onUpdate(updated);
    },
    [dateOptions, onUpdate]
  );

  /**
   * 時間の変更（インデックスベース）
   */
  const handleTimeChange = useCallback(
    (targetIndex: number, field: 'startTime' | 'endTime', value: string) => {
      const updated = dateOptions.map((option, i) => {
        if (i !== targetIndex) return option;
        return { ...option, [field]: value };
      });
      onUpdate(updated);
    },
    [dateOptions, onUpdate]
  );

  /**
   * タイトルの変更（インデックスベース）
   */
  const handleTitleChange = useCallback(
    (targetIndex: number, title: string) => {
      const updated = dateOptions.map((option, i) => {
        if (i !== targetIndex) return option;
        return { ...option, title: title || null };
      });
      onUpdate(updated);
    },
    [dateOptions, onUpdate]
  );

  if (dateOptions.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        <p>候補日が選択されていません</p>
        <p className="text-sm mt-1">カレンダーから日付をクリックして追加してください</p>
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

      {/* 1枚のカードにリスト表示 */}
      <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg)]">
        {dateOptions.map((option, index) => {
          const isAllDay = option.startTime === null && option.endTime === null;
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className={`
                ${index % 2 === 0 ? 'bg-[var(--bg)]' : 'bg-[var(--bg-secondary)]'}
                ${index !== dateOptions.length - 1 ? 'border-b border-[var(--border)]' : ''}
              `}
            >
              {/* 行: 日付・時間・タイトル・削除ボタン */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* 日付と時間 */}
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="flex-1 flex items-center gap-2 text-left hover:opacity-70 transition-opacity"
                >
                  <span className="font-medium text-[var(--text)]">
                    {formatDateShort(option.date)}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {formatTimeRange(option.startTime, option.endTime)}
                  </span>
                  {option.title && (
                    <span className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded">
                      {option.title}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 削除ボタン */}
                <button
                  type="button"
                  onClick={() => onRemoveDateByIndex(index)}
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

              {/* 展開時: 詳細設定 */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 space-y-3">
                  {/* タイトル入力 */}
                  <div>
                    <label htmlFor={`title-${index}`} className="text-xs text-[var(--text-secondary)] block mb-1">
                      タイトル（任意）
                    </label>
                    <input
                      id={`title-${index}`}
                      type="text"
                      value={option.title || ''}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      placeholder="Day1、昼の部など"
                      className="
                        w-full h-10 px-3
                        rounded-lg
                        border border-[var(--border)]
                        bg-[var(--bg)] text-[var(--text)]
                        text-sm
                        placeholder:text-[var(--text-muted)]
                        transition-colors duration-150
                        focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1
                      "
                    />
                  </div>

                  {/* 終日チェックボックス */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isAllDay}
                        onChange={(e) =>
                          handleAllDayToggle(index, e.target.checked)
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
                      />
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

                  {/* 開始時間入力欄 */}
                  {!isAllDay && (
                    <div>
                      <label htmlFor={`start-${index}`} className="text-xs text-[var(--text-secondary)] block mb-1">
                        開始時間
                      </label>
                      <input
                        id={`start-${index}`}
                        type="time"
                        value={option.startTime || ''}
                        onChange={(e) =>
                          handleTimeChange(index, 'startTime', e.target.value)
                        }
                        className="
                          w-32 h-10 px-3
                          rounded-lg
                          border border-[var(--border)]
                          bg-[var(--bg)] text-[var(--text)]
                          text-center text-sm
                          transition-colors duration-150
                          focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1
                        "
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
