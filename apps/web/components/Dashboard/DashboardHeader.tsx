import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardHeader() {
  return (
    <header className="reveal">
      <div className="flex items-start justify-between gap-3">
        {/* 朱印（はんこ）ロゴ + 明朝ワードマーク */}
        <Link href="/" className="flex items-center gap-3 min-w-0 group" aria-label="KeizaiMap ホーム">
          <span
            className="seal shrink-0"
            style={{ width: 44, height: 44, fontSize: 24 }}
            aria-hidden
          >
            経
          </span>
          <span className="min-w-0">
            <span
              className="font-display block leading-none"
              style={{ fontSize: "clamp(24px, 5vw, 36px)", color: "var(--text)" }}
            >
              経済地図
            </span>
            <span
              className="font-mono block mt-1 tracking-[0.18em]"
              style={{ fontSize: 10, color: "var(--muted)" }}
            >
              KEIZAI&nbsp;MAP
            </span>
          </span>
        </Link>

        <nav aria-label="サイト内ナビゲーション" className="flex items-center gap-2 md:gap-3 shrink-0">
          <Link
            href="/articles"
            className="inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs md:text-sm font-medium transition-colors hover:border-[var(--link)] hover:text-[var(--link)]"
            style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--card)" }}
          >
            解説記事
          </Link>
          <ThemeToggle />
          <Link
            href="/about"
            className="hidden md:inline text-xs hover:underline"
            style={{ color: "var(--muted)" }}
          >
            データソース
          </Link>
        </nav>
      </div>

      {/* タグライン（H1）+ 元号ルーラー = 台帳の背骨 */}
      <h1
        className="font-display mt-5 leading-snug break-words"
        style={{ fontSize: "clamp(15px, 2.6vw, 19px)", color: "var(--text)", fontWeight: 600 }}
      >
        実質賃金・物価・税収・為替の35年を、政権の帯とともに一枚に。
      </h1>

      <div className="era-rule mt-3 flex items-stretch" aria-hidden>
        <div className="era-tick" style={{ flexGrow: 30 }}>
          <span className="font-display" style={{ fontSize: 13, color: "var(--text)" }}>平成</span>
          <span className="ml-1.5">’89 – ’19</span>
        </div>
        <div className="era-tick is-now" style={{ flexGrow: 7 }}>
          <span className="font-display" style={{ fontSize: 13 }}>令和</span>
          <span className="ml-1.5">’19 – 今</span>
        </div>
      </div>
    </header>
  );
}
