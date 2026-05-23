import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const B = {
  bg: "#ffffff",
  surface: "#f5f7f5",
  card: "#f0f4f0",
  cardHover: "#e8efe8",
  border: "#d4e0d4",
  borderMid: "#b8ccb8",
  green: "#16a34a",
  greenDark: "#14532d",
  greenDim: "#dcfce7",
  greenGlow: "rgba(22,163,74,0.12)",
  yellow: "#a16207",
  yellowDim: "rgba(161,98,7,0.10)",
  red: "#b91c1c",
  redDim: "rgba(185,28,28,0.10)",
  text: "#0a150a",
  textSub: "#2d5a2d",
  textDim: "#6b9e6b",
  mono: "'JetBrains Mono', 'Fira Mono', monospace",
  font: "'DM Sans', 'Segoe UI', sans-serif",
};

const branches = ["Yasamal", "Xətai", "Nizami", "Nərimanov", "Binəqədi"];

const branchData = [
  { name: "Yasamal", risk: "critical", riskScore: 92, topProduct: "Dairy Mix", loss: 3240, items: 28, color: B.red },
  { name: "Xətai", risk: "warning", riskScore: 61, topProduct: "Strawberry", loss: 483, items: 12, color: B.yellow },
  { name: "Nizami", risk: "warning", riskScore: 55, topProduct: "Fresh Bread", loss: 210, items: 8, color: B.yellow },
  { name: "Nərimanov", risk: "healthy", riskScore: 24, topProduct: "Yogurt", loss: 90, items: 3, color: B.green },
  { name: "Binəqədi", risk: "healthy", riskScore: 18, topProduct: "Juice Pack", loss: 45, items: 2, color: B.green },
];

const alerts = [
  { id: 1, branch: "Yasamal", msg: "28 dairy products at risk", time: "2m ago", level: "critical" },
  { id: 2, branch: "Xətai", msg: "Strawberry — 48hr expiry window", time: "11m ago", level: "warning" },
  { id: 3, branch: "Nizami", msg: "Fresh Bread overstocked by 34 units", time: "18m ago", level: "warning" },
  { id: 4, branch: "Yasamal", msg: "AI executed 25% markdown → ₼1,240 recovered", time: "34m ago", level: "success" },
  { id: 5, branch: "Nərimanov", msg: "Redistribution: 14 units → Xətai", time: "51m ago", level: "info" },
  { id: 6, branch: "Binəqədi", msg: "Loyalty campaign delivered to 37 customers", time: "1h ago", level: "success" },
  { id: 7, branch: "Xətai", msg: "Sales velocity drop detected — Mango juice", time: "1h ago", level: "warning" },
  { id: 8, branch: "Nizami", msg: "Stock replenishment recommended", time: "2h ago", level: "info" },
];

function makeProfitData() {
  const days = [];
  let base = 800;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en", { month: "short", day: "numeric" });
    base = Math.max(300, base + (Math.random() - 0.42) * 280);
    days.push({ day: label, recovered: Math.round(base), target: 900 });
  }
  return days;
}
const profitData = makeProfitData();

const kpis = [
  { label: "At-Risk Inventory", value: "₼14,820", sub: "across all branches", icon: "⚠", color: B.red, glow: B.redDim },
  { label: "Active Campaigns", value: "7", sub: "3 executing now", icon: "📡", color: B.yellow, glow: B.yellowDim },
  { label: "Critical Branches", value: "1", sub: "Yasamal — score 92", icon: "🔴", color: B.red, glow: B.redDim },
  { label: "Recovered Today", value: "₼2,140", sub: "+18% vs yesterday", icon: "💰", color: B.green, glow: B.greenGlow },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 8, padding: "10px 14px", fontFamily: B.font }}>
      <div style={{ fontSize: 11, color: B.textSub, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: B.green }}>₼{payload[0].value.toLocaleString()}</div>
    </div>
  );
};

