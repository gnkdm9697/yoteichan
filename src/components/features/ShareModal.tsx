'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Button } from '@/components/ui';

interface ShareModalProps {
  isOpen: boolean;
  shareUrl: string;
  publicId: string;
  onClose: () => void;
}

export function ShareModal({ isOpen, shareUrl, publicId, onClose }: ShareModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      // 2秒後に元に戻す
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック: execCommand を使用
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const handleViewEvent = useCallback(() => {
    router.push(`/e/${publicId}`);
  }, [router, publicId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="イベントを作成しました！">
      <div className="flex flex-col gap-5">
        {/* 成功アイコン */}
        <div className="flex justify-center">
          <div className="
            w-16 h-16 rounded-full
            bg-[var(--ok)]/10
            flex items-center justify-center
          ">
            <svg
              className="w-8 h-8 text-[var(--ok)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 説明テキスト */}
        <p className="text-center text-[var(--text-secondary)]">
          下記URLを参加者に共有してください
        </p>

        {/* URL表示 */}
        <div className="
          p-3 rounded-lg
          bg-[var(--bg-secondary)]
          border border-[var(--border)]
        ">
          <p className="
            text-sm text-[var(--text)]
            break-all select-all
            font-mono
          ">
            {shareUrl}
          </p>
        </div>

        {/* ボタン群 */}
        <div className="flex flex-col gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleCopy}
            className="w-full"
          >
            {copied ? (
              <>
                <svg
                  className="w-5 h-5 text-[var(--ok)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-[var(--ok)]">コピーしました！</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                URLをコピー
              </>
            )}
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleViewEvent}
            className="w-full"
          >
            イベントを見る
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
