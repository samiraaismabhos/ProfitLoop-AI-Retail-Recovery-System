import { useState, useEffect } from "react";

const B = {
  bg: "#ffffff", surface: "#f5f7f5", card: "#f0f4f0", cardHover: "#e8efe8",
  border: "#d4e0d4", borderMid: "#b8ccb8",
  green: "#16a34a", greenDark: "#14532d", greenDim: "#dcfce7", greenGlow: "rgba(22,163,74,0.15)",
  yellow: "#a16207", yellowDim: "rgba(161,98,7,0.10)",
  red: "#b91c1c", redDim: "rgba(185,28,28,0.10)",
  blue: "#0369a1", blueDim: "rgba(3,105,161,0.08)",
  text: "#0a150a", textSub: "#2d5a2d", textDim: "#6b9e6b",
  font: "'DM Sans','Segoe UI',sans-serif",
  mono: "'JetBrains Mono','Fira Mono','Courier New',monospace",
};

// Branch positions on the SVG map (representing Baku districts roughly)
const branchNodes = [
  { id: "Yasamal",    x: 220, y: 160, excess: 42, demand: 0,  status: "excess" },
  { id: "Xətai",     x: 420, y: 220, excess: 0,  demand: 29, status: "shortage" },
  { id: "Nizami",    x: 310, y: 100, excess: 18, demand: 0,  status: "excess" },
  { id: "Nərimanov", x: 480, y: 120, excess: 0,  demand: 12, status: "shortage" },
  { id: "Binəqədi",  x: 120, y: 260, excess: 8,  demand: 0,  status: "balanced" },
];

const transfers = [
  {
    id: 1, from: "Yasamal", to: "Xətai",
    product: "Strawberry (1kg)", qty: 29, category: "Fruit",
    wasteReduction: 41, recoveredProfit: 483,
    status: "pending", urgency: "critical",
    reason: "Xətai has 29-unit shortage · Yasamal at risk in 48h",
  },
  {
    id: 2, from: "Nizami", to: "Nərimanov",
    product: "Dairy Mix Pack", qty: 14, category: "Dairy",
    wasteReduction: 22, recoveredProfit: 312,
    status: "pending", urgency: "warning",
    reason: "Nərimanov running low · Nizami overstocked by 18 units",
  },
  {
    id: 3, from: "Yasamal", to: "Nizami",
    product: "Fresh Bread Loaf", qty: 8, category: "Bakery",
    wasteReduction: 15, recoveredProfit: 96,
    status: "pending", urgency: "low",
    reason: "Nizami bread demand spike detected today",
  },
];

function Arrow({ from, to, animated, color, accepted }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 - 30;
  const path = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;

  return (
    <g>
      <path d={path} fill="none" stroke={color} strokeWidth={accepted ? 3 : 2}
        strokeDasharray={accepted ? "none" : "8 4"}
        opacity={accepted ? 1 : 0.7}
        markerEnd={`url(#arrow-${color.replace("#", "")})`}
      />
      {animated && (
        <circle r="5" fill={color} opacity="0.9">
          <animateMotion dur="1.8s" repeatCount="indefinite" path={path} />
        </circle>
      )}
      {accepted && (
        <circle r="4" fill={B.green} opacity="0.6">
          <animateMotion dur="1.2s" repeatCount="indefinite" path={path} />
        </circle>
      )}
    </g>
  );
}

