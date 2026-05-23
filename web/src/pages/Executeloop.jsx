import { useState, useEffect } from "react";

const T = {
  bg: "#f8fafc",
  card: "#ffffff",
  surface: "#f1f5f9",
  border: "#e2e8f0",
  borderMid: "#cbd5e1",
  green: "#16a34a",
  greenLight: "#dcfce7",
  greenDark: "#15803d",
  greenBorder: "#86efac",
  yellow: "#d97706",
  yellowLight: "#fef3c7",
  yellowBorder: "#fcd34d",
  red: "#dc2626",
  redLight: "#fee2e2",
  redBorder: "#fca5a5",
  blue: "#2563eb",
  blueLight: "#dbeafe",
  blueBorder: "#93c5fd",
  navy: "#0f172a",
  text: "#0f172a",
  textSub: "#475569",
  textDim: "#94a3b8",
  font: "'DM Sans','Segoe UI',sans-serif",
  mono: "'JetBrains Mono','Fira Mono',monospace",
};

const PRODUCTS = [
  {
    id: 1, name: "Strawberry (1kg)", branch: "Khatai", category: "Fruits",
    riskScore: 92, projectedLoss: 203.67, stock: 51, expiryDays: 2,
    salesVelocity: 7, price: 6.40, wasteQty: 19,
    optimalDiscount: 40, recoveredProfit: 77.09,
    transferTarget: "Narimanov", transferQty: 29, transferValue: 185.60,
    loyaltyCustomers: 33, loyaltyRevenue: 203.67,
  },
  {
    id: 2, name: "Dairy Mix Pack", branch: "Yasamal", category: "Dairy",
    riskScore: 87, projectedLoss: 3240, stock: 147, expiryDays: 2,
    salesVelocity: 37, price: 3.82, wasteQty: 73,
    optimalDiscount: 25, recoveredProfit: 1240,
    transferTarget: "Khatai", transferQty: 14, transferValue: 53.48,
    loyaltyCustomers: 248, loyaltyRevenue: 890,
  },
  {
    id: 3, name: "Milk 1L", branch: "Surakhani", category: "Dairy",
    riskScore: 85, projectedLoss: 583.50, stock: 175, expiryDays: 1,
    salesVelocity: 21, price: 3.34, wasteQty: 154,
    optimalDiscount: 30, recoveredProfit: 291.75,
    transferTarget: "Binagadi", transferQty: 22, transferValue: 73.48,
    loyaltyCustomers: 97, loyaltyRevenue: 340,
  },
  {
    id: 4, name: "Bread Loaf", branch: "Nizami", category: "Bakery",
    riskScore: 74, projectedLoss: 210, stock: 232, expiryDays: 2,
    salesVelocity: 74, price: 0.85, wasteQty: 84,
    optimalDiscount: 15, recoveredProfit: 96,
    transferTarget: "Narimanov", transferQty: 8, transferValue: 6.80,
    loyaltyCustomers: 120, loyaltyRevenue: 96,
  },
];

function aiDecide(product) {
  const daysLeft = product.expiryDays;
  const transferBetter = product.transferValue > product.recoveredProfit * 0.4;
  const discountBetter = product.recoveredProfit > product.transferValue;

  if (daysLeft <= 1) {
    return {
      action: "both",
      reason: `Expiry is only ${daysLeft} day away. Both discount and transfer are needed for maximum recovery.`,
      discountPct: product.optimalDiscount,
      willTransfer: true,
      willDiscount: true,
      totalRecovery: +(product.recoveredProfit + product.loyaltyRevenue * 0.3 + product.transferValue * 0.5).toFixed(2),
    };
  } else if (!transferBetter || !discountBetter) {
    if (product.recoveredProfit >= product.transferValue) {
      return {
        action: "discount",
        reason: `Discount strategy yields ₼${(product.recoveredProfit - product.transferValue).toFixed(2)} more recovery than transfer. Notifying ${product.loyaltyCustomers} loyalty customers.`,
        discountPct: product.optimalDiscount,
        willTransfer: false,
        willDiscount: true,
        totalRecovery: +(product.recoveredProfit + product.loyaltyRevenue * 0.25).toFixed(2),
      };
    } else {
      return {
        action: "transfer",
        reason: `High demand at nearby branch. Transferring ${product.transferQty} units to ${product.transferTarget} is more profitable.`,
        discountPct: 0,
        willTransfer: true,
        willDiscount: false,
        totalRecovery: product.transferValue,
      };
    }
  } else {
    return {
      action: "both",
      reason: `AI combines both strategies: ${product.optimalDiscount}% discount + ${product.transferQty} unit transfer. Risk score ${product.riskScore} — combination yields maximum result.`,
      discountPct: product.optimalDiscount,
      willTransfer: true,
      willDiscount: true,
      totalRecovery: +(product.recoveredProfit + product.transferValue * 0.6).toFixed(2),
    };
  }
}