export default function Dashboard() {
  const [branch, setBranch] = useState("All Branches");
  const [open, setOpen] = useState(false);
  const alertRef = useRef(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const el = alertRef.current;
    if (!el) return;
    let frame;
    let pos = 0;
    const scroll = () => {
      pos += 0.5;
      if (pos >= el.scrollHeight / 2) pos = 0;
      el.scrollTop = pos;
      frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    el.addEventListener("mouseenter", () => cancelAnimationFrame(frame));
    el.addEventListener("mouseleave", () => { frame = requestAnimationFrame(scroll); });
    return () => cancelAnimationFrame(frame);
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const filtered = branch === "All Branches" ? branchData : branchData.filter(b => b.name === branch);

  return (
    <div style={{ minHeight: "100vh", background: B.bg, fontFamily: B.font, color: B.text }}>
      {/* subtle grid bg */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${B.border} 1px, transparent 1px), linear-gradient(90deg, ${B.border} 1px, transparent 1px)`,
        backgroundSize: "48px 48px", opacity: 0.25,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "32px 28px" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, background: B.greenDim, border: `1px solid ${B.greenDark}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>♻</div>
              <span style={{ fontSize: 13, color: B.textSub, letterSpacing: "0.08em", textTransform: "uppercase" }}>ProfitLoop AI</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.025em", color: B.text }}>
              {greeting}, <span style={{ color: B.green }}>Admin</span>
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: B.textSub }}>{dateStr}</p>
          </div>

          {/* Branch selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 10,
                padding: "10px 16px", fontSize: 13, color: B.text, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, fontFamily: B.font,
                minWidth: 180,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.green, flexShrink: 0 }} />
              {branch}
              <span style={{ marginLeft: "auto", color: B.textSub, fontSize: 11 }}>{open ? "▲" : "▼"}</span>
            </button>
            {open && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100,
                background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 10,
                overflow: "hidden", minWidth: 180, boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}>
                {["All Branches", ...branches].map(b => (
                  <div
                    key={b}
                    onClick={() => { setBranch(b); setOpen(false); }}
                    style={{
                      padding: "10px 16px", fontSize: 13, cursor: "pointer",
                      color: branch === b ? B.green : B.text,
                      background: branch === b ? B.greenDim : "transparent",
                      borderBottom: `1px solid ${B.border}`,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => { if (branch !== b) e.currentTarget.style.background = B.surface; }}
                    onMouseLeave={e => { if (branch !== b) e.currentTarget.style.background = "transparent"; }}
                  >
                    {b === "All Branches" ? "🌐 " : "📍 "}{b}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── KPI CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{
              background: B.card, border: `1px solid ${B.border}`, borderRadius: 14,
              padding: "20px 22px", position: "relative", overflow: "hidden",
              transition: "border-color 0.2s, transform 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = k.color + "55"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "50%", background: k.glow, transform: "translate(20px,-20px)", pointerEvents: "none" }} />
              <div style={{ fontSize: 22, marginBottom: 10 }}>{k.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: k.color, marginBottom: 2 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: B.textSub, fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 11, color: B.textDim, marginTop: 3 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 20 }}>

          {/* Branch Grid */}
          <div>
            <div style={{ fontSize: 12, color: B.textSub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>
              Branch Status
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {filtered.map((br, i) => (
                <div key={i} style={{
                  background: B.card, border: `1px solid ${B.border}`, borderRadius: 14,
                  padding: "18px 20px", cursor: "pointer", transition: "all 0.2s",
                  borderLeft: `3px solid ${br.color}`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = B.cardHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = B.card; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: B.text }}>📍 {br.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                      padding: "3px 8px", borderRadius: 20,
                      background: br.risk === "critical" ? B.redDim : br.risk === "warning" ? B.yellowDim : "rgba(34,197,94,0.12)",
                      color: br.color,
                    }}>{br.risk}</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: B.textDim, marginBottom: 3 }}>TOP RISK PRODUCT</div>
                    <div style={{ fontSize: 13, color: B.text, fontWeight: 500 }}>{br.topProduct}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: 11, color: B.textDim }}>PROJ. LOSS</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: br.color }}>₼{br.loss.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: B.textDim }}>ITEMS AT RISK</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: B.textSub }}>{br.items}</div>
                    </div>
                  </div>
                  {/* risk bar */}
                  <div style={{ marginTop: 12, background: B.border, borderRadius: 4, height: 4, overflow: "hidden" }}>
                    <div style={{ width: `${br.riskScore}%`, height: "100%", background: br.color, borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: B.textDim }}>Risk score</span>
                    <span style={{ fontSize: 10, color: br.color, fontWeight: 600 }}>{br.riskScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Alert Feed */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, color: B.textSub, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Live Alerts</div>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.green, boxShadow: `0 0 0 3px ${B.greenGlow}`, display: "inline-block", animation: "pulse 2s infinite" }} />
            </div>
            <div ref={alertRef} style={{ flex: 1, overflowY: "hidden", padding: "8px 0", maxHeight: 340 }}>
              {[...alerts, ...alerts].map((a, i) => {
                const col = a.level === "critical" ? B.red : a.level === "warning" ? B.yellow : a.level === "success" ? B.green : B.textSub;
                const icon = a.level === "critical" ? "🔴" : a.level === "warning" ? "🟡" : a.level === "success" ? "✅" : "ℹ️";
                return (
                  <div key={i} style={{ padding: "10px 18px", borderBottom: `1px solid ${B.border}`, transition: "background 0.15s", cursor: "default" }}
                    onMouseEnter={e => (e.currentTarget.style.background = B.surface)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                        <div>
                          <div style={{ fontSize: 12, color: B.text, lineHeight: 1.4 }}>{a.msg}</div>
                          <div style={{ fontSize: 11, color: col, marginTop: 2, fontWeight: 500 }}>{a.branch}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: B.textDim, flexShrink: 0, marginTop: 2 }}>{a.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── PROFIT CHART ── */}
        <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: B.textSub, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Recovered Profit</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: B.green, letterSpacing: "-0.02em" }}>
                ₼{profitData.reduce((s, d) => s + d.recovered, 0).toLocaleString()}
                <span style={{ fontSize: 12, color: B.textSub, fontWeight: 400, marginLeft: 8 }}>last 30 days</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["7d", "30d", "90d"].map(p => (
                <button key={p} style={{
                  background: p === "30d" ? B.greenDim : "transparent",
                  border: `1px solid ${p === "30d" ? B.greenDark : B.border}`,
                  borderRadius: 6, padding: "5px 12px", fontSize: 12,
                  color: p === "30d" ? B.green : B.textDim, cursor: "pointer", fontFamily: B.font,
                }}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={profitData} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke={B.border} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: B.textDim, fontFamily: B.font }}
                tickLine={false} axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: B.textDim, fontFamily: B.font }}
                tickLine={false} axisLine={false}
                tickFormatter={v => `₼${v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(34,197,94,0.05)" }} />
              <Bar dataKey="recovered" fill={B.green} radius={[3, 3, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}