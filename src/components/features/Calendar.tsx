'use client';

import { useState, useMemo, useCallback } from 'react';
import { CalendarDay } from './CalendarDay';

interface CalendarProps {
  selectedDates: string[];
  onDateSelect: (date: string) => void;
  minDate?: string;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

// 日付を "YYYY-MM-DD" 形式にフォーマット
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 今日の日付を取得（時間を00:00:00にリセット）
function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// 指定月の日数を取得
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// 指定月の1日の曜日を取得（0: 日曜日）
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function Calendar({
  selectedDates,
  onDateSelect,
  minDate,
}: CalendarProps) {
  const today = useMemo(() => getToday(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // 最小日付（デフォルトは今日）
  const minDateObj = useMemo(() => {
    if (minDate) {
      const [year, month, day] = minDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return today;
  }, [minDate, today]);

  // 選択中の日付をSetで管理（検索を高速化）
  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates]);

  // 今日の日付文字列
  const todayStr = useMemo(() => formatDate(today), [today]);

  // 月のカレンダーデータを生成
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: (number | null)[] = [];

    // 月初の空白
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 日付
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [currentYear, currentMonth]);

  // 前月へ移動
  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  // 次月へ移動
  const goToNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  // 日付選択ハンドラ
  const handleDateClick = useCallback(
    (day: number) => {
      const dateStr = formatDate(new Date(currentYear, currentMonth, day));
      onDateSelect(dateStr);
    },
    [currentYear, currentMonth, onDateSelect]
  );

  // 日付が選択不可かどうか判定
  const isDateDisabled = useCallback(
    (day: number): boolean => {
      const date = new Date(currentYear, currentMonth, day);
      return date < minDateObj;
    },
    [currentYear, currentMonth, minDateObj]
  );

  // 日付が選択中かどうか判定
  const isDateSelected = useCallback(
    (day: number): boolean => {
      const dateStr = formatDate(new Date(currentYear, currentMonth, day));
      return selectedSet.has(dateStr);
    },
    [currentYear, currentMonth, selectedSet]
  );

  // 日付が今日かどうか判定
  const isDateToday = useCallback(
    (day: number): boolean => {
      const dateStr = formatDate(new Date(currentYear, currentMonth, day));
      return dateStr === todayStr;
    },
    [currentYear, currentMonth, todayStr]
  );

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      {/* ヘッダー（ナビゲーション） */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="
            flex items-center justify-center
            w-11 h-11 min-w-[44px] min-h-[44px]
            rounded-full
            text-[var(--text-secondary)]
            hover:bg-[var(--bg-secondary)]
            focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-2
            transition-colors duration-150
          "
          aria-label="前月"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-[var(--text)]">
          {currentYear}年{currentMonth + 1}月
        </h2>

        <button
          type="button"
          onClick={goToNextMonth}
          className="
            flex items-center justify-center
            w-11 h-11 min-w-[44px] min-h-[44px]
            rounded-full
            text-[var(--text-secondary)]
            hover:bg-[var(--bg-secondary)]
            focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-2
            transition-colors duration-150
          "
          aria-label="次月"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((weekday, index) => (
          <div
            key={weekday}
            className={`
              flex items-center justify-center
              h-8
              text-xs font-medium
              ${index === 0 ? 'text-[var(--ng)]' : index === 6 ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}
            `}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="カレンダー">
        {calendarDays.map((day, index) => (
          <div key={index} className="flex items-center justify-center">
            {day !== null ? (
              <CalendarDay
                day={day}
                isSelected={isDateSelected(day)}
                isToday={isDateToday(day)}
                isDisabled={isDateDisabled(day)}
                onClick={() => !isDateDisabled(day) && handleDateClick(day)}
              />
            ) : (
              <div className="w-11 h-11" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
