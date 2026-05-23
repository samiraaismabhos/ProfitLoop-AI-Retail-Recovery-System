import { useState } from "react";

const B = {
  bg: "#ffffff", surface: "#f5f7f5", card: "#f0f4f0", cardHover: "#e8efe8",
  border: "#d4e0d4", borderMid: "#b8ccb8",
  green: "#16a34a", greenDark: "#14532d", greenDim: "#dcfce7",
  yellow: "#a16207", red: "#b91c1c", redDim: "rgba(185,28,28,0.10)",
  blue: "#0369a1",
  text: "#0a150a", textSub: "#2d5a2d", textDim: "#6b9e6b",
  font: "'DM Sans','Segoe UI',sans-serif",
};

const TABS = ["Branch Management", "AI Engine Config", "Notification Rules", "Integrations", "Users & Roles"];

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: "pointer",
        background: value ? B.green : B.border,
        position: "relative", transition: "background 0.25s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: value ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: value ? "#080d08" : B.textDim,
        transition: "left 0.25s",
      }} />
    </div>
  );
}

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: B.text, marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: B.textDim }}>{sub}</div>}
    </div>
  );
}

function Field({ label, sub, children }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 0", borderBottom: `1px solid ${B.border}`,
    }}>
      <div>
        <div style={{ fontSize: 13, color: B.text, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: B.textDim, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ marginLeft: 24, flexShrink: 0 }}>{children}</div>
    </div>
  );
}

const inputStyle = {
  background: B.surface, border: `1px solid ${B.borderMid}`, borderRadius: 8,
  padding: "7px 12px", fontSize: 13, color: B.text, fontFamily: B.font,
  outline: "none", width: 120,
};

