'use client';

import { useState, useCallback } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DateOptionEditor } from './DateOptionEditor';

interface DateOption {
  date: string;
  startTime: string | null;
  endTime: string | null;
}

interface EditFormProps {
  eventId: string; // public_id
  passphrase: string; // 認証済みの合言葉
  initialData: {
    title: string;
    location: string | null;
    description: string | null;
    dateOptions: DateOption[];
  };
  onSave: () => void; // 保存成功時
  onCancel: () => void; // 編集キャンセル時
  onDelete: () => void; // 削除成功時
}

/**
 * イベント編集フォームコンポーネント
 */
export function EditForm({
  eventId,
  passphrase,
  initialData,
  onSave,
  onCancel,
  onDelete,
}: EditFormProps) {
  // フォーム状態
  const [title, setTitle] = useState(initialData.title);
  const [location, setLocation] = useState(initialData.location || '');
  const [description, setDescription] = useState(
    initialData.description || ''
  );
  const [dateOptions, setDateOptions] = useState<DateOption[]>(
    initialData.dateOptions
  );

  // UI状態
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 変更を保存
   */
  const handleSave = useCallback(async () => {
    // バリデーション
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    if (dateOptions.length === 0) {
      setError('候補日を1つ以上追加してください');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passphrase,
          title: title.trim(),
          location: location.trim() || null,
          description: description.trim() || null,
          dateOptions,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '保存に失敗しました');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }, [eventId, passphrase, title, location, description, dateOptions, onSave]);

  /**
   * イベントを削除
   */
  const handleDelete = useCallback(async () => {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passphrase }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '削除に失敗しました');
      }

      onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }, [eventId, passphrase, onDelete]);

  return (
    <div className="flex flex-col gap-6">
      {/* エラー表示 */}
      {error && (
        <div
          className="
            p-4 rounded-lg
            bg-[var(--ng)]/10 border border-[var(--ng)]/20
            text-[var(--ng)] text-sm
          "
          role="alert"
        >
          {error}
        </div>
      )}

      {/* 基本情報 */}
      <div className="flex flex-col gap-4">
        <Input
          label="イベント名"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 忘年会"
        />

        <Input
          label="場所"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="例: 渋谷駅周辺"
        />

        <Textarea
          label="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="イベントの詳細や備考など"
          rows={3}
        />
      </div>

      {/* 候補日編集 */}
      <div className="border-t border-[var(--border)] pt-6">
        <DateOptionEditor dateOptions={dateOptions} onUpdate={setDateOptions} />
      </div>

      {/* アクションボタン */}
      <div
        className="
          flex flex-col sm:flex-row gap-3
          pt-4 border-t border-[var(--border)]
        "
      >
        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
          disabled={deleting}
          className="sm:flex-1"
        >
          変更を保存
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={saving || deleting}
          className="sm:flex-1"
        >
          編集を終了
        </Button>
      </div>

      {/* 削除ボタン（分離して配置） */}
      <div className="pt-4 border-t border-[var(--border)]">
        <Button
          variant="danger"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={saving || deleting}
          className="w-full"
        >
          イベントを削除
        </Button>
      </div>

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="イベントを削除"
        message="このイベントを削除しますか？この操作は取り消せません。すべての回答データも削除されます。"
        confirmLabel="削除する"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
