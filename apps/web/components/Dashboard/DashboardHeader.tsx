import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardHeader() {
  return (
    <header
      className="flex items-end justify-between pb-4 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div>
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
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/about"
          className="text-xs hover:underline"
          style={{ color: "var(--muted)" }}
        >
          データソースについて
        </Link>
      </div>
    </header>
  );
}
