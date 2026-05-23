import { useState } from "react";

const B = {
  bg: "#ffffff", surface: "#f5f7f5", card: "#f0f4f0", cardHover: "#e8efe8",
  border: "#d4e0d4", borderMid: "#b8ccb8",
  green: "#16a34a", greenDark: "#14532d", greenDim: "#dcfce7",
  yellow: "#a16207", yellowDim: "rgba(161,98,7,0.10)",
  red: "#b91c1c", redDim: "rgba(185,28,28,0.10)",
  blue: "#0369a1", blueDim: "rgba(3,105,161,0.08)",
  purple: "#6d28d9", purpleDim: "rgba(109,40,217,0.10)",
  text: "#0a150a", textSub: "#2d5a2d", textDim: "#6b9e6b",
  font: "'DM Sans','Segoe UI',sans-serif",
};

const initialCampaigns = [
  {
    id: 1, name: "Strawberry Flash Sale", branch: "Xətai", product: "Strawberry (1kg)",
    discount: 40, status: "ACTIVE", customers: 248, reached: 187, converted: 94,
    estimatedRecovery: 483, actualRecovery: 312, channel: "Cashback + Push",
    startTime: "14:00", endTime: "20:00", riskScore: 81,
  },
  {
    id: 2, name: "Dairy Clearance", branch: "Yasamal", product: "Dairy Mix Pack",
    discount: 25, status: "READY", customers: 183, reached: 0, converted: 0,
    estimatedRecovery: 1240, actualRecovery: 0, channel: "Loyalty Card",
    startTime: "16:00", endTime: "22:00", riskScore: 92,
  },
  {
    id: 3, name: "Bread End-of-Day", branch: "Nizami", product: "Fresh Bread Loaf",
    discount: 15, status: "COMPLETED", customers: 120, reached: 115, converted: 89,
    estimatedRecovery: 210, actualRecovery: 198, channel: "Push Notification",
    startTime: "18:00", endTime: "21:00", riskScore: 74,
  },
  {
    id: 4, name: "Mango Juice Bundle", branch: "Xətai", product: "Mango Juice 1L",
    discount: 10, status: "DRAFT", customers: 95, reached: 0, converted: 0,
    estimatedRecovery: 294, actualRecovery: 0, channel: "Umico Integration",
    startTime: "12:00", endTime: "18:00", riskScore: 61,
  },
];

const statusColor = (s) => s === "ACTIVE" ? B.green : s === "READY" ? B.blue : s === "COMPLETED" ? B.textSub : B.yellow;
const statusBg = (s) => s === "ACTIVE" ? "rgba(34,197,94,0.1)" : s === "READY" ? B.blueDim : s === "COMPLETED" ? "rgba(255,255,255,0.04)" : B.yellowDim;

