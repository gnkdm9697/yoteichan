'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusButton } from '@/components/features/StatusButton';
import type { ResponseStatus } from '@/types';

interface DateOptionItem {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
}

interface ResponseFormProps {
  eventId: string;
  dateOptions: DateOptionItem[];
  onSubmitSuccess: () => void;
}

// 曜日の日本語表記
const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

// 日付を「1/8(水)」形式にフォーマット
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = dayNames[date.getDay()];
  return `${month}/${day}(${dayOfWeek})`;
}

// 時間帯を表示用にフォーマット
function formatTimeRange(startTime: string | null, endTime: string | null): string {
  if (!startTime && !endTime) {
    return '終日';
  }
  if (startTime && endTime) {
    return `${startTime}〜${endTime}`;
  }
  if (startTime) {
    return `${startTime}〜`;
  }
  return `〜${endTime}`;
}

export function ResponseForm({ eventId, dateOptions, onSubmitSuccess }: ResponseFormProps) {
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Record<string, ResponseStatus | null>>(
    () => Object.fromEntries(dateOptions.map((opt) => [opt.id, null]))
  );
  const [errors, setErrors] = useState<{ name?: string; answers?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (dateOptionId: string, status: ResponseStatus) => {
    setAnswers((prev) => ({ ...prev, [dateOptionId]: status }));
    // 回答エラーをクリア
    if (errors.answers) {
      setErrors((prev) => ({ ...prev, answers: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; answers?: string } = {};

    if (!name.trim()) {
      newErrors.name = '名前を入力してください';
    }

    const unanswered = dateOptions.filter((opt) => answers[opt.id] === null);
    if (unanswered.length > 0) {
      newErrors.answers = 'すべての日程に回答してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // APIが期待する形式: { name, answers: Record<string, 'ok' | 'maybe' | 'ng'> }
      const answersRecord: Record<string, ResponseStatus> = {};
      for (const opt of dateOptions) {
        answersRecord[opt.id] = answers[opt.id] as ResponseStatus;
      }
      const payload = {
        name: name.trim(),
        answers: answersRecord,
      };

      const res = await fetch(`/api/events/${eventId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('送信に失敗しました');
      }

      onSubmitSuccess();
    } catch (error) {
      console.error('Response submit error:', error);
      setErrors({ answers: '送信に失敗しました。もう一度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 名前入力 */}
      <Input
        label="あなたの名前"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) {
            setErrors((prev) => ({ ...prev, name: undefined }));
          }
        }}
        placeholder="田中"
        required
        error={errors.name}
      />

      {/* 日程回答 */}
      <div className="flex flex-col gap-4">
        {dateOptions.map((option) => (
          <div key={option.id} className="flex flex-col gap-2">
            <div className="text-sm font-medium text-[var(--text)]">
              <span className="text-base">{formatDate(option.date)}</span>
              <span className="ml-2 text-[var(--text-secondary)]">
                {formatTimeRange(option.startTime, option.endTime)}
              </span>
            </div>
            <StatusButton
              status={answers[option.id]}
              onSelect={(status) => handleStatusChange(option.id, status)}
            />
          </div>
        ))}
      </div>

      {/* 回答エラー表示 */}
      {errors.answers && (
        <p className="text-sm text-[var(--ng)]" role="alert">
          {errors.answers}
        </p>
      )}

      {/* 送信ボタン */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        回答する
      </Button>
    </form>
  );
}
