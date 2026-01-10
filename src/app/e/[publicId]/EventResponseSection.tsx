'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResponseForm } from '@/components/features/ResponseForm';
import { Button } from '@/components/ui/Button';

interface DateOptionItem {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
}

interface EventResponseSectionProps {
  eventId: string;
  dateOptions: DateOptionItem[];
}

/**
 * ResponseFormをラップするClient Component
 * 回答送信後にrouter.refresh()でServer Componentを再フェッチ
 */
export function EventResponseSection({ eventId, dateOptions }: EventResponseSectionProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmitSuccess = () => {
    router.refresh();
    setIsCollapsed(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--border)] p-6">
      <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
        あなたの回答
      </h2>
      {isCollapsed ? (
        <Button
          variant="secondary"
          onClick={() => setIsCollapsed(false)}
          className="w-full"
        >
          回答を編集する
        </Button>
      ) : (
        <ResponseForm
          eventId={eventId}
          dateOptions={dateOptions}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
}
