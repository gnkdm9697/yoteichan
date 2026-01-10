'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface PassphraseModalProps {
  isOpen: boolean;
  eventId: string;  // public_id
  onClose: () => void;
  onSuccess: (passphrase: string) => void;  // 認証成功時、合言葉を渡すコールバック
}

export function PassphraseModal({
  isOpen,
  eventId,
  onClose,
  onSuccess,
}: PassphraseModalProps) {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError('');

      if (!passphrase.trim()) {
        setError('合言葉を入力してください');
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(`/api/events/${eventId}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passphrase }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || '認証に失敗しました');
        }

        // 成功時：合言葉を渡してコールバック呼び出し
        const verifiedPassphrase = passphrase;
        setPassphrase('');
        onSuccess(verifiedPassphrase);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : '認証に失敗しました');
      } finally {
        setIsLoading(false);
      }
    },
    [passphrase, eventId, onSuccess, onClose]
  );

  const handleClose = useCallback(() => {
    setPassphrase('');
    setError('');
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="🔑 合言葉を入力">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="合言葉を入力"
          value={passphrase}
          onChange={(e) => {
            setPassphrase(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoFocus
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          className="w-full"
        >
          確認する
        </Button>
      </form>
    </Modal>
  );
}
