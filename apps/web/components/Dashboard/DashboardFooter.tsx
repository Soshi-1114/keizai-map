import Link from "next/link";
import { DATA_UPDATED_AT } from "@/lib/data";
import { formatUpdatedAt } from "@/lib/utils";

export function DashboardFooter() {
  return (
    <footer
      className="text-xs text-center pt-4 border-t space-y-1"
      style={{ color: "var(--muted)", borderColor: "var(--border)" }}
    >
      <p>
        データ出典: 厚労省・総務省・財務省・日本銀行・国交省・OECD &nbsp;|&nbsp;
        数値はすべて公開統計に基づきます（
        <Link href="/about" className="underline hover:opacity-80" style={{ color: "var(--muted)" }}>
          出典一覧
        </Link>
        ）
      </p>
      {DATA_UPDATED_AT && <p>最終更新: {formatUpdatedAt(DATA_UPDATED_AT)}</p>}
      <p>
        <Link href="/articles" className="hover:underline" style={{ color: "var(--muted)" }}>
          解説記事
        </Link>
        &nbsp;|&nbsp;
        <Link href="/about" className="hover:underline" style={{ color: "var(--muted)" }}>
          データソースについて
        </Link>
        &nbsp;|&nbsp;
        <Link href="/privacy" className="hover:underline" style={{ color: "var(--muted)" }}>
          プライバシーポリシー
        </Link>
        &nbsp;|&nbsp;
        <Link href="/contact" className="hover:underline" style={{ color: "var(--muted)" }}>
          お問い合わせ
        </Link>
      </p>
    </footer>
  );
}
