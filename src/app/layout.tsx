import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/ui";

// 日本語最適化フォント
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "予定ちゃん - みんなの予定をかんたん調整",
  description: "グループの予定調整をかんたんに。日程候補を共有して、みんなの都合を集約できるスケジュール調整アプリ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${notoSansJP.variable} ${geistMono.variable} font-sans antialiased text-lg bg-[var(--bg)] text-[var(--text)]`}
        style={{ fontFamily: "var(--font-noto-sans-jp), system-ui, sans-serif" }}
      >
        <div className="min-h-screen flex flex-col">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