function BranchNode({ node, isFrom, isTo }) {
  const col = node.status === "excess" ? B.yellow
    : node.status === "shortage" ? B.red
    : B.green;
  const label = node.status === "excess" ? `+${node.excess} excess`
    : node.status === "shortage" ? `-${node.demand} needed`
    : "balanced";

  return (
    <g>
      {/* glow ring */}
      <circle cx={node.x} cy={node.y} r={isFrom || isTo ? 28 : 22}
        fill={col + "18"} stroke={col + "44"} strokeWidth={1}
      />
      <circle cx={node.x} cy={node.y} r={18}
        fill={B.card} stroke={col} strokeWidth={isFrom || isTo ? 2.5 : 1.5}
      />
      <text x={node.x} y={node.y + 4} textAnchor="middle"
        fontSize={10} fontWeight={700} fill={col} fontFamily={B.font}>
        {node.id.slice(0, 3).toUpperCase()}
      </text>
      {/* name label */}
      <text x={node.x} y={node.y + 34} textAnchor="middle"
        fontSize={11} fill={B.text} fontFamily={B.font} fontWeight={500}>
        {node.id}
      </text>
      {/* status pill */}
      <rect x={node.x - 28} y={node.y + 42} width={56} height={16} rx={8}
        fill={col + "22"} stroke={col + "55"} strokeWidth={0.5} />
      <text x={node.x} y={node.y + 53} textAnchor="middle"
        fontSize={9} fill={col} fontFamily={B.font} fontWeight={600}>
        {label}
      </text>
    </g>
  );
}

