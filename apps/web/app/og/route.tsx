import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { loadNotoSansJP } from "@/lib/og-font";
import {
  getNormalizedSeries,
  parseIndicatorParam,
  parseRangeParam,
  type NormalizedSeries,
} from "@/lib/og-series";

export const runtime = "edge";

// ─── レイアウト ─────────────────────────────────────────
// 全体 1200×630 = タイトル 100 + チャート 448 + 凡例 82。
// SVG 内部の座標系で PLOT_X..PLOT_X+PLOT_W, PLOT_Y..PLOT_Y+PLOT_H がプロット領域。
// Satori は SVG <text> 非対応のため、軸ラベルは絶対配置の <div> でオーバーレイする。
const W = 1200;
const H = 630;
const TITLE_H = 100;
const LEGEND_H = 82;
const SVG_W = 1200;
const SVG_H = H - TITLE_H - LEGEND_H; // 448
const PLOT_X = 96;
const PLOT_Y = 8;
const PLOT_W = 1040;
const PLOT_H = 370;

function niceRange(minIn: number, maxIn: number, targetTicks = 5) {
  let [min, max] = [minIn, maxIn];
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  const exponent = Math.floor(Math.log10(span / targetTicks));
  const fraction = span / targetTicks / Math.pow(10, exponent);
  const niceFraction = fraction < 1.5 ? 1 : fraction < 3.5 ? 2 : fraction < 7.5 ? 5 : 10;
  const step = niceFraction * Math.pow(10, exponent);
  const yMin = Math.floor(min / step) * step;
  const yMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = yMin; v <= yMax + 1e-9; v += step) ticks.push(Number(v.toFixed(10)));
  return { yMin, yMax, ticks };
}

function xTicks(from: number, to: number): number[] {
  const span = to - from;
  const step = span <= 12 ? 2 : span <= 25 ? 5 : 10;
  const start = Math.ceil(from / step) * step;
  const out: number[] = [];
  for (let y = start; y <= to; y += step) out.push(y);
  if (!out.includes(from)) out.unshift(from);
  if (!out.includes(to)) out.push(to);
  return Array.from(new Set(out)).sort((a, b) => a - b);
}

const xScale = (year: number, from: number, to: number) =>
  PLOT_X + ((year - from) / (to - from)) * PLOT_W;

const yScale = (value: number, yMin: number, yMax: number) =>
  PLOT_Y + (1 - (value - yMin) / (yMax - yMin)) * PLOT_H;

function seriesSegments(
  s: NormalizedSeries,
  from: number,
  to: number,
  yMin: number,
  yMax: number,
): string[] {
  const segments: string[][] = [];
  let cur: string[] = [];
  for (const p of s.points) {
    if (p.value == null) {
      if (cur.length > 0) {
        segments.push(cur);
        cur = [];
      }
      continue;
    }
    cur.push(`${xScale(p.year, from, to).toFixed(1)},${yScale(p.value, yMin, yMax).toFixed(1)}`);
  }
  if (cur.length > 0) segments.push(cur);
  return segments.map(seg => seg.join(" "));
}

