import Link from "next/link";
import { Newspaper } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardHeader() {
  return (
    <header
      className="flex items-end justify-between pb-4 border-b gap-3"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="min-w-0">
        <h1
          className="font-bold tracking-tight"
          style={{ fontSize: "clamp(22px, 5vw, 38px)" }}
        >
          KeizaiMap
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
          数字で見る、日本の30年
        </p>
      </div>
      <nav aria-label="サイト内ナビゲーション" className="flex items-center gap-2 md:gap-3 shrink-0">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs md:text-sm font-medium hover:border-[var(--link)] hover:text-[var(--link)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--card)" }}
        >
          <Newspaper size={14} aria-hidden />
          解説記事
        </Link>
        <ThemeToggle />
        <Link
          href="/about"
          className="hidden md:inline text-xs hover:underline"
          style={{ color: "var(--muted)" }}
        >
          データソースについて
        </Link>
      </nav>
    </header>
  );
}
