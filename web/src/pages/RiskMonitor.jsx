import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";

const B = {
  bg: "#ffffff", surface: "#f5f7f5", card: "#f0f4f0", cardHover: "#e8efe8",
  border: "#d4e0d4", borderMid: "#b8ccb8",
  green: "#16a34a", greenDark: "#14532d", greenDim: "#dcfce7", greenGlow: "rgba(22,163,74,0.12)",
  yellow: "#a16207", yellowDim: "rgba(161,98,7,0.10)",
  red: "#b91c1c", redDim: "rgba(185,28,28,0.10)", redBright: "#991b1b",
  text: "#0a150a", textSub: "#2d5a2d", textDim: "#6b9e6b",
  font: "'DM Sans', 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Mono', monospace",
};

const branches = ["All", "Yasamal", "Xətai", "Nizami", "Nərimanov", "Binəqədi"];

const rawProducts = [
  { id: 1, name: "Dairy Mix Pack", branch: "Yasamal", category: "Dairy", stock: 28, expiry: "2025-05-14", velocity: 2.1, riskScore: 92, projectedLoss: 3240, action: "25% markdown + redistribute" },
  { id: 2, name: "Strawberry (1kg)", branch: "Xətai", category: "Fruit", stock: 50, expiry: "2025-05-15", velocity: 4.8, riskScore: 81, projectedLoss: 483, action: "40% markdown + loyalty campaign" },
  { id: 3, name: "Fresh Bread Loaf", branch: "Nizami", category: "Bakery", stock: 34, expiry: "2025-05-13", velocity: 8.2, riskScore: 74, projectedLoss: 210, action: "15% markdown" },
  { id: 4, name: "Full-Fat Milk 1L", branch: "Yasamal", category: "Dairy", stock: 18, expiry: "2025-05-16", velocity: 3.5, riskScore: 68, projectedLoss: 540, action: "Branch redistribution" },
  { id: 5, name: "Mango Juice 1L", branch: "Xətai", category: "Beverage", stock: 42, expiry: "2025-05-20", velocity: 1.9, riskScore: 61, projectedLoss: 294, action: "10% markdown" },
  { id: 6, name: "Greek Yogurt 500g", branch: "Nizami", category: "Dairy", stock: 15, expiry: "2025-05-17", velocity: 2.8, riskScore: 55, projectedLoss: 165, action: "Loyalty push notification" },
  { id: 7, name: "Organic Eggs (12)", branch: "Nərimanov", category: "Protein", stock: 20, expiry: "2025-05-19", velocity: 3.1, riskScore: 48, projectedLoss: 120, action: "Monitor" },
  { id: 8, name: "Tomato Paste 200g", branch: "Binəqədi", category: "Canned", stock: 60, expiry: "2025-06-01", velocity: 0.9, riskScore: 34, projectedLoss: 90, action: "Monitor" },
  { id: 9, name: "Cheddar Block 400g", branch: "Nərimanov", category: "Dairy", stock: 10, expiry: "2025-05-22", velocity: 1.2, riskScore: 29, projectedLoss: 76, action: "Monitor" },
  { id: 10, name: "Sparkling Water 6pk", branch: "Binəqədi", category: "Beverage", stock: 80, expiry: "2025-07-10", velocity: 5.0, riskScore: 12, projectedLoss: 0, action: "No action needed" },
];

function riskColor(score) {
  if (score >= 80) return B.red;
  if (score >= 50) return B.yellow;
  return B.green;
}

function daysLeft(expiry) {
  const now = new Date(); const exp = new Date(expiry);
  return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
}

function makeWasteCurve(score) {
  return Array.from({ length: 8 }, (_, i) => ({
    day: `D+${i}`,
    prob: Math.min(100, Math.round(score * (1 + i * 0.12) * (0.85 + Math.random() * 0.3))),
  }));
}

const CurveTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 6, padding: "7px 12px", fontFamily: B.font }}>
      <div style={{ fontSize: 10, color: B.textSub }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: B.red }}>{payload[0].value}% waste risk</div>
    </div>
  );
};

