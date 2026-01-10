'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { PassphraseModal } from '@/components/features/PassphraseModal';
import { EditForm } from '@/components/features/EditForm';
import { ResponseTable } from '@/components/features/ResponseTable';
import { EventResponseSection } from './EventResponseSection';
import type { ResponseStatus } from '@/types';

interface DateOption {
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

interface EventEditSectionProps {
  eventId: string; // public_id
  event: {
    title: string;
    location: string | null;
    description: string | null;
    dateOptions: DateOption[];
    responses: ResponseData[];
    summary: Record<string, SummaryData>;
  };
}

// 日付フォーマット（例: 1/8(水)）
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  return `${month}/${day}(${weekday})`;
}

// 時間帯フォーマット
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

/**
 * イベント編集セクション
 * 編集モード時はEditForm、通常時はイベント詳細をレンダー
 */
export function EventEditSection({
  eventId,
  event,
}: EventEditSectionProps) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passphrase, setPassphrase] = useState('');

  // 編集ボタンクリック → モーダル表示
  const handleEditClick = useCallback(() => {
    setShowModal(true);
  }, []);

  // 認証成功 → 編集モード開始
  const handleAuthSuccess = useCallback((verifiedPassphrase: string) => {
    setPassphrase(verifiedPassphrase);
    setIsEditMode(true);
    setShowModal(false);
  }, []);

  // モーダル閉じる
  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, []);

  // 保存成功 → 編集モード終了、ページ更新
  const handleSave = useCallback(() => {
    setIsEditMode(false);
    setPassphrase('');
    router.refresh();
  }, [router]);

  // キャンセル → 編集モード終了
  const handleCancel = useCallback(() => {
    setIsEditMode(false);
    setPassphrase('');
    router.refresh();
  }, [router]);

  // 削除成功 → ホームへリダイレクト
  const handleDelete = useCallback(() => {
    router.push('/');
  }, [router]);

  // 編集モード時はEditFormのみ表示
  if (isEditMode) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border)] p-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--border)]">
          <span className="text-xl" aria-hidden="true">🔓</span>
          <h2 className="text-lg font-semibold text-[var(--text)]">
            編集モード
          </h2>
        </div>
        <EditForm
          eventId={eventId}
          passphrase={passphrase}
          initialData={{
            title: event.title,
            location: event.location,
            description: event.description,
            dateOptions: event.dateOptions.map((opt) => ({
              date: opt.date,
              startTime: opt.startTime,
              endTime: opt.endTime,
            })),
          }}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  // 通常モード
  return (
    <>
      {/* ヘッダー部分 */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border)] p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
              <span aria-hidden="true">📅</span>
              {event.title}
            </h1>
            {event.location && (
              <p className="mt-2 text-[var(--text-secondary)] flex items-center gap-2">
                <span aria-hidden="true">📍</span>
                {event.location}
              </p>
            )}
            {event.description && (
              <p className="mt-3 text-[var(--text)] whitespace-pre-wrap">
                {event.description}
              </p>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={handleEditClick}>
            編集する
          </Button>
        </div>
      </div>

      {/* 候補日リスト */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border)] p-6 mb-4">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
          候補日
        </h2>
        <ul className="space-y-2">
          {event.dateOptions.map((option) => (
            <li
              key={option.id}
              className="flex items-center gap-2 text-[var(--text)]"
            >
              <span className="text-[var(--text-secondary)]">・</span>
              <span className="font-medium">{formatDate(option.date)}</span>
              <span className="text-[var(--text-secondary)]">
                {formatTimeRange(option.startTime, option.endTime)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 回答フォーム */}
      <div className="mb-4">
        <EventResponseSection
          eventId={eventId}
          dateOptions={event.dateOptions}
        />
      </div>

      {/* 回答一覧 */}
      <ResponseTable
        dateOptions={event.dateOptions}
        responses={event.responses}
        summary={event.summary}
      />

      {/* 合言葉モーダル */}
      <PassphraseModal
        isOpen={showModal}
        eventId={eventId}
        onClose={handleModalClose}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
