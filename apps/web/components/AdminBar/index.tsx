"use client";

import { memo, useMemo, useState } from "react";
import type { Administration } from "@/lib/types";

interface Props {
  administrations: Administration[];
  yearRange: [number, number];
  /** SP判定。親で1回 useIsMobile を呼びprops配布 */
  isMobile: boolean;
}

/**
 * SP 用：連続する同党の政権を1バンドに集約。色は最初の政権色を採用し、
 * 含まれる個別 PM 一覧はツールチップで開示する。
 * 「自民党 13年（小泉〜麻生）」のような単位で潰れずに読めるようにする。
 */
interface PartyBand {
  party: string;
  start: number;
  end: number;
  color: string;
  members: Administration[];
}

function groupByParty(admins: Administration[]): PartyBand[] {
  const out: PartyBand[] = [];
  for (const a of admins) {
    const last = out[out.length - 1];
    if (last && last.party === a.party && last.end === a.start) {
      // 連続している同党 → 拡張
      last.end = a.end;
      last.members.push(a);
    } else {
      out.push({
        party: a.party,
        start: a.start,
        end: a.end,
        color: a.color,
        members: [a],
      });
    }
  }
  return out;
}

function AdminBarImpl({ administrations, yearRange, isMobile }: Props) {
  // ホバー（マウス）またはフォーカス（キーボード）でツールチップを表示
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [start, end] = yearRange;
  const span = end - start;

  // SP は政党単位に集約、PC は従来通り PM 単位
  const allBands: (Administration | PartyBand)[] = useMemo(
    () => (isMobile ? groupByParty(administrations) : administrations),
    [administrations, isMobile],
  );

  const visible = allBands.filter((a) => a.end > start && a.start < end);

  // Administration / PartyBand 共通の表示ラベル
  const labelOf = (b: Administration | PartyBand): string =>
    "members" in b ? b.party : b.name;
  const keyOf = (b: Administration | PartyBand): string =>
    "members" in b ? `${b.party}-${b.start}` : `${b.name}-${b.start}`;

  return (
    <div
      className="relative mt-1"
      style={{ height: 40 }}
      role="group"
      aria-label={`政権の表示帯（${start}年〜${end}年）`}
    >
      {/* clipped band backgrounds */}
      <div className="absolute inset-0 rounded overflow-hidden" aria-hidden>
        {visible.map(band => {
          const bandStart = Math.max(band.start, start);
          const bandEnd = Math.min(band.end, end);
          const left = ((bandStart - start) / span) * 100;
          const width = ((bandEnd - bandStart) / span) * 100;
          return (
            <div
              key={`bg-${keyOf(band)}`}
              className="absolute top-0 bottom-0"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                minWidth: 2,
                backgroundColor: band.color + "30",
                // 境界線を太く・濃くして連続バンドの境目も視認可能に
                borderRight: `1.5px solid ${band.color}aa`,
              }}
            />
          );
        })}
      </div>

      {/* interactive overlay — button にしてキーボード/SR 対応 */}
      {visible.map(band => {
        const bandStart = Math.max(band.start, start);
        const bandEnd = Math.min(band.end, end);
        const left = ((bandStart - start) / span) * 100;
        const width = ((bandEnd - bandStart) / span) * 100;
        const key = keyOf(band);
        const isActive = activeKey === key;
        const display = labelOf(band);
        const description =
          "members" in band
            ? `${band.party}（${band.members.map(m => m.name).join("・")}） ${band.start}年から${band.end}年`
            : `${band.name}（${band.party}） ${band.start}年から${band.end}年`;

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
            {!isMobile && width > 4 && "name" in band && (
              <span
                className="text-xs font-bold px-0.5 w-full text-center overflow-hidden leading-tight"
                style={{ color: band.color }}
                aria-hidden
              >
                {width > 6 ? band.name : "…"}
              </span>
            )}
            {!isMobile && width > 8 && (
              <span
                className="text-tiny px-0.5 w-full text-center overflow-hidden leading-tight"
                style={{ color: band.color }}
                aria-hidden
              >
                {band.party}
              </span>
            )}

            {/* モバイル：政党名を優先表示（同党連続は1バンドに集約済み） */}
            {isMobile && width > 6 && (
              <span
                className="text-xs font-bold px-0.5 w-full text-center overflow-hidden truncate leading-tight"
                style={{ color: band.color }}
                aria-hidden
              >
                {display}
              </span>
            )}
            {isMobile && width <= 6 && width > 2 && (
              <span
                className="text-xs font-bold px-0.5 w-full text-center overflow-hidden leading-tight"
                style={{ color: band.color }}
                aria-hidden
              >
                {display.slice(0, 1)}
              </span>
            )}

            {isActive && (
              <div
                role="tooltip"
                className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-50 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  maxWidth: 240,
                  whiteSpace: "normal",
                }}
              >
                <div className="font-bold" style={{ color: band.color }}>
                  {"members" in band ? band.party : band.name}
                </div>
                {"members" in band ? (
                  <div style={{ color: "var(--muted)" }}>
                    {band.members.map(m => m.name).join("・")}
                  </div>
                ) : (
                  <div style={{ color: "var(--muted)" }}>{band.party}</div>
                )}
                <div style={{ color: "var(--muted)" }}>{band.start}–{band.end}</div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export const AdminBar = memo(AdminBarImpl);

