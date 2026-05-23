import { useState } from "react";

// ── THEME ──────────────────────────────────────────────────────
const T = {
  bg: "#f7f6f2",
  card: "#ffffff",
  navy: "#0f172a",
  green: "#16a34a",
  greenLight: "#dcfce7",
  greenMid: "#22c55e",
  red: "#ef4444",
  redLight: "#fee2e2",
  yellow: "#f59e0b",
  yellowLight: "#fef3c7",
  border: "#e8e5de",
  muted: "#9ca3af",
  text: "#1a1a1a",
  textSub: "#6b7280",
  font: "'DM Sans', 'Segoe UI', sans-serif",
};

// ── MOCK USER PROFILE ──────────────────────────────────────────
const userProfile = {
  name: "Jamil",
  cashback: 34.80,
  purchaseHistory: ["Dairy", "Fruits", "Meat", "Bakery", "Beverages"],
  topCategories: ["Dairy", "Meat", "Fruits"],
  frequentProducts: ["Milk", "Chicken", "Strawberry", "Cheese", "Banana"],
  dislikedCategories: ["Household", "Cosmetics", "Cleaning"],
};

// ── ALL STORE DISCOUNTS (unfiltered) ──────────────────────────
const allDiscounts = [
  // For you
  { id: 1,  name: "Fresh Milk 1L",        brand: "Süd Evi",    category: "Dairy",      discount: 25, originalPrice: 3.80, newPrice: 2.85, tag: "frequent", expiry: "2d", emoji: "🥛", match: 98 },
  { id: 2,  name: "Chicken Breast 1kg",   brand: "AzEt",       category: "Meat",       discount: 30, originalPrice: 14.50, newPrice: 10.15, tag: "frequent", expiry: "1d", emoji: "🍗", match: 96 },
  { id: 3,  name: "Strawberry 500g",      brand: "Bravo Fresh", category: "Fruits",    discount: 40, originalPrice: 6.40, newPrice: 3.84, tag: "frequent", expiry: "1d", emoji: "🍓", match: 94 },
  { id: 4,  name: "Cheddar Cheese 400g",  brand: "Lactalis",   category: "Dairy",      discount: 20, originalPrice: 11.20, newPrice: 8.96, tag: "frequent", expiry: "3d", emoji: "🧀", match: 91 },
  { id: 5,  name: "Greek Yogurt 500g",    brand: "Süd Evi",    category: "Dairy",      discount: 15, originalPrice: 4.20, newPrice: 3.57, tag: "new",      expiry: "4d", emoji: "🫙", match: 88 },
  { id: 6,  name: "Banana 1kg",           brand: "Bravo Fresh", category: "Fruits",    discount: 20, originalPrice: 2.80, newPrice: 2.24, tag: "frequent", expiry: "2d", emoji: "🍌", match: 85 },
  { id: 7,  name: "Whole Bread Loaf",     brand: "Çörək Evi",  category: "Bakery",     discount: 15, originalPrice: 1.80, newPrice: 1.53, tag: "frequent", expiry: "1d", emoji: "🍞", match: 82 },
  { id: 8,  name: "Kefir 1L",            brand: "Süd Evi",    category: "Dairy",      discount: 20, originalPrice: 3.60, newPrice: 2.88, tag: "trending", expiry: "2d", emoji: "🍼", match: 80 },
  { id: 9,  name: "Orange Juice 1L",      brand: "Rich",       category: "Beverages",  discount: 25, originalPrice: 4.50, newPrice: 3.38, tag: "trending", expiry: "5d", emoji: "🍊", match: 76 },
  { id: 10, name: "Beef Mince 500g",      brand: "AzEt",       category: "Meat",       discount: 20, originalPrice: 9.80, newPrice: 7.84, tag: "new",      expiry: "1d", emoji: "🥩", match: 72 },
  { id: 11, name: "Croissant x4",         brand: "Çörək Evi",  category: "Bakery",     discount: 30, originalPrice: 3.20, newPrice: 2.24, tag: "trending", expiry: "1d", emoji: "🥐", match: 68 },
  { id: 12, name: "Apple 1kg",            brand: "Bravo Fresh", category: "Fruits",    discount: 15, originalPrice: 3.00, newPrice: 2.55, tag: "new",      expiry: "4d", emoji: "🍎", match: 65 },
  // NOT for you (filtered out)
  { id: 13, name: "Dish Soap 500ml",      brand: "Fairy",      category: "Cleaning",   discount: 40, originalPrice: 4.80, newPrice: 2.88, tag: "sale",     expiry: "7d", emoji: "🧴", match: 5 },
  { id: 14, name: "Shampoo 400ml",        brand: "Head&Sh.",   category: "Cosmetics",  discount: 35, originalPrice: 8.50, newPrice: 5.53, tag: "sale",     expiry: "10d", emoji: "🧼", match: 3 },
  { id: 15, name: "Floor Cleaner 1L",     brand: "Mr. Muscle", category: "Cleaning",   discount: 50, originalPrice: 6.00, newPrice: 3.00, tag: "sale",     expiry: "14d", emoji: "🫧", match: 2 },
  { id: 16, name: "Laundry Pods x30",     brand: "Ariel",      category: "Household",  discount: 30, originalPrice: 12.00, newPrice: 8.40, tag: "sale",    expiry: "14d", emoji: "🫧", match: 4 },
];

