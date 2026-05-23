import BravoPersonalizedCampaigns from "../pages/BravoPersonalizedCampaigns ";


export default function PhoneFrame() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        backgroundImage:
          "linear-gradient(#white 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: "40px 20px",
      }}
    >
      {/* glow blob */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgb(255, 255, 255) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* top label */}
        <div
          style={{
            fontSize: 11,
            color: "#3d5c3d",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Bravo App · Personalized Campaigns
        </div>

        {/* phone shell */}
        <div
          style={{
            width: 390,
            background: "#0a0a0a",
            borderRadius: 52,
            padding: "12px",
            boxShadow:
              "0 0 0 1px #2a2a2a, 0 0 0 3px #111, 0 48px 96px rgba(0,0,0,0.9), inset 0 1px 0 #444",
            position: "relative",
          }}
        >
          {/* physical buttons */}
          {[
            { side: "left", top: 100, h: 32 },
            { side: "left", top: 144, h: 56 },
            { side: "left", top: 210, h: 56 },
            { side: "right", top: 160, h: 80 },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                [b.side]: -3,
                top: b.top,
                width: 3,
                height: b.h,
                background: "#2a2a2a",
                borderRadius:
                  b.side === "left" ? "2px 0 0 2px" : "0 2px 2px 0",
              }}
            />
          ))}

          {/* screen — the key: overflow hidden + fixed height + no position:fixed children */}
          <div
            style={{
              borderRadius: 42,
              overflow: "hidden",
              height: 780,
              background: "#f7f6f2",
              position: "relative", // ← children use position:absolute/sticky inside here
            }}
          >
            {/* dynamic island */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 34,
                background: "#0a0a0a",
                borderRadius: 20,
                zIndex: 200,
                pointerEvents: "none",
              }}
            />

            {/* scrollable content area — leaves room for fixed bottom nav */}
            <div
              style={{
                height: "100%",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                // padding bottom so content doesn't hide behind bottom nav
                paddingBottom: 64,
                boxSizing: "border-box",
              }}
            >
              <BravoPersonalizedCampaigns />
            </div>

            {/* bottom nav — pinned inside the phone screen */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "#fff",
                borderTop: "1px solid #e8e5de",
                display: "flex",
                justifyContent: "space-around",
                padding: "10px 0 14px",
                zIndex: 150,
              }}
            >
              {[
                { icon: "🏠", label: "Ana Səhifə" },
                { icon: "🛒", label: "Mağaza" },
                { icon: "🎁", label: "Endirimlər", active: true },
                { icon: "💳", label: "Cashback" },
                { icon: "👤", label: "Profil" },
              ].map((nav, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{nav.icon}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: nav.active ? 700 : 400,
                      color: nav.active ? "#16a34a" : "#9ca3af",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {nav.label}
                  </span>
                  {nav.active && (
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#16a34a",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom hint */}
        <div style={{ fontSize: 11, color: "#2a3c2a", letterSpacing: "0.08em" }}>
          scroll inside the phone ↕
        </div>
      </div>
    </div>
  );
}