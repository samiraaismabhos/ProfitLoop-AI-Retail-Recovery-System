import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, ReferenceLine
} from "recharts";

const B = {
  bg: "#ffffff", surface: "#f5f7f5", card: "#f0f4f0", cardHover: "#e8efe8",
  border: "#d4e0d4", borderMid: "#b8ccb8",
  green: "#16a34a", greenDark: "#14532d", greenDim: "#dcfce7", greenGlow: "rgba(22,163,74,0.12)",
  yellow: "#a16207", yellowDim: "rgba(161,98,7,0.10)",
  red: "#b91c1c", redDim: "rgba(185,28,28,0.10)",
  blue: "#0369a1", blueDim: "rgba(3,105,161,0.10)",
  text: "#0a150a", textSub: "#2d5a2d", textDim: "#6b9e6b",
  font: "'DM Sans','Segoe UI',sans-serif",
  mono: "'JetBrains Mono','Fira Mono','Courier New',monospace",
};

const branches = ["Yasamal", "Xətai", "Nizami", "Nərimanov", "Binəqədi"];
const products = [
  "Dairy Mix Pack", "Strawberry (1kg)", "Fresh Bread Loaf",
  "Full-Fat Milk 1L", "Mango Juice 1L", "Greek Yogurt 500g",
];

function makeForecast(product, branch) {
  const base = Math.floor(Math.random() * 30) + 20;
  const velocity = +(Math.random() * 4 + 1.5).toFixed(1);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(); day.setDate(day.getDate() + i);
    const label = day.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
    const stock = Math.max(0, base - velocity * i + (Math.random() - 0.5) * 2);
    const sales = velocity + (Math.random() - 0.5) * 1.2;
    const predicted = velocity * (1 + (Math.random() - 0.4) * 0.3);
    return {
      day: label,
      stock: +stock.toFixed(1),
      sales: +sales.toFixed(1),
      predicted: +predicted.toFixed(1),
    };
  });
}

function makeDiscountSims(projectedLoss) {
  return [
    { pct: 10, label: "Conservative", conversion: 28, recovered: +(projectedLoss * 0.22).toFixed(0), margin: "High", verdict: "low" },
    { pct: 25, label: "Optimal", conversion: 61, recovered: +(projectedLoss * 0.58).toFixed(0), margin: "Medium", verdict: "optimal" },
    { pct: 40, label: "Aggressive", conversion: 84, recovered: +(projectedLoss * 0.41).toFixed(0), margin: "Low", verdict: "risky" },
  ];
}

const TABS = ["Forecast", "Discount Simulator", "Strategy"];

const ForecastTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 8, padding: "10px 14px", fontFamily: B.font, fontSize: 12 }}>
      <div style={{ color: B.textSub, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <b>{p.value}</b>
        </div>
      ))}
    </div>
  );
};

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 8, padding: "10px 14px", fontFamily: B.font, fontSize: 12 }}>
      <div style={{ color: B.textSub, marginBottom: 4 }}>{label}% discount</div>
      <div style={{ color: B.green }}>Recovered: ₼{payload[0]?.value}</div>
      <div style={{ color: B.blue }}>Conversion: {payload[1]?.value}%</div>
    </div>
  );
};