export default function Redistribution() {
  const [cards, setCards] = useState(transfers);
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [impactVisible, setImpactVisible] = useState(null);
  const [animating, setAnimating] = useState([]);

  const pending = cards.filter(c => !accepted.includes(c.id) && !rejected.includes(c.id));

  const getNode = (id) => branchNodes.find(n => n.id === id);

  const handleAccept = (id) => {
    setAccepted(a => [...a, id]);
    setAnimating(a => [...a, id]);
    setImpactVisible(id);
  };

  const handleReject = (id) => {
    setRejected(r => [...r, id]);
  };

  const urgencyColor = (u) => u === "critical" ? B.red : u === "warning" ? B.yellow : B.textSub;
  const urgencyBg = (u) => u === "critical" ? B.redDim : u === "warning" ? B.yellowDim : "transparent";

  const totalRecovered = accepted.reduce((s, id) => {
    const t = transfers.find(t => t.id === id);
    return s + (t?.recoveredProfit || 0);
  }, 0);

  const totalWaste = accepted.reduce((s, id) => {
    const t = transfers.find(t => t.id === id);
    return s + (t?.wasteReduction || 0);
  }, 0);

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
            ProfitLoop AI — Redistribution
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em" }}>
            Stock Redistribution <span style={{ color: B.green }}>Intelligence</span>
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: B.textSub }}>
            AI-detected branch imbalances · Animated transfer map · Accept or modify recommendations
          </p>
        </div>

        {/* Impact bar if any accepted */}
        {accepted.length > 0 && (
          <div style={{
            background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: 12, padding: "14px 22px", marginBottom: 24,
            display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center",
          }}>
            <div style={{ fontSize: 12, color: B.green, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              ✓ {accepted.length} Transfer{accepted.length > 1 ? "s" : ""} Accepted
            </div>
            <div>
              <div style={{ fontSize: 10, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Recovered</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: B.green }}>₼{totalRecovered.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Waste Reduced</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: B.yellow }}>{totalWaste} units</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 12, color: B.textSub }}>
              Transfers executing in real-time →
            </div>
          </div>
        )}

        {/* AI Imbalances summary */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: B.textSub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
            AI-Detected Imbalances
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {transfers.map(t => (
              <div key={t.id} style={{
                background: B.card, border: `1px solid ${urgencyColor(t.urgency)}44`,
                borderRadius: 10, padding: "10px 16px", fontSize: 13,
                display: "flex", alignItems: "center", gap: 10,
                opacity: rejected.includes(t.id) ? 0.4 : 1,
                transition: "opacity 0.3s",
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: urgencyColor(t.urgency), flexShrink: 0 }} />
                <span style={{ color: B.text, fontWeight: 500 }}>{t.from}</span>
                <span style={{ color: B.textDim, fontSize: 16 }}>→</span>
                <span style={{ color: B.text, fontWeight: 500 }}>{t.to}</span>
                <span style={{ color: B.textSub }}>{t.qty} × {t.product}</span>
                {accepted.includes(t.id) && (
                  <span style={{ fontSize: 11, color: B.green, background: B.greenDim, borderRadius: 20, padding: "2px 8px" }}>Executing</span>
                )}
                {rejected.includes(t.id) && (
                  <span style={{ fontSize: 11, color: B.red, background: B.redDim, borderRadius: 20, padding: "2px 8px" }}>Rejected</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main layout: Map + Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20, alignItems: "start" }}>

          {/* SVG Branch Map */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px 0", borderBottom: `1px solid ${B.border}`, paddingBottom: 14 }}>
              <div style={{ fontSize: 12, color: B.textSub, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 2 }}>
                Baku Branch Network
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: B.textDim, marginTop: 8, flexWrap: "wrap" }}>
                <span><span style={{ color: B.yellow }}>■</span> Excess stock</span>
                <span><span style={{ color: B.red }}>■</span> Shortage</span>
                <span><span style={{ color: B.green }}>■</span> Balanced</span>
                <span><span style={{ color: B.textDim }}>- -</span> Pending transfer</span>
                <span><span style={{ color: B.green }}>──</span> Executing</span>
              </div>
            </div>

            <svg viewBox="0 0 600 340" style={{ width: "100%", background: "transparent" }}>
              <defs>
                {[B.green, B.yellow, B.red, B.blue].map(c => (
                  <marker key={c} id={`arrow-${c.replace("#", "")}`}
                    markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill={c} opacity="0.8" />
                  </marker>
                ))}
              </defs>

              {/* Map background — rough Baku shape */}
              <ellipse cx="310" cy="185" rx="260" ry="140" fill="#0f160f" stroke={B.border} strokeWidth="1" />
              <text x="310" y="310" textAnchor="middle" fontSize={10} fill={B.textDim} fontFamily={B.font} opacity={0.5}>
                Baku City Districts
              </text>

              {/* Transfer arrows */}
              {transfers.map(t => {
                const fromNode = getNode(t.from);
                const toNode = getNode(t.to);
                if (!fromNode || !toNode) return null;
                const isAccepted = accepted.includes(t.id);
                const isRejected = rejected.includes(t.id);
                if (isRejected) return null;
                const col = isAccepted ? B.green : t.urgency === "critical" ? B.red : B.yellow;
                return (
                  <Arrow
                    key={t.id}
                    from={fromNode}
                    to={toNode}
                    animated={true}
                    color={col}
                    accepted={isAccepted}
                  />
                );
              })}

              {/* Branch nodes */}
              {branchNodes.map(node => {
                const isFrom = transfers.some(t => t.from === node.id && !rejected.includes(t.id));
                const isTo = transfers.some(t => t.to === node.id && !rejected.includes(t.id));
                return <BranchNode key={node.id} node={node} isFrom={isFrom} isTo={isTo} />;
              })}
            </svg>
          </div>

          {/* Transfer Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {transfers.map(t => {
              const isAccepted = accepted.includes(t.id);
              const isRejected = rejected.includes(t.id);

              return (
                <div key={t.id} style={{
                  background: B.card,
                  border: `1px solid ${isAccepted ? B.greenDark : isRejected ? B.border : urgencyColor(t.urgency) + "55"}`,
                  borderRadius: 14, overflow: "hidden",
                  opacity: isRejected ? 0.45 : 1,
                  transition: "all 0.3s",
                  transform: isAccepted ? "none" : "none",
                }}>
                  {/* Card header */}
                  <div style={{
                    padding: "14px 18px", borderBottom: `1px solid ${B.border}`,
                    background: isAccepted ? "rgba(34,197,94,0.06)" : urgencyBg(t.urgency),
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: urgencyColor(t.urgency) }} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: B.text }}>
                        {t.from} → {t.to}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                      textTransform: "uppercase", padding: "3px 10px", borderRadius: 20,
                      background: urgencyBg(t.urgency), color: urgencyColor(t.urgency),
                      border: `1px solid ${urgencyColor(t.urgency)}44`,
                    }}>
                      {isAccepted ? "✓ Executing" : isRejected ? "✗ Rejected" : t.urgency}
                    </span>
                  </div>

                  <div style={{ padding: "16px 18px" }}>
                    {/* Product info */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: B.textDim, marginBottom: 3 }}>TRANSFER</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: B.text }}>{t.qty} × {t.product}</div>
                        <div style={{ fontSize: 11, color: B.textSub, marginTop: 2 }}>{t.category}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: B.textDim, marginBottom: 3 }}>IMPACT</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: B.green }}>₼{t.recoveredProfit}</div>
                        <div style={{ fontSize: 11, color: B.yellow }}>-{t.wasteReduction} waste units</div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div style={{
                      background: B.surface, borderRadius: 8, padding: "9px 12px",
                      fontSize: 12, color: B.textSub, marginBottom: 14, lineHeight: 1.5,
                      borderLeft: `2px solid ${urgencyColor(t.urgency)}`,
                    }}>
                      {t.reason}
                    </div>

                    {/* Impact preview if accepted */}
                    {isAccepted && impactVisible === t.id && (
                      <div style={{
                        background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
                        borderRadius: 10, padding: "12px 14px", marginBottom: 14,
                      }}>
                        <div style={{ fontSize: 11, color: B.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                          ✓ Impact Preview
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {[
                            { label: `${t.from} stock`, before: `+${t.qty} excess`, after: "Balanced ✓", col: B.green },
                            { label: `${t.to} stock`, before: "Shortage", after: "Restocked ✓", col: B.green },
                          ].map((item, i) => (
                            <div key={i} style={{ background: B.surface, borderRadius: 8, padding: "9px 11px" }}>
                              <div style={{ fontSize: 10, color: B.textDim, marginBottom: 4 }}>{item.label}</div>
                              <div style={{ fontSize: 11, color: B.red, textDecoration: "line-through", marginBottom: 2 }}>{item.before}</div>
                              <div style={{ fontSize: 11, color: item.col, fontWeight: 600 }}>{item.after}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    {!isAccepted && !isRejected && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => handleAccept(t.id)}
                          style={{
                            flex: 1, background: B.greenDim, border: `1px solid ${B.greenDark}`,
                            borderRadius: 9, padding: "10px", fontSize: 13, fontWeight: 700,
                            color: B.green, cursor: "pointer", fontFamily: B.font,
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = B.green + "33")}
                          onMouseLeave={e => (e.currentTarget.style.background = B.greenDim)}
                        >
                          ✓ Accept
                        </button>
                        <button
                          style={{
                            flex: 1, background: B.surface, border: `1px solid ${B.borderMid}`,
                            borderRadius: 9, padding: "10px", fontSize: 13, fontWeight: 600,
                            color: B.textSub, cursor: "pointer", fontFamily: B.font,
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = B.cardHover)}
                          onMouseLeave={e => (e.currentTarget.style.background = B.surface)}
                        >
                          ✎ Modify
                        </button>
                        <button
                          onClick={() => handleReject(t.id)}
                          style={{
                            flex: 1, background: B.redDim, border: `1px solid ${B.red}44`,
                            borderRadius: 9, padding: "10px", fontSize: 13, fontWeight: 600,
                            color: B.red, cursor: "pointer", fontFamily: B.font,
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = B.red + "22")}
                          onMouseLeave={e => (e.currentTarget.style.background = B.redDim)}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 8, padding: "10px", background: B.greenDim,
                        borderRadius: 9, border: `1px solid ${B.greenDark}`,
                        fontSize: 13, fontWeight: 700, color: B.green,
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.green, animation: "pulse 1.5s infinite" }} />
                        Transfer in progress…
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}