function useCountUp(target, duration, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(+(target * (1 - Math.pow(1 - p, 3))).toFixed(2));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, active]);
  return val;
}

function NotificationPanel({ product, decision, active }) {
  const [sentCount, setSentCount] = useState(0);
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    if (!active) { setSentCount(0); setPhase("idle"); return; }
    setPhase("sending");
    let i = 0;
    const total = product.loyaltyCustomers;
    const iv = setInterval(() => {
      i += Math.ceil(total / 25);
      setSentCount(Math.min(i, total));
      if (i >= total) { clearInterval(iv); setPhase("done"); }
    }, 60);
    return () => clearInterval(iv);
  }, [active]);

  const discountedPrice = (product.price * (1 - decision.discountPct / 100)).toFixed(2);
  const saving = (product.price - discountedPrice).toFixed(2);

  if (!active) return null;

  return (
    <div style={{
      background: T.card, border: `1.5px solid ${T.greenBorder}`,
      borderRadius: 16, padding: "20px 22px", marginTop: 20,
      animation: "fadeUp 0.4s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: T.greenLight, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 20,
        }}>📱</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Customer Notification Sent</div>
          <div style={{ fontSize: 12, color: T.textSub }}>Bravo App · Cashback Push Notification</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "4px 12px",
            borderRadius: 20, background: phase === "done" ? T.greenLight : T.yellowLight,
            color: phase === "done" ? T.green : T.yellow,
            border: `1px solid ${phase === "done" ? T.greenBorder : T.yellowBorder}`,
          }}>
            {phase === "done" ? "✓ Sent" : "● Sending..."}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textSub, marginBottom: 6 }}>
          <span>Delivery progress</span>
          <span style={{ color: T.green, fontWeight: 600 }}>{sentCount} / {product.loyaltyCustomers} customers</span>
        </div>
        <div style={{ background: T.surface, borderRadius: 4, height: 8, overflow: "hidden" }}>
          <div style={{
            height: "100%", background: T.green, borderRadius: 4,
            width: `${(sentCount / product.loyaltyCustomers) * 100}%`,
            transition: "width 0.08s linear",
          }} />
        </div>
      </div>

      <div style={{
        background: T.navy, borderRadius: 16, padding: "16px",
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 10, letterSpacing: "0.06em" }}>BRAVO APP — NOTIFICATION PREVIEW</div>
        <div style={{
          background: "rgba(255,255,255,0.06)", borderRadius: 12,
          padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: "#14532d",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>🛒</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Bravo Market</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>now</span>
              </div>
              <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>
                🛍 <strong style={{ color: "#fff" }}>{product.branch} Bravo</strong> has an exclusive{" "}
                <strong style={{ color: "#fbbf24", fontSize: 14 }}>{decision.discountPct}% DISCOUNT</strong>{" "}
                on <strong style={{ color: "#4ade80" }}>{product.name}</strong> just for you!
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{
                  background: "#14532d", color: "#4ade80", fontSize: 11,
                  fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                }}>
                  ₼{discountedPrice} (save ₼{saving})
                </span>
                <span style={{ fontSize: 11, color: "#64748b" }}>Use your cashback!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {[
          { label: "Targeted", value: product.loyaltyCustomers, suffix: " people", color: T.blue },
          { label: "Discount", value: `${decision.discountPct}%`, suffix: "", color: T.yellow },
          { label: "New price", value: `₼${discountedPrice}`, suffix: "", color: T.green },
          { label: "Saving", value: `₼${saving}`, suffix: "", color: T.green },
        ].map((s, i) => (
          <div key={i} style={{
            background: T.surface, borderRadius: 10, padding: "10px 12px", textAlign: "center",
          }}>
            <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}{s.suffix}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransferPanel({ product, active }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) { setStep(0); return; }
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => setStep(3), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      background: T.card, border: `1.5px solid ${T.blueBorder}`,
      borderRadius: 16, padding: "20px 22px", marginTop: 16,
      animation: "fadeUp 0.4s 0.3s ease both",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: T.blueLight, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 20,
        }}>🔄</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Branch Transfer Execution</div>
          <div style={{ fontSize: 12, color: T.textSub }}>
            {product.transferQty} units · {product.name}
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
            background: step === 3 ? T.greenLight : T.blueLight,
            color: step === 3 ? T.green : T.blue,
            border: `1px solid ${step === 3 ? T.greenBorder : T.blueBorder}`,
          }}>
            {step === 3 ? "✓ Completed" : step === 0 ? "Waiting" : "● In progress"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 20 }}>
        <div style={{
          flex: 1, background: step >= 1 ? T.yellowLight : T.surface,
          border: `1.5px solid ${step >= 1 ? T.yellowBorder : T.border}`,
          borderRadius: 12, padding: "16px", textAlign: "center",
          transition: "all 0.5s",
        }}>
          <div style={{ fontSize: 11, color: T.textDim, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>From</div>
          <div style={{ fontSize: 20, marginBottom: 4 }}>📍</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{product.branch}</div>
          <div style={{ fontSize: 12, color: T.yellow, marginTop: 6, fontWeight: 600 }}>
            -{product.transferQty} units
          </div>
        </div>

        <div style={{ flex: "0 0 100px", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 11, color: T.textDim, marginBottom: 4 }}>{product.transferQty}×</div>
          <div style={{ position: "relative", height: 8, margin: "0 8px", display: "flex", alignItems: "center" }}>
            <div style={{
              height: 2, background: step >= 1 ? T.blue : T.border,
              width: "100%", borderRadius: 2, transition: "background 0.5s",
            }} />
            {step >= 1 && step < 3 && (
              <div style={{
                position: "absolute", top: "50%", transform: "translateY(-50%)",
                width: 12, height: 12, borderRadius: "50%", background: T.blue,
                animation: "moveRight 1.2s linear infinite",
              }} />
            )}
          </div>
          <div style={{ fontSize: 18, color: T.blue, marginTop: 4 }}>→</div>
          <div style={{ fontSize: 10, color: T.textSub }}>₼{product.transferValue}</div>
        </div>

        <div style={{
          flex: 1, background: step >= 3 ? T.greenLight : T.surface,
          border: `1.5px solid ${step >= 3 ? T.greenBorder : T.border}`,
          borderRadius: 12, padding: "16px", textAlign: "center",
          transition: "all 0.5s",
        }}>
          <div style={{ fontSize: 11, color: T.textDim, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>To</div>
          <div style={{ fontSize: 20, marginBottom: 4 }}>📍</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{product.transferTarget}</div>
          <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600, color: step >= 3 ? T.green : T.textDim, transition: "color 0.5s" }}>
            {step >= 3 ? `+${product.transferQty} units ✓` : "waiting..."}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {["Transfer started", "In transit", "Delivered"].map((s, i) => (
          <div key={i} style={{
            flex: 1, borderRadius: 10, padding: "10px 8px", textAlign: "center",
            background: step > i ? T.greenLight : T.surface,
            border: `1px solid ${step > i ? T.greenBorder : T.border}`,
            transition: "all 0.4s",
          }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{step > i ? "✅" : "⏳"}</div>
            <div style={{ fontSize: 11, color: step > i ? T.green : T.textDim }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExecuteLoop() {
  const [selectedId, setSelectedId] = useState(null);
  const [phase, setPhase] = useState("select");
  const [decision, setDecision] = useState(null);
  const [analysisStep, setAnalysisStep] = useState(0);

  const product = PRODUCTS.find(p => p.id === selectedId) || null;
  const counterVal = useCountUp(decision?.totalRecovery || 0, 1600, phase === "done");

  const analysisSteps = product ? [
    "Loading stock data...",
    "Calculating risk score...",
    "Analyzing financial loss...",
    "Running optimal discount model...",
    "Evaluating transfer options...",
    "Master decision engine consolidating...",
    "✓ Strategy determined",
  ] : [];

  const handleSelect = (id) => {
    if (phase !== "select") return;
    setSelectedId(id);
  };

  const handleAnalyze = () => {
    if (!product) return;
    setPhase("analyzing");
    setAnalysisStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setAnalysisStep(i);
      if (i >= analysisSteps.length) {
        clearInterval(iv);
        setTimeout(() => {
          setDecision(aiDecide(product));
          setPhase("decided");
        }, 400);
      }
    }, 320);
  };

  const handleExecute = () => {
    setPhase("executing");
    setTimeout(() => setPhase("done"), 400);
  };

  const handleReset = () => {
    setSelectedId(null);
    setDecision(null);
    setPhase("select");
    setAnalysisStep(0);
  };

  const actionColor = decision?.action === "discount" ? T.yellow
    : decision?.action === "transfer" ? T.blue : T.green;
  const actionBg = decision?.action === "discount" ? T.yellowLight
    : decision?.action === "transfer" ? T.blueLight : T.greenLight;
  const actionBorder = decision?.action === "discount" ? T.yellowBorder
    : decision?.action === "transfer" ? T.blueBorder : T.greenBorder;
  const actionLabel = decision?.action === "discount" ? "DISCOUNT"
    : decision?.action === "transfer" ? "TRANSFER" : "DISCOUNT + TRANSFER";

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 80px" }}>

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{
              background: T.greenLight, border: `1px solid ${T.greenBorder}`,
              borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700,
              color: T.green, letterSpacing: "0.06em",
            }}>AUTONOMOUS</div>
            <div style={{ fontSize: 12, color: T.textDim }}>AI decision engine</div>
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: T.text }}>
            Execute Profit Loop
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: T.textSub }}>
            Select a product — AI automatically calculates and determines the best strategy
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
          {[
            { n: 1, label: "Select product", active: phase === "select" },
            { n: 2, label: "AI Analysis", active: phase === "analyzing" || phase === "decided" },
            { n: 3, label: "Execute", active: phase === "executing" || phase === "done" },
          ].map((s, i) => {
            const done = (s.n === 1 && phase !== "select") || (s.n === 2 && (phase === "executing" || phase === "done"));
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: done ? T.green : s.active ? T.navy : T.surface,
                    color: done || s.active ? "#fff" : T.textDim,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, transition: "all 0.3s",
                    border: `1px solid ${done ? T.green : s.active ? T.navy : T.border}`,
                  }}>
                    {done ? "✓" : s.n}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: s.active ? 600 : 400, color: s.active ? T.text : T.textDim }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 1, background: T.border, margin: "0 12px" }} />}
              </div>
            );
          })}
        </div>

        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: "20px 22px", marginBottom: 16,
          opacity: phase !== "select" ? 0.7 : 1, transition: "opacity 0.3s",
        }}>
          <div style={{ fontSize: 11, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, fontWeight: 600 }}>
            1 — Select an at-risk product
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
            {PRODUCTS.map(p => {
              const riskCol = p.riskScore >= 85 ? T.red : p.riskScore >= 70 ? T.yellow : T.green;
              const riskBg = p.riskScore >= 85 ? T.redLight : p.riskScore >= 70 ? T.yellowLight : T.greenLight;
              return (
                <div key={p.id}
                  onClick={() => handleSelect(p.id)}
                  style={{
                    background: selectedId === p.id ? riskBg : T.surface,
                    border: `1.5px solid ${selectedId === p.id ? riskCol : T.border}`,
                    borderRadius: 12, padding: "14px 16px",
                    cursor: phase === "select" ? "pointer" : "default",
                    transition: "all 0.2s",
                    borderLeft: `4px solid ${riskCol}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: T.textSub }}>📍 {p.branch} · {p.category}</div>
                    </div>
                    <div style={{
                      background: riskBg, color: riskCol, border: `1px solid ${riskCol}44`,
                      borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700,
                    }}>
                      {p.riskScore}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                    <span style={{ color: T.red, fontWeight: 600 }}>Loss: ₼{p.projectedLoss}</span>
                    <span style={{ color: T.textDim }}>⏰ {p.expiryDays}d</span>
                    <span style={{ color: T.textSub }}>{p.stock} units</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {phase === "select" && selectedId && (
          <button
            onClick={handleAnalyze}
            style={{
              width: "100%", padding: "14px", borderRadius: 12,
              background: T.navy, color: "#fff", border: "none",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: T.font, letterSpacing: "0.02em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            🧠 Start AI Analysis
          </button>
        )}

        {phase === "analyzing" && (
          <div style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 14, padding: "20px 22px", marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, fontWeight: 600 }}>
              2 — AI Computation Engine
            </div>
            <div style={{
              background: T.navy, borderRadius: 12, padding: "16px 18px",
              fontFamily: T.mono, fontSize: 12,
            }}>
              {analysisSteps.slice(0, analysisStep).map((s, i) => (
                <div key={i} style={{
                  color: i === analysisStep - 1 ? "#4ade80" : "#64748b",
                  marginBottom: 6, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ color: i === analysisStep - 1 ? "#4ade80" : "#334155" }}>
                    {i === analysisStep - 1 ? "▶" : "✓"}
                  </span>
                  {s}
                </div>
              ))}
              <span style={{ color: "#22c55e", animation: "blink 1s infinite" }}>▋</span>
            </div>
          </div>
        )}

        {(phase === "decided" || phase === "executing" || phase === "done") && decision && (
          <div style={{
            background: T.card, border: `1.5px solid ${actionBorder}`,
            borderRadius: 14, padding: "20px 22px", marginBottom: 16,
            animation: "fadeUp 0.5s ease",
          }}>
            <div style={{ fontSize: 11, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, fontWeight: 600 }}>
              2 — AI Decision
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{
                background: actionBg, color: actionColor,
                border: `1.5px solid ${actionBorder}`,
                borderRadius: 12, padding: "10px 20px",
                fontSize: 16, fontWeight: 800, letterSpacing: "0.04em",
              }}>
                {actionLabel}
              </div>
              {decision.discountPct > 0 && (
                <div style={{
                  fontSize: 32, fontWeight: 800, color: T.yellow, letterSpacing: "-0.03em",
                }}>
                  {decision.discountPct}%
                  <span style={{ fontSize: 13, fontWeight: 400, color: T.textSub, marginLeft: 4 }}>discount</span>
                </div>
              )}
              {decision.willTransfer && (
                <div style={{ fontSize: 13, color: T.blue, fontWeight: 600 }}>
                  🔄 {product.transferQty} units → {product.transferTarget}
                </div>
              )}
            </div>

            <div style={{
              background: T.surface, borderRadius: 10, padding: "12px 14px",
              fontSize: 13, color: T.textSub, lineHeight: 1.6, marginBottom: 14,
              borderLeft: `3px solid ${actionColor}`,
            }}>
              🤖 {decision.reason}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { label: "Projected loss", value: `₼${product.projectedLoss}`, color: T.red },
                { label: "Expected recovery", value: `₼${decision.totalRecovery}`, color: T.green },
                { label: "Target customers", value: decision.willDiscount ? product.loyaltyCustomers : "—", color: T.blue },
              ].map((m, i) => (
                <div key={i} style={{
                  background: T.surface, borderRadius: 10, padding: "12px 14px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "decided" && (
          <button
            onClick={handleExecute}
            style={{
              width: "100%", padding: "15px", borderRadius: 12,
              background: T.green, color: "#fff", border: "none",
              fontSize: 15, fontWeight: 800, cursor: "pointer",
              fontFamily: T.font, letterSpacing: "0.02em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "opacity 0.2s",
              animation: "fadeUp 0.4s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            ⚡ EXECUTE PROFIT LOOP
          </button>
        )}

        {(phase === "executing" || phase === "done") && decision && (
          <div>
            {decision.willDiscount && (
              <NotificationPanel product={product} decision={decision} active={true} />
            )}

            {decision.willTransfer && (
              <TransferPanel product={product} active={true} />
            )}

            {phase === "done" && (
              <div style={{
                background: T.greenLight, border: `1.5px solid ${T.greenBorder}`,
                borderRadius: 14, padding: "20px 24px", marginTop: 16,
                display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16,
                animation: "fadeUp 0.5s 1.5s both ease",
              }}>
                {[
                  { label: "Recovery achieved", value: `₼${counterVal.toFixed(2)}`, color: T.green, big: true },
                  { label: "Waste reduced", value: `${product.wasteQty} units`, color: T.yellow },
                  { label: "Status", value: "✓ COMPLETED", color: T.green },
                ].map((k, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: T.greenDark, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{k.label}</div>
                    <div style={{ fontSize: k.big ? 26 : 18, fontWeight: 800, color: k.color, letterSpacing: "-0.02em" }}>{k.value}</div>
                  </div>
                ))}
              </div>
            )}

            {phase === "done" && (
              <button
                onClick={handleReset}
                style={{
                  width: "100%", marginTop: 14, padding: "12px", borderRadius: 12,
                  background: "transparent", border: `1px solid ${T.border}`,
                  color: T.textSub, fontSize: 13, cursor: "pointer", fontFamily: T.font,
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = T.surface)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                ↺ Start over
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes moveRight {
          from { left: 0; }
          to   { left: calc(100% - 12px); }
        }
      `}</style>
    </div>
  );
}