export default function AIAnalysis() {
  const [branch, setBranch] = useState("Yasamal");
  const [product, setProduct] = useState("Dairy Mix Pack");
  const [tab, setTab] = useState(0);
  const [projectedLoss] = useState(3240);
  const [termLines, setTermLines] = useState([]);
  const [termDone, setTermDone] = useState(false);
  const termRef = useRef(null);

  const forecast = makeForecast(product, branch);
  const sims = makeDiscountSims(projectedLoss);

  const terminalPayload = {
    campaign_id: "PL-4021",
    branch,
    product,
    risk_score: 92,
    discount: "25%",
    target_customers: 248,
    redistribution_target: "Xətai",
    estimated_recovered_profit: "₼2,140",
    confidence: "87%",
    execution_time: "0.34s",
    status: "READY_TO_EXECUTE",
  };

  const terminalLines = [
    "$ profitloop-ai analyze --branch " + branch + " --product '" + product + "'",
    "",
    "[AI] Loading inventory snapshot...",
    "[AI] Running Risk Forecasting Engine...",
    "[AI] Running Financial Loss Engine...",
    "[AI] Running Autonomous Pricing Engine...",
    "[AI] Running Loyalty Intelligence Engine...",
    "[AI] Aggregating via Master Decision Engine...",
    "",
    "[OUTPUT]",
    JSON.stringify(terminalPayload, null, 2),
    "",
    "[AI] Strategy locked. Ready for execution.",
  ];

  useEffect(() => {
    setTermLines([]);
    setTermDone(false);
    let i = 0;
    const iv = setInterval(() => {
      if (i < terminalLines.length) {
        setTermLines(prev => [...prev, terminalLines[i]]);
        i++;
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
      } else {
        setTermDone(true);
        clearInterval(iv);
      }
    }, 120);
    return () => clearInterval(iv);
  }, [branch, product]);

  const sel = (val, setter, opts) => (
    <select
      value={val}
      onChange={e => setter(e.target.value)}
      style={{
        background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 10,
        padding: "9px 14px", fontSize: 13, color: B.text, cursor: "pointer",
        fontFamily: B.font, outline: "none", minWidth: 160,
      }}
    >
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

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
            ProfitLoop AI — AI Analysis
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em" }}>
            AI Thinks <span style={{ color: B.green }}>⚡</span>
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: B.textSub }}>
            Predictive engine · Discount simulator · Strategy recommendation
          </p>
        </div>

        {/* Selectors */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Branch</span>
            {sel(branch, setBranch, branches)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Product</span>
            {sel(product, setProduct, products)}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "flex-end" }}>
            <div style={{
              background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 10, padding: "9px 16px", fontSize: 12, color: B.green,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: B.green, animation: "pulse 2s infinite", display: "inline-block" }} />
              AI Engine Active
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: B.card, border: `1px solid ${B.border}`, borderRadius: 12, padding: 4, width: "fit-content" }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              background: tab === i ? B.greenDim : "transparent",
              border: `1px solid ${tab === i ? B.greenDark : "transparent"}`,
              borderRadius: 9, padding: "8px 20px", fontSize: 13, fontWeight: tab === i ? 600 : 400,
              color: tab === i ? B.green : B.textSub, cursor: "pointer", fontFamily: B.font,
              transition: "all 0.2s",
            }}>{t}</button>
          ))}
        </div>

        {/* ── TAB 0: FORECAST ── */}
        {tab === 0 && (
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: B.textSub, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>
                7-Day Sales vs Stock Forecast
              </div>
              <div style={{ fontSize: 14, color: B.textSub }}>
                {product} · {branch} · Prophet + XGBoost hybrid model
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: "Avg Daily Sales", value: (forecast.reduce((s, d) => s + d.sales, 0) / 7).toFixed(1), color: B.green },
                { label: "Stock Day 1", value: forecast[0]?.stock, color: B.blue },
                { label: "Stock Day 7", value: forecast[6]?.stock, color: forecast[6]?.stock < 5 ? B.red : B.yellow },
                { label: "Predicted Velocity", value: (forecast.reduce((s, d) => s + d.predicted, 0) / 7).toFixed(1) + "/day", color: B.textSub },
              ].map((m, i) => (
                <div key={i} style={{ background: B.surface, borderRadius: 10, padding: "12px 18px", minWidth: 120 }}>
                  <div style={{ fontSize: 10, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={forecast}>
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={B.blue} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={B.blue} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={B.green} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={B.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: B.textDim, fontFamily: B.font }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: B.textDim }} tickLine={false} axisLine={false} />
                <Tooltip content={<ForecastTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: B.textSub, fontFamily: B.font }} />
                <Area type="monotone" dataKey="stock" name="Stock Level" stroke={B.blue} strokeWidth={2} fill="url(#stockGrad)" dot={false} />
                <Area type="monotone" dataKey="sales" name="Actual Sales" stroke={B.green} strokeWidth={2} fill="url(#salesGrad)" dot={{ fill: B.green, r: 3 }} />
                <Area type="monotone" dataKey="predicted" name="AI Prediction" stroke={B.yellow} strokeWidth={2} strokeDasharray="5 3" fill="none" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 12, color: B.textDim, flexWrap: "wrap" }}>
              <span style={{ color: B.blue }}>■ Stock Level</span>
              <span style={{ color: B.green }}>■ Actual Sales</span>
              <span style={{ color: B.yellow }}>- - AI Predicted</span>
            </div>
          </div>
        )}

        {/* ── TAB 1: DISCOUNT SIMULATOR ── */}
        {tab === 1 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 24 }}>
              {sims.map((s, i) => {
                const isOptimal = s.verdict === "optimal";
                const isRisky = s.verdict === "risky";
                const col = isOptimal ? B.green : isRisky ? B.red : B.yellow;
                return (
                  <div key={i} style={{
                    background: B.card,
                    border: `1px solid ${isOptimal ? B.greenDark : B.border}`,
                    borderRadius: 14, padding: "22px 24px", position: "relative", overflow: "hidden",
                    boxShadow: isOptimal ? `0 0 0 1px ${B.greenDim}` : "none",
                    transition: "transform 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    {isOptimal && (
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: B.greenDim, border: `1px solid ${B.greenDark}`,
                        borderRadius: 20, padding: "3px 10px", fontSize: 10, color: B.green, fontWeight: 700,
                        letterSpacing: "0.06em", textTransform: "uppercase",
                      }}>✦ AI Pick</div>
                    )}
                    <div style={{ fontSize: 36, fontWeight: 800, color: col, letterSpacing: "-0.04em", marginBottom: 4 }}>
                      {s.pct}%
                    </div>
                    <div style={{ fontSize: 13, color: B.textSub, marginBottom: 16 }}>{s.label} markdown</div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { label: "Conversion Rate", value: `${s.conversion}%`, bar: s.conversion },
                        { label: "Recovered Profit", value: `₼${s.recovered.toLocaleString()}`, bar: Math.round((s.recovered / projectedLoss) * 100) },
                        { label: "Margin Impact", value: s.margin },
                      ].map((m, j) => (
                        <div key={j}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                            <span style={{ color: B.textDim }}>{m.label}</span>
                            <span style={{ color: B.text, fontWeight: 600 }}>{m.value}</span>
                          </div>
                          {m.bar !== undefined && (
                            <div style={{ background: B.border, borderRadius: 3, height: 5, overflow: "hidden" }}>
                              <div style={{ width: `${m.bar}%`, height: "100%", background: col, borderRadius: 3, transition: "width 0.8s ease" }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={{
                      marginTop: 16, padding: "8px 12px", borderRadius: 8,
                      background: isOptimal ? "rgba(34,197,94,0.08)" : isRisky ? "rgba(239,68,68,0.08)" : "rgba(234,179,8,0.08)",
                      fontSize: 11, color: col,
                    }}>
                      {isOptimal ? "✓ Best profit-to-waste ratio" : isRisky ? "⚠ Unnecessary margin loss" : "↓ Low conversion expected"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparison bar chart */}
            <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "24px 28px" }}>
              <div style={{ fontSize: 12, color: B.textSub, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 20 }}>
                Recovery vs Conversion — Side-by-Side
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sims.map(s => ({ name: `${s.pct}%`, recovered: s.recovered, conversion: s.conversion }))} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke={B.border} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: B.textSub, fontFamily: B.font }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: B.textDim }} tickLine={false} axisLine={false} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(34,197,94,0.04)" }} />
                  <Bar dataKey="recovered" name="Recovered ₼" fill={B.green} radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="conversion" name="Conversion %" fill={B.blue} radius={[4, 4, 0, 0]} barSize={40} opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── TAB 2: STRATEGY ── */}
        {tab === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {/* Verdict card */}
            <div style={{
              background: B.card, border: `1px solid ${B.greenDark}`,
              borderRadius: 14, padding: "28px 28px",
              boxShadow: `0 0 0 1px ${B.greenDim}, inset 0 0 40px rgba(34,197,94,0.03)`,
            }}>
              <div style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontWeight: 600 }}>
                AI Final Strategy
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: B.green, letterSpacing: "-0.04em" }}>25%</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: B.text }}>Optimal Markdown</div>
                  <div style={{ fontSize: 12, color: B.textSub }}>Highest net profit recovery</div>
                </div>
              </div>
              {[
                { label: "Execute Time", value: "Today, 14:00–18:00", icon: "🕐" },
                { label: "Target Customers", value: "248 loyalty members", icon: "👥" },
                { label: "Estimated Recovery", value: "₼2,140", icon: "💰" },
                { label: "Confidence Score", value: "87%", icon: "🎯" },
                { label: "Redistribution", value: "29 units → Xətai", icon: "🔄" },
              ].map((r, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "11px 0", borderBottom: `1px solid ${B.border}`,
                }}>
                  <span style={{ fontSize: 13, color: B.textSub }}>{r.icon} {r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: B.text }}>{r.value}</span>
                </div>
              ))}
              <button style={{
                marginTop: 20, width: "100%", background: B.green, color: "#080d08",
                border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: B.font, letterSpacing: "0.02em",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                ⚡ Execute Profit Loop
              </button>
            </div>

            {/* Confidence breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "22px 24px" }}>
                <div style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, fontWeight: 600 }}>
                  Confidence Breakdown
                </div>
                {[
                  { label: "Risk Forecasting", score: 92, color: B.red },
                  { label: "Pricing Model", score: 87, color: B.green },
                  { label: "Customer Targeting", score: 79, color: B.blue },
                  { label: "Redistribution Logic", score: 83, color: B.yellow },
                ].map((c, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                      <span style={{ color: B.textSub }}>{c.label}</span>
                      <span style={{ color: c.color, fontWeight: 600 }}>{c.score}%</span>
                    </div>
                    <div style={{ background: B.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${c.score}%`, height: "100%", background: c.color, borderRadius: 4, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "22px 24px", flex: 1 }}>
                <div style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, fontWeight: 600 }}>
                  Why This Strategy Wins
                </div>
                {[
                  "25% hits the sweet spot: 61% customer conversion",
                  "Avoids 40% trap — unnecessary ₼800 margin loss",
                  "Loyalty cashback amplifies reach to 248 targets",
                  "Redistribution recovers 29 units before expiry",
                  "Projected ROI: 3.2× vs doing nothing",
                ].map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: B.textSub, lineHeight: 1.4 }}>
                    <span style={{ color: B.green, flexShrink: 0, marginTop: 1 }}>✦</span>
                    {pt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TERMINAL ── */}
        <div style={{ background: "#050a05", border: `1px solid ${B.borderMid}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderBottom: `1px solid ${B.border}`, background: "#080d08" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.red }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.yellow }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.green }} />
            <span style={{ marginLeft: 12, fontSize: 11, color: B.textDim, fontFamily: B.mono, letterSpacing: "0.04em" }}>
              profitloop-ai terminal
            </span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: termDone ? B.green : B.yellow }}>
              {termDone ? "● READY" : "● RUNNING"}
            </span>
          </div>
          <div
            ref={termRef}
            style={{ padding: "18px 22px", fontFamily: B.mono, fontSize: 12, lineHeight: 1.7, maxHeight: 360, overflowY: "auto", color: "#a3c9a3" }}
          >
            {termLines.map((line, i) => {
              const isJson = line.startsWith(" ") || line.startsWith("{") || line.startsWith("}") || line.startsWith('"');
              const isCmd = line.startsWith("$");
              const isOutput = line.startsWith("[OUTPUT]");
              const isReady = line.includes("locked");
              return (
                <div key={i} style={{
                  color: isCmd ? B.green : isOutput ? B.yellow : isReady ? B.green : isJson ? "#7dd3a8" : "#6b9e6b",
                  fontWeight: isCmd || isOutput ? 600 : 400,
                  whiteSpace: "pre",
                }}>
                  {line || " "}
                </div>
              );
            })}
            {!termDone && (
              <span style={{ color: B.green, animation: "blink 1s infinite" }}>▋</span>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}