const FOR_YOU = allDiscounts.filter(d => !userProfile.dislikedCategories.includes(d.category));
const NOT_FOR_YOU = allDiscounts.filter(d => userProfile.dislikedCategories.includes(d.category));

const CATEGORY_FILTERS = ["All", "Dairy", "Meat", "Fruits", "Bakery", "Beverages"];

const tagStyle = (tag) => {
  if (tag === "frequent") return { bg: "#dcfce7", color: "#15803d", label: "Your fave" };
  if (tag === "new")      return { bg: "#dbeafe", color: "#1d4ed8", label: "New for you" };
  if (tag === "trending") return { bg: "#fef3c7", color: "#92400e", label: "Trending" };
  return { bg: "#f3f4f6", color: "#374151", label: "Sale" };
};

function DiscountCard({ item, cashback, onAdd, added }) {
  const tag = tagStyle(item.tag);
  const saving = (item.originalPrice - item.newPrice).toFixed(2);

  return (
    <div style={{
      background: T.card,
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: `1px solid ${T.border}`,
      transition: "transform 0.2s, box-shadow 0.2s",
      position: "relative",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
    >
      {/* Discount badge */}
      <div style={{
        position: "absolute", top: 12, left: 12, zIndex: 2,
        background: T.red, color: "#fff",
        borderRadius: 10, padding: "4px 10px",
        fontSize: 12, fontWeight: 800, letterSpacing: "0.02em",
      }}>
        -{item.discount}%
      </div>

      {/* Match score */}
      <div style={{
        position: "absolute", top: 12, right: 12, zIndex: 2,
        background: item.match >= 85 ? T.green : item.match >= 70 ? T.yellow : T.muted,
        color: "#fff", borderRadius: 10, padding: "4px 8px",
        fontSize: 10, fontWeight: 700,
      }}>
        {item.match}% match
      </div>

      {/* Emoji area */}
      <div style={{
        background: `linear-gradient(135deg, ${T.greenLight}, ${T.bg})`,
        height: 110, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 56,
      }}>
        {item.emoji}
      </div>

      <div style={{ padding: "14px 14px 16px" }}>
        {/* Tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: tag.bg, color: tag.color,
          borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600,
          marginBottom: 8,
        }}>
          {item.tag === "frequent" ? "♻" : item.tag === "new" ? "✨" : "🔥"} {tag.label}
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 2, lineHeight: 1.3 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 11, color: T.textSub, marginBottom: 10 }}>
          {item.brand} · {item.category}
        </div>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: T.green }}>₼{item.newPrice.toFixed(2)}</span>
          <span style={{ fontSize: 13, color: T.muted, textDecoration: "line-through" }}>₼{item.originalPrice.toFixed(2)}</span>
        </div>

        <div style={{ fontSize: 11, color: T.green, fontWeight: 600, marginBottom: 12 }}>
          You save ₼{saving}
        </div>

        {/* Expiry */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: T.bg, borderRadius: 10, padding: "7px 10px", marginBottom: 12,
          fontSize: 11,
        }}>
          <span style={{ color: T.textSub }}>⏰ Expires in {item.expiry}</span>
          {cashback && (
            <span style={{ color: T.green, fontWeight: 600 }}>+cashback</span>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={() => onAdd(item.id)}
          style={{
            width: "100%", borderRadius: 12, padding: "11px",
            background: added ? T.greenLight : T.green,
            color: added ? T.green : "#fff",
            border: added ? `1.5px solid ${T.green}` : "none",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: T.font, transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          {added ? "✓ Added to cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

function HiddenSection({ items, onShow, shown }) {
  return (
    <div style={{ marginTop: 32 }}>
      <button
        onClick={onShow}
        style={{
          width: "100%", background: T.card,
          border: `1.5px dashed ${T.border}`,
          borderRadius: 16, padding: "16px", cursor: "pointer",
          fontFamily: T.font, display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🙈</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
              {items.length} discounts hidden
            </div>
            <div style={{ fontSize: 11, color: T.textSub }}>
              Cleaning, Cosmetics, Household — not your categories
            </div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: T.textSub, fontWeight: 600 }}>
          {shown ? "Hide ▲" : "Show ▼"}
        </span>
      </button>

      {shown && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 14, padding: "14px 16px", opacity: 0.6,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ fontSize: 28 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.name}</div>
                <div style={{ fontSize: 11, color: T.textSub }}>{item.brand} · -{item.discount}%</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.muted }}>₼{item.newPrice.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BravoPersonalizedCampaigns() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);

  const filtered = activeFilter === "All"
    ? FOR_YOU
    : FOR_YOU.filter(d => d.category === activeFilter);

  const handleAdd = (id) => {
    setCart(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  };

  const totalSaving = cart.reduce((s, id) => {
    const item = allDiscounts.find(d => d.id === id);
    return s + (item ? item.originalPrice - item.newPrice : 0);
  }, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: T.font,
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
    }}>

      {/* ── STATUS BAR ── */}
      <div style={{ background: T.navy, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <span style={{ fontSize: 12, color: "#94a3b8", letterSpacing: "0.04em" }}>9:41</span>
        <div style={{ display: "flex", gap: 6 }}>
          {["▌▌▌", "WiFi", "🔋"].map((s, i) => (
            <span key={i} style={{ fontSize: 10, color: "#94a3b8" }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── TOP BAR ── */}
      <div style={{
        background: T.navy,
        padding: "16px 20px 20px",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>👋 Salam, {userProfile.name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Sənin üçün endirimlər
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "#1e293b",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, cursor: "pointer",
            }}>🛒</div>
            {cart.length > 0 && (
              <div style={{
                position: "absolute", top: -4, right: -4,
                width: 18, height: 18, borderRadius: "50%",
                background: T.red, color: "#fff",
                fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{cart.length}</div>
            )}
          </div>
        </div>

        {/* Cashback + savings strip */}
        <div style={{
          background: "rgba(255,255,255,0.07)", borderRadius: 14,
          padding: "12px 14px", display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 16,
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Cashback balansı</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.greenMid }}>₼{userProfile.cashback.toFixed(2)}</div>
          </div>
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
          <div>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Seçilən endirim</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b" }}>₼{totalSaving.toFixed(2)}</div>
          </div>
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
          <div>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Uyğunluq</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{FOR_YOU.length} məhsul</div>
          </div>
        </div>

        {/* AI match explanation */}
        <div style={{
          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 12, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>🧠</span>
          <div style={{ fontSize: 12, color: "#86efac", lineHeight: 1.4 }}>
            <b>AI seçimi:</b> Alış tarixçənə əsasən sənin üçün {FOR_YOU.length} endirim tapıldı.{" "}
            <span style={{ color: "#4ade80" }}>Sabun, təmizlik məhsulları</span> göstərilmir.
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px 100px" }}>

        {/* ── YOUR CATEGORIES ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Kateqoriyalarım</div>
            <button
              onClick={() => setShowPrefs(!showPrefs)}
              style={{ fontSize: 11, color: T.green, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: T.font }}
            >
              {showPrefs ? "Bağla" : "Tənzimlə"}
            </button>
          </div>

          {/* Category filter pills */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {CATEGORY_FILTERS.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                flexShrink: 0,
                background: activeFilter === cat ? T.green : T.card,
                color: activeFilter === cat ? "#fff" : T.textSub,
                border: `1.5px solid ${activeFilter === cat ? T.green : T.border}`,
                borderRadius: 20, padding: "8px 16px",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: T.font, transition: "all 0.2s",
              }}>
                {cat === "All" ? "Hamısı" :
                 cat === "Dairy" ? "🥛 Süd" :
                 cat === "Meat" ? "🍗 Ət" :
                 cat === "Fruits" ? "🍓 Meyvə" :
                 cat === "Bakery" ? "🍞 Çörək" : "🍊 İçki"}
              </button>
            ))}
          </div>

          {/* Preferences panel */}
          {showPrefs && (
            <div style={{
              marginTop: 12, background: T.card, borderRadius: 16,
              padding: "16px", border: `1px solid ${T.border}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 10 }}>
                🎯 AI mənim nəyi bilir?
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {userProfile.frequentProducts.map(p => (
                  <span key={p} style={{
                    background: T.greenLight, color: T.green,
                    borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600,
                  }}>✓ {p}</span>
                ))}
              </div>
              <div style={{ fontSize: 11, color: T.textSub, marginBottom: 8 }}>Gizlədilən kateqoriyalar:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {userProfile.dislikedCategories.map(c => (
                  <span key={c} style={{
                    background: T.redLight, color: T.red,
                    borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600,
                  }}>✕ {c}</span>
                ))}
              </div>
              <button style={{
                marginTop: 12, width: "100%", background: T.bg,
                border: `1px solid ${T.border}`, borderRadius: 10,
                padding: "9px", fontSize: 12, fontWeight: 600,
                color: T.text, cursor: "pointer", fontFamily: T.font,
              }}>
                Seçimləri dəyiş →
              </button>
            </div>
          )}
        </div>

        {/* ── AI PICK OF THE DAY ── */}
        {activeFilter === "All" && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>
              ⚡ AI-ın bugünkü seçimi
            </div>
            {(() => {
              const top = FOR_YOU[0];
              const tag = tagStyle(top.tag);
              return (
                <div style={{
                  background: `linear-gradient(135deg, ${T.navy}, #1a2f4a)`,
                  borderRadius: 20, padding: "20px",
                  display: "flex", gap: 16, alignItems: "center",
                  boxShadow: "0 4px 20px rgba(15,23,42,0.2)",
                }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 16,
                    background: "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 44, flexShrink: 0,
                  }}>
                    {top.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "inline-flex", gap: 4, alignItems: "center",
                      background: "rgba(34,197,94,0.15)", color: T.greenMid,
                      borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, marginBottom: 6,
                    }}>
                      🎯 Sənin üçün #{1}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4, lineHeight: 1.3 }}>
                      {top.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: T.greenMid }}>₼{top.newPrice.toFixed(2)}</span>
                      <span style={{ fontSize: 13, color: "#475569", textDecoration: "line-through" }}>₼{top.originalPrice.toFixed(2)}</span>
                      <span style={{ fontSize: 12, background: T.red, color: "#fff", borderRadius: 8, padding: "2px 7px", fontWeight: 700 }}>
                        -{top.discount}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAdd(top.id)}
                    style={{
                      background: cart.includes(top.id) ? "rgba(34,197,94,0.2)" : T.greenMid,
                      color: cart.includes(top.id) ? T.greenMid : "#fff",
                      border: "none", borderRadius: 12, padding: "10px 16px",
                      fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: T.font,
                      flexShrink: 0, transition: "all 0.2s",
                    }}
                  >
                    {cart.includes(top.id) ? "✓" : "+ Əlavə et"}
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── SECTION LABEL ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
            {activeFilter === "All" ? `Sənin endirimlərın (${filtered.length})` : `${activeFilter} endirimleri (${filtered.length})`}
          </div>
          <div style={{ fontSize: 11, color: T.textSub }}>
            Uyğunluğa görə sıralandı ↓
          </div>
        </div>

        {/* ── PRODUCT GRID ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 8,
        }}>
          {filtered.slice(activeFilter === "All" ? 1 : 0).map(item => (
            <DiscountCard
              key={item.id}
              item={item}
              cashback={userProfile.purchaseHistory.includes(item.category)}
              onAdd={handleAdd}
              added={cart.includes(item.id)}
            />
          ))}
        </div>

        {/* ── HIDDEN ITEMS ── */}
        {activeFilter === "All" && (
          <HiddenSection
            items={NOT_FOR_YOU}
            onShow={() => setShowHidden(s => !s)}
            shown={showHidden}
          />
        )}

      </div>

      {/* ── BOTTOM CART BAR — appears at end of scroll content ── */}
      {cart.length > 0 && (
        <div style={{
          background: T.navy,
          padding: "14px 20px",
          marginTop: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{cart.length} məhsul seçilib</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
              ₼{totalSaving.toFixed(2)} qənaət
            </div>
          </div>
          <button style={{
            background: T.greenMid, color: "#fff", border: "none",
            borderRadius: 12, padding: "11px 20px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: T.font,
          }}>
            Səbəti aç →
          </button>
        </div>
      )}

    </div>
  );
}