import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
      {/* テーマトグル */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full text-center space-y-10">
        {/* App Title */}
        <h1 className="text-5xl sm:text-6xl font-bold text-[var(--text)] tracking-tight">
          <span className="inline-block mr-3" aria-hidden="true">
            {"📅"}
          </span>
          予定ちゃん
        </h1>

        {/* Catchcopy */}
        <p className="text-xl sm:text-2xl text-[var(--text-secondary)] leading-relaxed">
          みんなの予定を
          <br className="sm:hidden" />
          かんたん調整
        </p>

        {/* CTA Button */}
        <div className="pt-6">
          <Link href="/new">
            <Button size="lg" className="w-full sm:w-auto sm:min-w-[240px]">
              予定を作成する
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
