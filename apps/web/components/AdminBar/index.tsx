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
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [start, end] = yearRange;
  const span = end - start;

  const visible = administrations.filter(a => a.end > start && a.start < end);

  return (
    <div className="relative mt-1" style={{ height: 40 }}>
      {/* clipped band backgrounds */}
      <div className="absolute inset-0 rounded overflow-hidden">
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
                backgroundColor: admin.color + "22",
                borderRight: `1px solid ${admin.color}44`,
              }}
            />
          );
        })}
      </div>

      {/* interactive overlay — overflow visible so tooltips can escape upward */}
      {visible.map(admin => {
        const bandStart = Math.max(admin.start, start);
        const bandEnd = Math.min(admin.end, end);
        const left = ((bandStart - start) / span) * 100;
        const width = ((bandEnd - bandStart) / span) * 100;
        const key = `${admin.name}-${admin.start}`;
        const isHovered = hoveredKey === key;

        return (
          <div
            key={key}
            className="absolute top-0 bottom-0 flex flex-col items-center justify-center"
            style={{
              left: `${left}%`,
              width: `${width}%`,
              minWidth: 2,
              cursor: "default",
              zIndex: isHovered ? 20 : 1,
            }}
            onMouseEnter={() => setHoveredKey(key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            {!isMobile && width > 4 && (
              <span
                className="text-[9px] font-bold leading-tight px-0.5 w-full text-center overflow-hidden"
                style={{ color: admin.color }}
              >
                {width > 6 ? admin.name : "…"}
              </span>
            )}
            {!isMobile && width > 8 && (
              <span
                className="text-[8px] leading-tight px-0.5 w-full text-center overflow-hidden"
                style={{ color: admin.color + "bb" }}
              >
                {admin.party}
              </span>
            )}

            {isHovered && (
              <div
                className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none"
                style={{
                  backgroundColor: "#1e2233",
                  border: "1px solid #2E3245",
                  color: "#E8EAF0",
                }}
              >
                <div className="font-bold" style={{ color: admin.color }}>{admin.name}</div>
                <div style={{ color: "#6B7280" }}>{admin.party}</div>
                <div style={{ color: "#9CA3AF" }}>{admin.start}–{admin.end}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
