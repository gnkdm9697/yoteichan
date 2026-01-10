'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button, Input, Textarea, ThemeToggle } from '@/components/ui';
import { Calendar, TimeSlotPicker, ShareModal } from '@/components/features';

interface DateOption {
  date: string;
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
}

interface FormErrors {
  name?: string;
  passphrase?: string;
  dates?: string;
}

export default function NewEventPage() {
  // フォーム状態
  const [name, setName] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // モーダル用の状態
  const [showShareModal, setShowShareModal] = useState(false);
  const [createdEventData, setCreatedEventData] = useState<{
    publicId: string;
    shareUrl: string;
  } | null>(null);

  // カレンダーから日付を選択/解除
  const handleDateSelect = useCallback((dateStr: string) => {
    setDateOptions((prev) => {
      const exists = prev.find((opt) => opt.date === dateStr);
      if (exists) {
        // 既に選択済みなら削除
        return prev.filter((opt) => opt.date !== dateStr);
      }
      // 新規追加（19:00-21:00をデフォルト）
      return [...prev, { date: dateStr, startTime: '19:00', endTime: null }].sort(
        (a, b) => a.date.localeCompare(b.date)
      );
    });
    // エラーをクリア
    setErrors((prev) => ({ ...prev, dates: undefined }));
  }, []);

  // 日付オプションの更新
  const handleDateOptionsUpdate = useCallback((updated: DateOption[]) => {
    setDateOptions(updated);
  }, []);

  // 日付の削除
  const handleRemoveDate = useCallback((date: string) => {
    setDateOptions((prev) => prev.filter((opt) => opt.date !== date));
  }, []);

  // バリデーション
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'イベント名を入力してください';
    }

    if (!passphrase.trim()) {
      newErrors.passphrase = '合言葉を入力してください';
    }

    if (dateOptions.length === 0) {
      newErrors.dates = '候補日を1つ以上選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: name.trim(),
          passphrase: passphrase.trim(),
          location: location.trim() || null,
          description: description.trim() || null,
          dateOptions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'イベントの作成に失敗しました');
      }

      const data = await response.json();
      // 共有URLを生成
      const shareUrl = `${window.location.origin}/e/${data.publicId}`;
      setCreatedEventData({
        publicId: data.publicId,
        shareUrl,
      });
      setShowShareModal(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 選択済み日付の配列
  const selectedDates = dateOptions.map((opt) => opt.date);

  return (
    <main className="flex-1 bg-[var(--bg-secondary)] relative">
      {/* テーマトグル */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-lg mx-auto px-5 py-8">
        {/* 戻るリンク */}
        <Link
          href="/"
          className="
            inline-flex items-center gap-2
            min-h-[44px] px-1
            text-base text-[var(--text-secondary)]
            hover:text-[var(--text)]
            transition-colors duration-150
            mb-6
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          戻る
        </Link>

        {/* ページタイトル */}
        <h1 className="text-3xl font-bold text-[var(--text)] mb-8">
          イベントを作成
        </h1>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* イベント名 */}
          <Input
            label="イベント名"
            required
            placeholder="例: 飲み会"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
          />

          {/* 合言葉 */}
          <div>
            <Input
              label="合言葉"
              required
              placeholder="例: ひみつ123"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                setErrors((prev) => ({ ...prev, passphrase: undefined }));
              }}
              error={errors.passphrase}
            />
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              ※編集時に必要です
            </p>
          </div>

          {/* 候補日選択 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <label className="text-base font-medium text-[var(--text)]">
                候補日を選択
                <span className="text-[var(--ng)] ml-1" aria-hidden="true">
                  *
                </span>
              </label>
            </div>

            {/* カレンダー */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow-sm)]">
              <Calendar
                selectedDates={selectedDates}
                onDateSelect={handleDateSelect}
              />
            </div>

            {/* 候補日エラー */}
            {errors.dates && (
              <p className="text-base text-[var(--ng)]" role="alert">
                {errors.dates}
              </p>
            )}

            {/* 時間帯選択 */}
            <TimeSlotPicker
              dateOptions={dateOptions}
              onUpdate={handleDateOptionsUpdate}
              onRemoveDate={handleRemoveDate}
            />
          </div>

          {/* 場所 */}
          <Input
            label="場所"
            placeholder="例: 新宿駅周辺"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* 説明 */}
          <Textarea
            label="説明"
            placeholder="イベントの詳細を入力してください"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          {/* 送信ボタン */}
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            className="w-full mt-2"
          >
            イベントを作成
          </Button>
        </form>
      </div>

      {/* 作成完了モーダル */}
      {createdEventData && (
        <ShareModal
          isOpen={showShareModal}
          shareUrl={createdEventData.shareUrl}
          publicId={createdEventData.publicId}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </main>
  );
}