export default function Settings() {
  const [tab, setTab] = useState(0);

  // Branch management state
  const [branches, setBranches] = useState([
    { id: 1, name: "Yasamal", manager: "Əli Həsənov", threshold: 80, active: true },
    { id: 2, name: "Xətai", manager: "Nigar Əliyeva", threshold: 75, active: true },
    { id: 3, name: "Nizami", manager: "Tural Məmmədov", threshold: 70, active: true },
    { id: 4, name: "Nərimanov", manager: "Leyla Rəsulova", threshold: 65, active: true },
    { id: 5, name: "Binəqədi", manager: "Orxan Babayev", threshold: 70, active: false },
  ]);

  // AI engines state
  const [engines, setEngines] = useState({
    riskForecasting: true,
    financialLoss: true,
    autonomousPricing: true,
    redistribution: true,
    loyaltyIntelligence: true,
    masterDecision: true,
  });

  // Notification rules
  const [rules, setRules] = useState({
    riskThreshold: 70,
    expiryDays: 3,
    emailAlerts: true,
    pushAlerts: true,
    smsAlerts: false,
    criticalOnly: false,
  });

  // Integrations
  const [integrations] = useState([
    { name: "POS System", status: "simulation", icon: "🖥", desc: "Point-of-sale inventory sync" },
    { name: "Loyalty Card API", status: "simulation", icon: "💳", desc: "Bravo loyalty infrastructure" },
    { name: "Umico Platform", status: "simulation", icon: "🛍", desc: "Cashback campaign ecosystem" },
    { name: "Inventory System", status: "simulation", icon: "📦", desc: "Real-time stock management" },
    { name: "Campaign Engine", status: "simulation", icon: "📡", desc: "Push notification delivery" },
    { name: "Analytics Platform", status: "disconnected", icon: "📊", desc: "Business intelligence layer" },
  ]);

  // Users
  const [users] = useState([
    { name: "Jamil Ahmadov", email: "jamil@bravo.az", role: "System Admin", avatar: "JA", active: true },
    { name: "Nigar Əliyeva", email: "nigar@bravo.az", role: "Branch Manager", avatar: "NƏ", active: true },
    { name: "Tural Məmmədov", email: "tural@bravo.az", role: "Branch Manager", avatar: "TM", active: true },
    { name: "Leyla Rəsulova", email: "leyla@bravo.az", role: "Analyst", avatar: "LR", active: false },
  ]);

  const toggleEngine = (key) => setEngines(e => ({ ...e, [key]: !e[key] }));

  const engineLabels = {
    riskForecasting: { label: "Risk Forecasting Engine", sub: "Predicts waste probability using Prophet + XGBoost", icon: "⚠" },
    financialLoss: { label: "Financial Loss Engine", sub: "Calculates projected AZN loss per product", icon: "💸" },
    autonomousPricing: { label: "Autonomous Pricing Engine", sub: "Selects optimal markdown percentage", icon: "🏷" },
    redistribution: { label: "Redistribution Engine", sub: "Optimizes branch-to-branch stock transfers", icon: "🔄" },
    loyaltyIntelligence: { label: "Loyalty Intelligence Engine", sub: "Targets right customer segments for campaigns", icon: "🎯" },
    masterDecision: { label: "Master Decision Engine", sub: "Aggregates all engines into final strategy", icon: "🧠" },
  };

  return (
    <div style={{ minHeight: "100vh", background: B.bg, fontFamily: B.font, color: B.text }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${B.border} 1px,transparent 1px),linear-gradient(90deg,${B.border} 1px,transparent 1px)`,
        backgroundSize: "48px 48px", opacity: 0.2,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: B.textSub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
            ProfitLoop AI — Settings
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em" }}>System Configuration</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: B.textSub }}>Manage branches, AI engines, alerts, integrations and users</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>

          {/* Sidebar nav */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, overflow: "hidden", position: "sticky", top: 24 }}>
            {TABS.map((t, i) => (
              <button key={i} onClick={() => setTab(i)} style={{
                width: "100%", textAlign: "left",
                padding: "13px 18px", fontSize: 13, fontWeight: tab === i ? 600 : 400,
                color: tab === i ? B.green : B.textSub,
                background: tab === i ? B.greenDim : "transparent",
                borderLeft: `3px solid ${tab === i ? B.green : "transparent"}`,
                border: "none", borderBottom: `1px solid ${B.border}`,
                cursor: "pointer", fontFamily: B.font, transition: "all 0.15s",
              }}
                onMouseEnter={e => { if (tab !== i) e.currentTarget.style.background = B.cardHover; }}
                onMouseLeave={e => { if (tab !== i) e.currentTarget.style.background = "transparent"; }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "28px 28px" }}>

            {/* ── BRANCH MANAGEMENT ── */}
            {tab === 0 && (
              <div>
                <SectionTitle title="Branch Management" sub="Configure branches, assign managers, and set per-branch risk thresholds" />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  {branches.map((br, i) => (
                    <div key={br.id} style={{
                      background: B.surface, border: `1px solid ${B.border}`, borderRadius: 12,
                      padding: "16px 18px", display: "grid",
                      gridTemplateColumns: "1fr 1fr 140px 80px",
                      alignItems: "center", gap: 16,
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: B.text }}>📍 {br.name}</div>
                        <div style={{ fontSize: 11, color: B.textDim, marginTop: 2 }}>{br.manager}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: B.textDim, marginBottom: 4 }}>RISK THRESHOLD</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="range" min={40} max={95} value={br.threshold}
                            onChange={e => setBranches(bs => bs.map(b => b.id === br.id ? { ...b, threshold: +e.target.value } : b))}
                            style={{ flex: 1, accentColor: B.green }}
                          />
                          <span style={{ fontSize: 12, fontWeight: 600, color: B.green, minWidth: 30 }}>{br.threshold}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: br.active ? B.green : B.textDim, fontWeight: 600 }}>
                        {br.active ? "● Active" : "○ Inactive"}
                      </div>
                      <Toggle value={br.active} onChange={v => setBranches(bs => bs.map(b => b.id === br.id ? { ...b, active: v } : b))} />
                    </div>
                  ))}
                </div>
                <button style={{
                  background: B.greenDim, border: `1px solid ${B.greenDark}`,
                  borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600,
                  color: B.green, cursor: "pointer", fontFamily: B.font,
                }}>
                  + Add Branch
                </button>
              </div>
            )}

            {/* ── AI ENGINE CONFIG ── */}
            {tab === 1 && (
              <div>
                <SectionTitle title="AI Engine Configuration" sub="Toggle which engines are active. Disabling an engine removes it from the Master Decision pipeline." />
                {Object.entries(engines).map(([key, val]) => {
                  const e = engineLabels[key];
                  return (
                    <Field key={key} label={`${e.icon} ${e.label}`} sub={e.sub}>
                      <Toggle value={val} onChange={() => toggleEngine(key)} />
                    </Field>
                  );
                })}
                <div style={{
                  marginTop: 20, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 10, padding: "12px 16px", fontSize: 12, color: B.green,
                }}>
                  ✦ {Object.values(engines).filter(Boolean).length} / {Object.keys(engines).length} engines active · Master Decision Engine{" "}
                  <strong>{engines.masterDecision ? "online" : "offline"}</strong>
                </div>
              </div>
            )}

            {/* ── NOTIFICATION RULES ── */}
            {tab === 2 && (
              <div>
                <SectionTitle title="Notification Rules" sub="Define when alerts trigger and which channels to use" />
                <Field label="Risk Score Alert Threshold" sub="Trigger alert when risk score exceeds this value">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input type="range" min={30} max={95} value={rules.riskThreshold}
                      onChange={e => setRules(r => ({ ...r, riskThreshold: +e.target.value }))}
                      style={{ width: 100, accentColor: B.green }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, color: B.green, minWidth: 30 }}>{rules.riskThreshold}</span>
                  </div>
                </Field>
                <Field label="Expiry Warning Window" sub="Alert when a product expires within this many days">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="number" value={rules.expiryDays} min={1} max={14}
                      onChange={e => setRules(r => ({ ...r, expiryDays: +e.target.value }))}
                      style={{ ...inputStyle, width: 64 }}
                    />
                    <span style={{ fontSize: 12, color: B.textDim }}>days</span>
                  </div>
                </Field>
                <Field label="Email Alerts" sub="Send alerts to branch manager emails">
                  <Toggle value={rules.emailAlerts} onChange={v => setRules(r => ({ ...r, emailAlerts: v }))} />
                </Field>
                <Field label="Push Notifications" sub="Send to mobile app (Bravo internal)">
                  <Toggle value={rules.pushAlerts} onChange={v => setRules(r => ({ ...r, pushAlerts: v }))} />
                </Field>
                <Field label="SMS Alerts" sub="Send critical alerts via SMS">
                  <Toggle value={rules.smsAlerts} onChange={v => setRules(r => ({ ...r, smsAlerts: v }))} />
                </Field>
                <Field label="Critical Alerts Only" sub="Only send alerts with risk score ≥ 80">
                  <Toggle value={rules.criticalOnly} onChange={v => setRules(r => ({ ...r, criticalOnly: v }))} />
                </Field>
              </div>
            )}

            {/* ── INTEGRATIONS ── */}
            {tab === 3 && (
              <div>
                <SectionTitle title="Integration Status" sub="API connections to retail infrastructure. All connections are in Simulation Mode for MVP." />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {integrations.map((intg, i) => (
                    <div key={i} style={{
                      background: B.surface, border: `1px solid ${B.border}`, borderRadius: 12,
                      padding: "16px 18px", display: "flex", alignItems: "center", gap: 16,
                    }}>
                      <div style={{ fontSize: 24, flexShrink: 0 }}>{intg.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: B.text }}>{intg.name}</div>
                        <div style={{ fontSize: 11, color: B.textDim, marginTop: 2 }}>{intg.desc}</div>
                      </div>
                      <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                        padding: "4px 12px", borderRadius: 20,
                        background: intg.status === "simulation" ? "rgba(234,179,8,0.12)" : B.redDim,
                        color: intg.status === "simulation" ? B.yellow : B.red,
                        border: `1px solid ${intg.status === "simulation" ? B.yellow + "44" : B.red + "44"}`,
                      }}>
                        {intg.status === "simulation" ? "⚡ Simulation" : "✕ Disconnected"}
                      </div>
                      <button style={{
                        background: B.card, border: `1px solid ${B.borderMid}`,
                        borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 500,
                        color: B.textSub, cursor: "pointer", fontFamily: B.font,
                      }}>
                        Configure
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 20, background: B.yellowDim, border: `1px solid ${B.yellow}44`,
                  borderRadius: 10, padding: "12px 16px", fontSize: 12, color: B.yellow,
                }}>
                  ⚡ MVP Mode: All integrations run on synthetic retail datasets. Connect real APIs for production deployment.
                </div>
              </div>
            )}

            {/* ── USERS & ROLES ── */}
            {tab === 4 && (
              <div>
                <SectionTitle title="Users & Role Management" sub="Manage team access. Admins have full access; Branch Managers see only their branch." />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {users.map((u, i) => (
                    <div key={i} style={{
                      background: B.surface, border: `1px solid ${B.border}`, borderRadius: 12,
                      padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                      opacity: u.active ? 1 : 0.5,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%", background: B.greenDim,
                        border: `1px solid ${B.greenDark}`, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 12, fontWeight: 700, color: B.green, flexShrink: 0,
                      }}>{u.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: B.text }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: B.textDim, marginTop: 1 }}>{u.email}</div>
                      </div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
                        background: u.role === "System Admin" ? B.greenDim : "rgba(56,189,248,0.1)",
                        color: u.role === "System Admin" ? B.green : B.blue,
                        border: `1px solid ${u.role === "System Admin" ? B.greenDark : B.blue + "44"}`,
                      }}>
                        {u.role}
                      </div>
                      <div style={{ fontSize: 11, color: u.active ? B.green : B.textDim, minWidth: 56, textAlign: "right" }}>
                        {u.active ? "● Active" : "○ Inactive"}
                      </div>
                      <button style={{
                        background: "transparent", border: `1px solid ${B.border}`,
                        borderRadius: 8, padding: "6px 12px", fontSize: 11,
                        color: B.textDim, cursor: "pointer", fontFamily: B.font,
                      }}>Edit</button>
                    </div>
                  ))}
                </div>
                <button style={{
                  background: B.greenDim, border: `1px solid ${B.greenDark}`,
                  borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600,
                  color: B.green, cursor: "pointer", fontFamily: B.font,
                }}>
                  + Invite User
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}