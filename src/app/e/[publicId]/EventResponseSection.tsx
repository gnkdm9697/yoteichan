'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResponseForm } from '@/components/features/ResponseForm';
import { Button } from '@/components/ui/Button';
import type { ResponseStatus } from '@/types';

interface DateOptionItem {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
}

interface EditingResponse {
  name: string;
  answers: Record<string, ResponseStatus>;
}

interface EventResponseSectionProps {
  eventId: string;
  dateOptions: DateOptionItem[];
  editingResponse?: EditingResponse | null;
  onEditComplete?: () => void;
}

/**
 * ResponseFormをラップするClient Component
 * 回答送信後にrouter.refresh()でServer Componentを再フェッチ
 */
export function EventResponseSection({
  eventId,
  dateOptions,
  editingResponse,
  onEditComplete,
}: EventResponseSectionProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 編集対象が変わったらフォームを開く
  useEffect(() => {
    if (editingResponse) {
      setIsCollapsed(false);
    }
  }, [editingResponse]);

  const handleSubmitSuccess = () => {
    router.refresh();
    setIsCollapsed(true);
    onEditComplete?.();
  };

  const isEditing = !!editingResponse;

  return (
    <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-[var(--shadow-md)] border border-[var(--border)] p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-[var(--text)] mb-5">
        {isEditing ? `${editingResponse.name}さんの回答を編集` : 'あなたの回答'}
      </h2>
      {isCollapsed && !isEditing ? (
        <Button
          variant="secondary"
          onClick={() => setIsCollapsed(false)}
          className="w-full"
        >
          回答を編集する
        </Button>
      ) : (
        <ResponseForm
          key={editingResponse?.name ?? 'new'}
          eventId={eventId}
          dateOptions={dateOptions}
          onSubmitSuccess={handleSubmitSuccess}
          initialName={editingResponse?.name}
          initialAnswers={editingResponse?.answers}
        />
      )}
    </div>
  );
}
