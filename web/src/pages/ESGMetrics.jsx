import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const B = {
  bg: "#ffffff", surface: "#f5f7f5", card: "#f0f4f0", cardHover: "#e8efe8",
  border: "#d4e0d4", borderMid: "#b8ccb8",
  green: "#16a34a", greenDark: "#14532d", greenDim: "#dcfce7",
  yellow: "#a16207", yellowDim: "rgba(161,98,7,0.10)",
  teal: "#0f766e", tealDim: "rgba(15,118,110,0.10)",
  blue: "#0369a1", blueDim: "rgba(3,105,161,0.08)",
  text: "#0a150a", textSub: "#2d5a2d", textDim: "#6b9e6b",
  font: "'DM Sans','Segoe UI',sans-serif",
};

function makeMonthlyData() {
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => ({
    month: m,
    wastePrevented: Math.round(200 + i * 28 + Math.random() * 40),
    co2Saved: Math.round(80 + i * 12 + Math.random() * 20),
    recovered: Math.round(1200 + i * 320 + Math.random() * 400),
  }));
}

const monthlyData = makeMonthlyData();

const branchESG = [
  { branch: "Yasamal",    score: 72, waste: 340, co2: 136, recovered: 8200 },
  { branch: "Xətai",      score: 85, waste: 210, co2: 84,  recovered: 5800 },
  { branch: "Nizami",     score: 61, waste: 180, co2: 72,  recovered: 4100 },
  { branch: "Nərimanov",  score: 90, waste: 95,  co2: 38,  recovered: 3200 },
  { branch: "Binəqədi",   score: 78, waste: 120, co2: 48,  recovered: 2900 },
];

