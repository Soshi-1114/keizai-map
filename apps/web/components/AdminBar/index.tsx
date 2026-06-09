import type { Administration } from "@/lib/types";

interface Props {
  administrations: Administration[];
  yearRange: [number, number];
}

export function AdminBar({ administrations, yearRange }: Props) {
  const [start, end] = yearRange;
  const span = end - start;

  const visible = administrations.filter(a => a.end > start && a.start < end);

  return (
    <div className="relative h-10 rounded overflow-hidden flex mt-1">
      {visible.map(admin => {
        const bandStart = Math.max(admin.start, start);
        const bandEnd   = Math.min(admin.end, end);
        const left  = ((bandStart - start) / span) * 100;
        const width = ((bandEnd - bandStart) / span) * 100;

        return (
          <div
            key={`${admin.name}-${admin.start}`}
            className="absolute top-0 bottom-0 flex flex-col items-center justify-center overflow-hidden"
            style={{
              left: `${left}%`,
              width: `${width}%`,
              backgroundColor: admin.color + "22",
              borderRight: `1px solid ${admin.color}44`,
            }}
            title={`${admin.name}（${admin.party}）${admin.start}–${admin.end}`}
          >
            {width > 4 && (
              <span className="text-[9px] font-bold leading-tight truncate px-0.5" style={{ color: admin.color }}>
                {admin.name}
              </span>
            )}
            {width > 8 && (
              <span className="text-[8px] leading-tight truncate px-0.5" style={{ color: admin.color + "bb" }}>
                {admin.party}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
