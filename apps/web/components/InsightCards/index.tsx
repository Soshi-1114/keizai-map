const INSIGHTS = [
  {
    icon: "📉",
    title: "賃金は30年でほぼ横ばい",
    body: "実質賃金の指数は1990年比でほぼ変わらず。同期間に物価は28%上昇。",
    color: "#4F8EF7",
  },
  {
    icon: "💰",
    title: "税収は過去最高水準",
    body: "2022年度の税収は71兆円超。バブル期（60兆円台）を大きく上回る。",
    color: "#E05C5C",
  },
  {
    icon: "💴",
    title: "円は半値以下に",
    body: "1995年の最高値79円台から、2024年には151円台まで円安が進行。",
    color: "#4FD9A0",
  },
];

export function InsightCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {INSIGHTS.map(({ icon, title, body, color }) => (
        <div
          key={title}
          className="rounded-xl border p-4"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{icon}</span>
            <span className="text-sm font-bold" style={{ color }}>{title}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
