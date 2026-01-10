'use client';

import { Loading } from './Loading';

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = '読み込み中...' }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <Loading size="lg" />
      <p className="text-sm text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}
