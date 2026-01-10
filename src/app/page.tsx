import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--bg)]">
      <div className="max-w-md w-full text-center space-y-8">
        {/* App Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] tracking-tight">
          <span className="inline-block mr-3" aria-hidden="true">
            {"📅"}
          </span>
          予定ちゃん
        </h1>

        {/* Catchcopy */}
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed">
          みんなの予定を
          <br className="sm:hidden" />
          かんたん調整
        </p>

        {/* CTA Button */}
        <div className="pt-4">
          <Link href="/new">
            <Button size="lg" className="w-full sm:w-auto sm:min-w-[200px]">
              予定を作成する
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