function lastPoint(
  s: NormalizedSeries,
  from: number,
  to: number,
  yMin: number,
  yMax: number,
): { x: number; y: number } | null {
  for (let i = s.points.length - 1; i >= 0; i--) {
    const p = s.points[i];
    if (p.value != null) {
      return { x: xScale(p.year, from, to), y: yScale(p.value, yMin, yMax) };
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const keys = parseIndicatorParam(searchParams.get("indicators"));
  const [from, to] = parseRangeParam(searchParams.get("range"));
  const series = getNormalizedSeries(keys, from, to);

  const allValues = series.flatMap(s =>
    s.points.map(p => p.value).filter((v): v is number => v != null),
  );
  const rawMin = allValues.length > 0 ? Math.min(...allValues) : 0;
  const rawMax = allValues.length > 0 ? Math.max(...allValues) : 200;
  const { yMin, yMax, ticks: yTicksArr } = niceRange(rawMin, rawMax, 5);
  const xTicksArr = xTicks(from, to);

  const titleText = keys.length === 1 ? series[0].label : "指標を重ねて見る";
  const subtitleText = `1990=100 ・ ${from}〜${to}年`;
  const legendText = series.map(s => s.label).join("");
  const tickText = [...yTicksArr, ...xTicksArr].join("");
  const allText = `${titleText}${subtitleText}${legendText}${tickText}keizaimap.jp 数字で見る、日本の30年KEIZAIMAP`;

  let fonts: { name: string; data: ArrayBuffer; weight: 700; style: "normal" }[] = [];
  try {
    fonts = [
      { name: "Noto Sans JP", data: await loadNotoSansJP(allText, 700), weight: 700, style: "normal" },
    ];
  } catch {
    // フォント取得失敗時はフォールバック。日本語は欠ける可能性あり。
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          background: "#10121A",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Noto Sans JP", sans-serif',
          position: "relative",
        }}
      >
        {/* 左端アクセントバー */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: "linear-gradient(to bottom, #4F8EF7, #4FD9A0)",
          }}
        />

        {/* タイトル行（高さ 88） */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: "32px 60px 0 80px",
            height: TITLE_H,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 14,
                color: "#4F8EF7",
                letterSpacing: "0.18em",
                marginBottom: 6,
                display: "flex",
              }}
            >
              KEIZAIMAP — 数字で見る、日本の30年
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#E8EAF0",
                lineHeight: 1.1,
                display: "flex",
              }}
            >
              {titleText}
            </div>
          </div>
          <div style={{ fontSize: 18, color: "#9CA3AF", display: "flex" }}>{subtitleText}</div>
        </div>

        {/* チャート行（高さ 460）— SVG + 軸ラベル div を重ねる */}
        <div style={{ position: "relative", width: SVG_W, height: SVG_H, display: "flex" }}>
          <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
            <rect x={PLOT_X} y={PLOT_Y} width={PLOT_W} height={PLOT_H} fill="#161921" />

            {/* 水平グリッド */}
            {yTicksArr.map(v => {
              const y = yScale(v, yMin, yMax);
              return (
                <line
                  key={`yg-${v}`}
                  x1={PLOT_X}
                  y1={y}
                  x2={PLOT_X + PLOT_W}
                  y2={y}
                  stroke="#2E3245"
                  strokeWidth={1}
                  strokeDasharray="3,4"
                />
              );
            })}

            {/* X 軸 baseline */}
            <line
              x1={PLOT_X}
              y1={PLOT_Y + PLOT_H}
              x2={PLOT_X + PLOT_W}
              y2={PLOT_Y + PLOT_H}
              stroke="#4B5563"
              strokeWidth={1.5}
            />

            {/* X 軸目盛り tick */}
            {xTicksArr.map(yr => {
              const x = xScale(yr, from, to);
              return (
                <line
                  key={`xt-${yr}`}
                  x1={x}
                  y1={PLOT_Y + PLOT_H}
                  x2={x}
                  y2={PLOT_Y + PLOT_H + 6}
                  stroke="#4B5563"
                  strokeWidth={1.5}
                />
              );
            })}

            {/* 折れ線（null は連結しない） */}
            {series.flatMap(s =>
              seriesSegments(s, from, to, yMin, yMax).map((pts, i) => (
                <polyline
                  key={`${s.key}-poly-${i}`}
                  points={pts}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )),
            )}

            {/* 末尾ドット */}
            {series.map(s => {
              const p = lastPoint(s, from, to, yMin, yMax);
              return p ? (
                <circle
                  key={`${s.key}-dot`}
                  cx={p.x}
                  cy={p.y}
                  r={6}
                  fill={s.color}
                  stroke="#10121A"
                  strokeWidth={2}
                />
              ) : null;
            })}
          </svg>

          {/* Y 軸ラベル（Satori div, 絶対配置） */}
          {yTicksArr.map(v => {
            const y = yScale(v, yMin, yMax);
            return (
              <div
                key={`yl-${v}`}
                style={{
                  position: "absolute",
                  top: y - 10,
                  left: 0,
                  width: PLOT_X - 8,
                  height: 20,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  fontSize: 16,
                  color: "#9CA3AF",
                }}
              >
                {v}
              </div>
            );
          })}

          {/* X 軸ラベル（年） */}
          {xTicksArr.map(yr => {
            const x = xScale(yr, from, to);
            return (
              <div
                key={`xl-${yr}`}
                style={{
                  position: "absolute",
                  top: PLOT_Y + PLOT_H + 10,
                  left: x - 30,
                  width: 60,
                  height: 22,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 16,
                  color: "#9CA3AF",
                }}
              >
                {yr}
              </div>
            );
          })}
        </div>

        {/* 凡例 + フッター（高さ 82） */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 60px 0 80px",
            height: LEGEND_H,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28, maxWidth: 980 }}>
            {series.map(s => (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 26, height: 4, background: s.color, borderRadius: 2 }} />
                <div style={{ fontSize: 20, color: "#E8EAF0", display: "flex" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 16, color: "#4F8EF7", display: "flex" }}>keizaimap.jp</div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: fonts.length > 0 ? fonts : undefined,
      headers: {
        "Cache-Control": "public, immutable, max-age=86400, stale-while-revalidate=86400",
      },
    },
  );
}
