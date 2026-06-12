"use client";

import { useState } from "react";
import type { Administration } from "@/lib/types";
import { useIsMobile } from "@/lib/hooks";

interface Props {
  administrations: Administration[];
  yearRange: [number, number];
}

export function AdminBar({ administrations, yearRange }: Props) {
  const isMobile = useIsMobile();
  // ホバー（マウス）またはフォーカス（キーボード）でツールチップを表示
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [start, end] = yearRange;
  const span = end - start;

  const visible = administrations.filter(a => a.end > start && a.start < end);

  return (
    <div
      className="relative mt-1"
      style={{ height: 40 }}
      role="group"
      aria-label={`政権の表示帯（${start}年〜${end}年）`}
    >
      {/* clipped band backgrounds */}
      <div className="absolute inset-0 rounded overflow-hidden" aria-hidden>
        {visible.map(admin => {
          const bandStart = Math.max(admin.start, start);
          const bandEnd = Math.min(admin.end, end);
          const left = ((bandStart - start) / span) * 100;
          const width = ((bandEnd - bandStart) / span) * 100;
          return (
            <div
              key={`bg-${admin.name}-${admin.start}`}
              className="absolute top-0 bottom-0"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                minWidth: 2,
                backgroundColor: admin.color + "30",
                // 境界線を太く・濃くして連続自民の代替わりも視認可能に
                borderRight: `1.5px solid ${admin.color}aa`,
              }}
            />
          );
        })}
      </div>

      {/* interactive overlay — button にしてキーボード/SR 対応 */}
      {visible.map(admin => {
        const bandStart = Math.max(admin.start, start);
        const bandEnd = Math.min(admin.end, end);
        const left = ((bandStart - start) / span) * 100;
        const width = ((bandEnd - bandStart) / span) * 100;
        const key = `${admin.name}-${admin.start}`;
        const isActive = activeKey === key;
        const description = `${admin.name}（${admin.party}） ${admin.start}年から${admin.end}年`;

        return (
          <button
            type="button"
            key={key}
            className="absolute top-0 bottom-0 flex flex-col items-center justify-center bg-transparent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600"
            style={{
              left: `${left}%`,
              width: `${width}%`,
              minWidth: 2,
              cursor: "default",
              zIndex: isActive ? 20 : 1,
              border: "none",
              padding: 0,
            }}
            aria-label={description}
            aria-expanded={isActive}
            onMouseEnter={() => setActiveKey(key)}
            onMouseLeave={() => setActiveKey((prev) => (prev === key ? null : prev))}
            onFocus={() => setActiveKey(key)}
            onBlur={() => setActiveKey((prev) => (prev === key ? null : prev))}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setActiveKey(null);
                (e.currentTarget as HTMLButtonElement).blur();
              }
            }}
          >
            {!isMobile && width > 4 && (
              <span
                className="text-micro font-bold px-0.5 w-full text-center overflow-hidden"
                style={{ color: admin.color }}
                aria-hidden
              >
                {width > 6 ? admin.name : "…"}
              </span>
            )}
            {!isMobile && width > 8 && (
              <span
                className="text-micro px-0.5 w-full text-center overflow-hidden"
                style={{ color: admin.color }}
                aria-hidden
              >
                {admin.party}
              </span>
            )}

            {/* モバイル：政権名を優先表示。狭いバンドは頭文字1字でも見える化 */}
            {isMobile && width > 6 && (
              <span
                className="text-micro font-bold px-0.5 w-full text-center overflow-hidden truncate"
                style={{ color: admin.color }}
                aria-hidden
              >
                {admin.name}
              </span>
            )}
            {isMobile && width <= 6 && width > 2 && (
              <span
                className="text-micro font-bold px-0.5 w-full text-center overflow-hidden"
                style={{ color: admin.color }}
                aria-hidden
              >
                {admin.name.slice(0, 1)}
              </span>
            )}

            {isActive && (
              <div
                role="tooltip"
                className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                <div className="font-bold" style={{ color: admin.color }}>{admin.name}</div>
                <div style={{ color: "var(--muted)" }}>{admin.party}</div>
                <div style={{ color: "var(--muted)" }}>{admin.start}–{admin.end}</div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
