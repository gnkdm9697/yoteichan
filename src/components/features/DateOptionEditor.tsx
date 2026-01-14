'use client';

import { useState, useCallback } from 'react';
import { Calendar } from './Calendar';
import { Button } from '@/components/ui';

// 曜日の日本語表記
const WEEKDAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'] as const;

interface DateOption {
  id?: string; // 既存の候補日はIDを持つ
  date: string; // YYYY-MM-DD
  startTime: string | null;
  endTime: string | null;
}

interface DateOptionEditorProps {
  dateOptions: DateOption[];
  onUpdate: (dateOptions: DateOption[]) => void;
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
 * 候補日編集コンポーネント
 * TimeSlotPickerの機能 + Calendarからの日付追加機能
 * 同じ日付を複数持てるため、インデックスベースで識別
 */
export function DateOptionEditor({
  dateOptions,
  onUpdate,
}: DateOptionEditorProps) {
  const [showCalendar, setShowCalendar] = useState(true);

  // 選択中の日付リスト（Calendarに渡す用）
  const selectedDates = dateOptions.map((opt) => opt.date);

  /**
   * 日付の追加（Calendarからの選択）- 常に追加のみ
   */
  const handleDateSelect = useCallback(
    (date: string) => {
      // 常に新規追加（同じ日付でも複数追加可能）
      const newOption: DateOption = {
        date,
        startTime: '19:00',
        endTime: '21:00',
      };
      const updated = [...dateOptions, newOption].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      onUpdate(updated);
    },
    [dateOptions, onUpdate]
  );

  /**
   * 候補日を削除（インデックスベース）
   */
  const handleRemoveDateByIndex = useCallback(
    (targetIndex: number) => {
      onUpdate(dateOptions.filter((_, i) => i !== targetIndex));
    },
    [dateOptions, onUpdate]
  );

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
   * 開始時間の変更（インデックスベース）
   */
  const handleTimeChange = useCallback(
    (targetIndex: number, value: string) => {
      const updated = dateOptions.map((option, i) => {
        if (i !== targetIndex) return option;
        return { ...option, startTime: value };
      });
      onUpdate(updated);
    },
    [dateOptions, onUpdate]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--text)]">
          候補日
          {dateOptions.length > 0 && (
            <span className="ml-2 text-[var(--text-secondary)] font-normal">
              ({dateOptions.length}件)
            </span>
          )}
        </h3>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? 'カレンダーを閉じる' : '候補日を追加'}
        </Button>
      </div>

      {/* カレンダー（候補日追加用） */}
      {showCalendar && (
        <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg-secondary)]">
          <Calendar
            selectedDates={selectedDates}
            onDateSelect={handleDateSelect}
          />
          <p className="text-xs text-[var(--text-secondary)] text-center mt-3">
            日付をクリックして追加
          </p>
        </div>
      )}

      {/* 候補日リスト */}
      {dateOptions.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          <p>候補日が設定されていません</p>
          <p className="text-sm mt-1">
            「候補日を追加」ボタンから日付を選択してください
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {dateOptions.map((option, index) => {
            const isAllDay =
              option.startTime === null && option.endTime === null;

            return (
              <div
                key={index}
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
                    onClick={() => handleRemoveDateByIndex(index)}
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

                {/* 開始時間入力欄（終日でない場合のみ表示） */}
                {!isAllDay && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <label
                      htmlFor={`start-${index}`}
                      className="text-sm text-[var(--text-secondary)] block mb-1"
                    >
                      開始時間
                    </label>
                    <input
                      id={`start-${index}`}
                      type="time"
                      value={option.startTime || ''}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="
                        w-32 h-11 px-3
                        rounded-lg
                        border border-[var(--border)]
                        bg-[var(--bg)] text-[var(--text)]
                        text-center text-base
                        transition-colors duration-150
                        focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-1
                      "
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