export default function RiskMonitor() {
  const [activeBranch, setActiveBranch] = useState("All");
  const [selected, setSelected] = useState(rawProducts[0]);
  const [sortKey, setSortKey] = useState("riskScore");
  const [sortDir, setSortDir] = useState("desc");

  const critical = rawProducts.filter(p => p.riskScore >= 80);

  const filtered = useMemo(() => {
    let data = activeBranch === "All" ? rawProducts : rawProducts.filter(p => p.branch === activeBranch);
    return [...data].sort((a, b) => sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
  }, [activeBranch, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const wasteCurve = useMemo(() => makeWasteCurve(selected.riskScore), [selected.id]);
  const days = daysLeft(selected.expiry);
  const rc = riskColor(selected.riskScore);

  return (
    <div style={{ minHeight: "100vh", background: B.bg, fontFamily: B.font, color: B.text }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${B.border} 1px, transparent 1px), linear-gradient(90deg, ${B.border} 1px, transparent 1px)`,
        backgroundSize: "48px 48px", opacity: 0.2,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "32px 28px" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: B.textSub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
            ProfitLoop AI — Risk Monitor
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em" }}>
            Waste Risk Dashboard
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: B.textSub }}>
            {rawProducts.length} products tracked · {critical.length} critical · Last sync 2 min ago
          </p>
        </div>

        {/* ── CRITICAL BANNER ── */}
        {critical.length > 0 && (
          <div style={{
            background: "rgba(239,68,68,0.06)", border: `1px solid rgba(239,68,68,0.3)`,
            borderRadius: 12, padding: "16px 22px", marginBottom: 24,
            display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap",
          }}>
            <div style={{ fontSize: 22 }}>🔴</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: B.red, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
                Critical Waste Risk Detected
              </div>
              {critical.map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: B.text, fontWeight: 500 }}>{c.branch} — {c.name}</span>
                  <span style={{ fontSize: 11, color: B.redBright, background: "rgba(239,68,68,0.12)", borderRadius: 20, padding: "2px 8px" }}>
                    Score {c.riskScore} · Projected Loss ₼{c.projectedLoss.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 11, color: B.textSub }}>Recommended: {c.action}</span>
                </div>
              ))}
            </div>
            <button style={{
              background: B.red, color: "#fff", border: "none", borderRadius: 8,
              padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: B.font,
              whiteSpace: "nowrap", alignSelf: "center",
            }}>
              ⚡ Profit Loop
            </button>
          </div>
        )}

        {/* ── BRANCH TABS ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {branches.map(b => {
            const isActive = activeBranch === b;
            const branchCritical = b !== "All" && rawProducts.some(p => p.branch === b && p.riskScore >= 80);
            return (
              <button key={b} onClick={() => setActiveBranch(b)} style={{
                background: isActive ? B.greenDim : B.card,
                border: `1px solid ${isActive ? B.greenDark : B.border}`,
                borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? B.green : B.textSub, cursor: "pointer", fontFamily: B.font,
                display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
              }}>
                {branchCritical && <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.red, flexShrink: 0 }} />}
                {b}
              </button>
            );
          })}
        </div>

        {/* ── MAIN LAYOUT: TABLE + PANEL ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

          {/* Risk Table */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, overflow: "hidden" }}>
            {/* table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 60px 90px 80px 100px 90px", padding: "12px 18px", borderBottom: `1px solid ${B.border}`, gap: 8 }}>
              {[
                { label: "Product", key: null },
                { label: "Branch", key: null },
                { label: "Stock", key: "stock" },
                { label: "Expiry", key: null },
                { label: "Velocity", key: "velocity" },
                { label: "Risk Score", key: "riskScore" },
                { label: "Proj. Loss", key: "projectedLoss" },
              ].map((col, i) => (
                <div key={i}
                  onClick={() => col.key && handleSort(col.key)}
                  style={{
                    fontSize: 11, color: sortKey === col.key ? B.green : B.textDim,
                    letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600,
                    cursor: col.key ? "pointer" : "default",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                  {col.label}
                  {col.key && sortKey === col.key && (
                    <span style={{ fontSize: 9 }}>{sortDir === "desc" ? "▼" : "▲"}</span>
                  )}
                </div>
              ))}
            </div>

            {filtered.map((p, i) => {
              const rc = riskColor(p.riskScore);
              const isSelected = selected?.id === p.id;
              return (
                <div key={p.id}
                  onClick={() => setSelected(p)}
                  style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr 60px 90px 80px 100px 90px",
                    padding: "13px 18px", gap: 8, borderBottom: `1px solid ${B.border}`,
                    background: isSelected ? "rgba(34,197,94,0.06)" : "transparent",
                    borderLeft: isSelected ? `3px solid ${B.green}` : "3px solid transparent",
                    cursor: "pointer", transition: "background 0.15s", alignItems: "center",
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = B.cardHover; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: B.text }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: B.textDim, marginTop: 2 }}>{p.category}</div>
                  </div>
                  <div style={{ fontSize: 12, color: B.textSub }}>📍 {p.branch}</div>
                  <div style={{ fontSize: 13, color: B.text, fontWeight: 500 }}>{p.stock}</div>
                  <div>
                    <div style={{ fontSize: 12, color: daysLeft(p.expiry) <= 2 ? B.red : daysLeft(p.expiry) <= 4 ? B.yellow : B.textSub }}>
                      {daysLeft(p.expiry)}d left
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: B.textSub }}>{p.velocity}/day</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, background: B.border, borderRadius: 3, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${p.riskScore}%`, height: "100%", background: rc, borderRadius: 3, transition: "width 0.6s" }} />
                      </div>
                      <span style={{ fontSize: 11, color: rc, fontWeight: 600, minWidth: 24 }}>{p.riskScore}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.projectedLoss > 0 ? rc : B.textDim }}>
                    {p.projectedLoss > 0 ? `₼${p.projectedLoss.toLocaleString()}` : "—"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── BREAKDOWN PANEL ── */}
          {selected && (
            <div style={{ background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 14, overflow: "hidden", position: "sticky", top: 24 }}>
              {/* Panel header */}
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${B.border}`, background: rc === B.red ? "rgba(239,68,68,0.05)" : rc === B.yellow ? "rgba(234,179,8,0.05)" : "rgba(34,197,94,0.05)" }}>
                <div style={{ fontSize: 11, color: B.textDim, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>AI Risk Breakdown</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: B.text, marginBottom: 2 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: B.textSub }}>📍 {selected.branch} · {selected.category}</div>
              </div>

              <div style={{ padding: "18px 20px" }}>
                {/* Key metrics row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Risk Score", value: selected.riskScore, unit: "/100", color: rc },
                    { label: "Proj. Loss", value: `₼${selected.projectedLoss}`, unit: "", color: rc },
                    { label: "Days Left", value: daysLeft(selected.expiry), unit: "d", color: daysLeft(selected.expiry) <= 2 ? B.red : B.textSub },
                    { label: "Velocity", value: selected.velocity, unit: "/day", color: B.textSub },
                  ].map((m, i) => (
                    <div key={i} style={{ background: B.surface, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 10, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>
                        {m.value}<span style={{ fontSize: 11, fontWeight: 400, color: B.textDim }}>{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Waste probability curve */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontWeight: 600 }}>
                    Waste Probability Curve
                  </div>
                  <ResponsiveContainer width="100%" height={130}>
                    <AreaChart data={wasteCurve}>
                      <defs>
                        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={rc} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={rc} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: B.textDim, fontFamily: B.font }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: B.textDim }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                      <Tooltip content={<CurveTooltip />} />
                      <ReferenceLine y={80} stroke={B.red} strokeDasharray="3 3" strokeOpacity={0.5} />
                      <Area type="monotone" dataKey="prob" stroke={rc} strokeWidth={2} fill="url(#wg)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: 10, color: B.textDim, textAlign: "right", marginTop: 2 }}>— 80% critical threshold</div>
                </div>

                {/* Days to expiry countdown */}
                <div style={{ background: B.surface, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Expiry Countdown</span>
                    <span style={{ fontSize: 11, color: rc, fontWeight: 600 }}>{selected.expiry}</span>
                  </div>
                  <div style={{ background: B.border, borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{
                      width: `${Math.max(5, Math.min(100, (daysLeft(selected.expiry) / 14) * 100))}%`,
                      height: "100%", background: rc, borderRadius: 4, transition: "width 0.6s",
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: rc, marginTop: 5, fontWeight: 600 }}>
                    {daysLeft(selected.expiry) <= 0 ? "⚠ Expired" : `${daysLeft(selected.expiry)} day${daysLeft(selected.expiry) !== 1 ? "s" : ""} remaining`}
                  </div>
                </div>

                {/* Recommended action */}
                <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>AI Recommendation</div>
                  <div style={{ fontSize: 13, color: B.green, fontWeight: 600, lineHeight: 1.5 }}>✦ {selected.action}</div>
                </div>

                <button style={{
                  width: "100%", background: rc, color: rc === B.yellow ? "#000" : "#fff",
                  border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: B.font, letterSpacing: "0.02em",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  ⚡ Recovery Action
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}