const segments = [
  { label: "Nearby Customers", pct: 68, icon: "📍", color: B.green },
  { label: "Cashback-Active Users", pct: 54, icon: "💳", color: B.blue },
  { label: "High-Frequency Buyers", pct: 42, icon: "🔁", color: B.purple },
  { label: "Category Preference Match", pct: 79, icon: "🎯", color: B.yellow },
];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selected, setSelected] = useState(initialCampaigns[0]);
  const [tab, setTab] = useState("active"); // active | results

  const launch = (id) => {
    setCampaigns(cs => cs.map(c => c.id === id ? { ...c, status: "ACTIVE" } : c));
    setSelected(s => s.id === id ? { ...s, status: "ACTIVE" } : s);
  };

  const filtered = tab === "active"
    ? campaigns.filter(c => c.status !== "COMPLETED")
    : campaigns.filter(c => c.status === "COMPLETED");

  const totalRecovered = campaigns.filter(c => c.status === "COMPLETED").reduce((s, c) => s + c.actualRecovery, 0);
  const totalActive = campaigns.filter(c => c.status === "ACTIVE").length;
  const totalCustomers = campaigns.reduce((s, c) => s + c.customers, 0);

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
            ProfitLoop AI — Campaigns
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em" }}>
            Loyalty Campaign <span style={{ color: B.green }}>Intelligence</span>
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: B.textSub }}>
            Bravo App · Umico · Cashback-compatible recovery campaigns
          </p>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Active Campaigns", value: totalActive, icon: "📡", color: B.green },
            { label: "Total Customers Targeted", value: totalCustomers.toLocaleString(), icon: "👥", color: B.blue },
            { label: "Recovered (Completed)", value: `₼${totalRecovered}`, icon: "💰", color: B.green },
            { label: "Avg Conversion Rate", value: "61%", icon: "📈", color: B.yellow },
          ].map((k, i) => (
            <div key={i} style={{
              background: B.card, border: `1px solid ${B.border}`, borderRadius: 12,
              padding: "18px 20px", transition: "border-color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = k.color + "55")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = B.border)}
            >
              <div style={{ fontSize: 20, marginBottom: 8 }}>{k.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: k.color, letterSpacing: "-0.02em" }}>{k.value}</div>
              <div style={{ fontSize: 11, color: B.textDim, marginTop: 3 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>

          {/* Left — campaign list */}
          <div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 16, background: B.card, border: `1px solid ${B.border}`, borderRadius: 10, padding: 4, width: "fit-content" }}>
              {[["active", "Active & Pending"], ["results", "Completed"]].map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)} style={{
                  background: tab === key ? B.greenDim : "transparent",
                  border: `1px solid ${tab === key ? B.greenDark : "transparent"}`,
                  borderRadius: 8, padding: "7px 18px", fontSize: 13,
                  color: tab === key ? B.green : B.textSub,
                  cursor: "pointer", fontFamily: B.font, fontWeight: tab === key ? 600 : 400,
                  transition: "all 0.15s",
                }}>{label}</button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(c => {
                const isSelected = selected?.id === c.id;
                const sc = statusColor(c.status);
                return (
                  <div key={c.id}
                    onClick={() => setSelected(c)}
                    style={{
                      background: B.card,
                      border: `1px solid ${isSelected ? B.greenDark : B.border}`,
                      borderRadius: 14, padding: "18px 20px", cursor: "pointer",
                      borderLeft: `3px solid ${isSelected ? B.green : sc}`,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = B.cardHover; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = B.card; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: B.text, marginBottom: 3 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: B.textSub }}>📍 {c.branch} · {c.product}</div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                        padding: "4px 10px", borderRadius: 20,
                        background: statusBg(c.status), color: sc,
                        border: `1px solid ${sc}44`,
                        display: "flex", alignItems: "center", gap: 5,
                      }}>
                        {c.status === "ACTIVE" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc, animation: "pulse 1.5s infinite" }} />}
                        {c.status}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                      {[
                        { label: "Discount", value: `${c.discount}%`, color: sc },
                        { label: "Customers", value: c.customers, color: B.textSub },
                        { label: "Est. Recovery", value: `₼${c.estimatedRecovery}`, color: B.green },
                        { label: "Channel", value: c.channel.split(" ")[0], color: B.blue },
                      ].map((m, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 10, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{m.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: m.color }}>{m.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar for active */}
                    {c.status === "ACTIVE" && c.reached > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: B.textDim, marginBottom: 4 }}>
                          <span>Reach progress</span>
                          <span style={{ color: B.green }}>{Math.round((c.reached / c.customers) * 100)}%</span>
                        </div>
                        <div style={{ background: B.border, borderRadius: 3, height: 5, overflow: "hidden" }}>
                          <div style={{ width: `${(c.reached / c.customers) * 100}%`, height: "100%", background: B.green, borderRadius: 3 }} />
                        </div>
                      </div>
                    )}

                    {/* Launch button for READY */}
                    {c.status === "READY" && (
                      <button
                        onClick={e => { e.stopPropagation(); launch(c.id); }}
                        style={{
                          marginTop: 14, width: "100%", background: B.green, color: "#080d08",
                          border: "none", borderRadius: 9, padding: "10px", fontSize: 13,
                          fontWeight: 700, cursor: "pointer", fontFamily: B.font,
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                      >
                        🚀 Launch Campaign
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Campaign detail panel */}
          {selected && (
            <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Notification preview */}
              <div style={{ background: B.card, border: `1px solid ${B.borderMid}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${B.border}` }}>
                  <div style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                    Customer Notification Preview
                  </div>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  {/* Phone mockup */}
                  <div style={{
                    background: "#0a0f0a", border: `1px solid ${B.borderMid}`,
                    borderRadius: 16, padding: "14px 16px", marginBottom: 14,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 32, height: 32, background: B.greenDim, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛒</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: B.text }}>Bravo Market</div>
                        <div style={{ fontSize: 10, color: B.textDim }}>now</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: B.text, lineHeight: 1.5 }}>
                      🛍 <strong>{selected.branch} Bravo</strong>-da <strong>{selected.product}</strong> məhsuluna sənə özəl <strong style={{ color: B.green }}>{selected.discount}% endirim!</strong> Cashback-dən istifadə et!
                    </div>
                    <div style={{ fontSize: 11, color: B.textSub, marginTop: 8 }}>
                      ⏰ {selected.startTime} – {selected.endTime} · {selected.channel}
                    </div>
                  </div>

                  {/* Customer segments */}
                  <div style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontWeight: 600 }}>
                    Targeted Segments
                  </div>
                  {segments.map((seg, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: B.textSub }}>{seg.icon} {seg.label}</span>
                        <span style={{ color: seg.color, fontWeight: 600 }}>{seg.pct}%</span>
                      </div>
                      <div style={{ background: B.border, borderRadius: 3, height: 4, overflow: "hidden" }}>
                        <div style={{ width: `${seg.pct}%`, height: "100%", background: seg.color, borderRadius: 3, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results (if completed or active) */}
              {(selected.status === "ACTIVE" || selected.status === "COMPLETED") && (
                <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "18px 20px" }}>
                  <div style={{ fontSize: 11, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 14 }}>
                    Campaign Results
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Customers Reached", value: selected.reached, total: selected.customers, color: B.blue },
                      { label: "Conversions", value: selected.converted, total: selected.reached || 1, color: B.green },
                      { label: "Est. Recovery", value: `₼${selected.estimatedRecovery}`, color: B.textSub },
                      { label: "Actual Recovery", value: `₼${selected.actualRecovery}`, color: B.green },
                    ].map((m, i) => (
                      <div key={i} style={{ background: B.surface, borderRadius: 10, padding: "11px 13px" }}>
                        <div style={{ fontSize: 10, color: B.textDim, marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}</div>
                        {m.total && typeof m.value === "number" && (
                          <div style={{ fontSize: 10, color: B.textDim, marginTop: 2 }}>
                            of {m.total} ({Math.round((m.value / m.total) * 100)}%)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}