function AnimatedCounter({ target, prefix = "", suffix = "", duration = 1800, color }) {
  const [val, setVal] = useState(0);
  const start = useRef(null);

  useEffect(() => {
    start.current = null;
    const step = (ts) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);

  return (
    <span style={{ color: color || B.green }}>
      {prefix}{val.toLocaleString()}{suffix}
    </span>
  );
}

function CircleScore({ score, color, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={B.border} strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
    </svg>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 8, padding: "10px 14px", fontFamily: B.font, fontSize: 12 }}>
      <div style={{ color: B.textSub, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
};

export default function ESGMetrics() {
  const [period, setPeriod] = useState("12m");

  const totals = {
    waste: branchESG.reduce((s, b) => s + b.waste, 0),
    co2: branchESG.reduce((s, b) => s + b.co2, 0),
    recovered: branchESG.reduce((s, b) => s + b.recovered, 0),
    avgScore: Math.round(branchESG.reduce((s, b) => s + b.score, 0) / branchESG.length),
  };

  return (
    <div style={{ minHeight: "100vh", background: B.bg, fontFamily: B.font, color: B.text }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${B.border} 1px,transparent 1px),linear-gradient(90deg,${B.border} 1px,transparent 1px)`,
        backgroundSize: "48px 48px", opacity: 0.2,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto", padding: "32px 28px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: B.textSub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
            ProfitLoop AI — ESG Metrics
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em" }}>
            Sustainability <span style={{ color: B.green }}>Impact</span>
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: B.textSub }}>
            Food waste prevented · CO₂ reduction · Recovered profit · Branch ESG leaderboard
          </p>
        </div>

        {/* Hero counters */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { icon: "🌱", label: "Food Waste Prevented", target: totals.waste, suffix: " kg", color: B.green, sub: "across all branches this year" },
            { icon: "🌍", label: "Estimated CO₂ Saved", target: totals.co2, suffix: " kg", color: B.teal, sub: "equivalent to planting 18 trees" },
            { icon: "💰", label: "Recovered Profit", target: totals.recovered, prefix: "₼", suffix: "", color: B.yellow, sub: "+23% vs last quarter" },
            { icon: "📊", label: "Avg ESG Score", target: totals.avgScore, suffix: "/100", color: B.blue, sub: "up 8 points this month" },
          ].map((k, i) => (
            <div key={i} style={{
              background: B.card, border: `1px solid ${B.border}`, borderRadius: 14,
              padding: "24px 24px", position: "relative", overflow: "hidden",
              transition: "border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = k.color + "55"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: k.color + "14", pointerEvents: "none" }} />
              <div style={{ fontSize: 26, marginBottom: 10 }}>{k.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 3 }}>
                <AnimatedCounter target={k.target} prefix={k.prefix || ""} suffix={k.suffix} color={k.color} />
              </div>
              <div style={{ fontSize: 12, color: B.textSub, fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 11, color: B.textDim, marginTop: 3 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

          {/* Waste prevented over time */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "24px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: B.textSub, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 3 }}>
                  🌱 Waste Prevented
                </div>
                <div style={{ fontSize: 13, color: B.textDim }}>Monthly food waste saved (kg)</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["6m","12m"].map(p => (
                  <button key={p} onClick={() => setPeriod(p)} style={{
                    background: period === p ? B.greenDim : "transparent",
                    border: `1px solid ${period === p ? B.greenDark : B.border}`,
                    borderRadius: 6, padding: "4px 10px", fontSize: 11,
                    color: period === p ? B.green : B.textDim, cursor: "pointer", fontFamily: B.font,
                  }}>{p}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={period === "6m" ? monthlyData.slice(-6) : monthlyData}>
                <defs>
                  <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={B.green} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={B.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: B.textDim, fontFamily: B.font }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: B.textDim }} tickLine={false} axisLine={false} tickFormatter={v => `${v}kg`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="wastePrevented" name="Waste Prevented (kg)" stroke={B.green} strokeWidth={2} fill="url(#wasteGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* CO2 over time */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "24px 24px" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: B.textSub, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 3 }}>
                🌍 CO₂ Reduction
              </div>
              <div style={{ fontSize: 13, color: B.textDim }}>Monthly carbon savings (kg)</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={period === "6m" ? monthlyData.slice(-6) : monthlyData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: B.textDim, fontFamily: B.font }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: B.textDim }} tickLine={false} axisLine={false} tickFormatter={v => `${v}kg`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="co2Saved" name="CO₂ Saved (kg)" fill={B.teal} radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch ESG Leaderboard */}
        <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, color: B.textSub, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Branch ESG Leaderboard</div>
              <div style={{ fontSize: 12, color: B.textDim, marginTop: 3 }}>Ranked by composite sustainability score</div>
            </div>
            <div style={{ fontSize: 12, color: B.textSub }}>🏆 Top performer: <span style={{ color: B.green, fontWeight: 600 }}>Nərimanov</span></div>
          </div>

          {[...branchESG].sort((a, b) => b.score - a.score).map((br, i) => {
            const scoreColor = br.score >= 80 ? B.green : br.score >= 65 ? B.yellow : B.red;
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
            return (
              <div key={br.branch} style={{
                display: "grid",
                gridTemplateColumns: "32px 140px 1fr 100px 100px 120px",
                alignItems: "center", gap: 16,
                padding: "16px 22px", borderBottom: `1px solid ${B.border}`,
                transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = B.cardHover)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: 16 }}>{medal}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.text }}>📍 {br.branch}</div>

                {/* Score bar + circle */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <CircleScore score={br.score} color={scoreColor} size={52} />
                    <div style={{ position: "absolute", fontSize: 11, fontWeight: 700, color: scoreColor }}>{br.score}</div>
                  </div>
                  <div style={{ flex: 1, background: B.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div style={{ width: `${br.score}%`, height: "100%", background: scoreColor, borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: B.textDim, marginBottom: 2 }}>WASTE PREVENTED</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: B.green }}>{br.waste} kg</div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: B.textDim, marginBottom: 2 }}>CO₂ SAVED</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: B.teal }}>{br.co2} kg</div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: B.textDim, marginBottom: 2 }}>RECOVERED</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: B.yellow }}>₼{br.recovered.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}