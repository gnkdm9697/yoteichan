'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * 共通フッター
 * 新規作成リンクを含む
 */
export function Footer() {
  const pathname = usePathname();
  const isNewPage = pathname === '/new';

  return (
    <footer className="mt-auto py-8 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-lg mx-auto px-5 flex flex-col items-center gap-4">
        {!isNewPage && (
          <Link
            href="/new"
            className="
              inline-flex items-center gap-2
              px-5 py-3
              bg-[var(--primary)] text-white
              rounded-xl
              font-medium text-base
              hover:bg-[var(--primary-hover)]
              active:scale-[0.98]
              transition-all duration-150
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            新しく予定を調整する
          </Link>
        )}
        <p className="text-sm text-[var(--text-secondary)]">
          © 予定ちゃん
        </p>
      </div>
    </footer>
  );
}
