import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BRAND = {
  bg: "#ffffff",
  surface: "#f5f7f5",
  card: "#f0f4f0",
  border: "#d4e0d4",
  borderHover: "#b8ccb8",
  green: "#16a34a",
  greenDark: "#14532d",
  greenDim: "#dcfce7",
  muted: "#4a7a4a",
  text: "#0a150a",
  textSub: "#2d5a2d",
  textDim: "#6b9e6b",
  danger: "#b91c1c",
};

const s = {
  root: {
    minHeight: "100vh",
    background: BRAND.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(${BRAND.border} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.border} 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
    opacity: 0.4,
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    top: "-120px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "600px",
    height: "400px",
    background: "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: BRAND.card,
    border: `1px solid ${BRAND.border}`,
    borderRadius: "20px",
    padding: "48px 44px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 0 0 1px rgba(34,197,94,0.05), 0 32px 64px rgba(0,0,0,0.6)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    background: BRAND.greenDim,
    border: `1px solid ${BRAND.greenDark}`,
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  logoText: {
    fontSize: "15px",
    fontWeight: "600",
    color: BRAND.green,
    letterSpacing: "0.02em",
  },
  logoSub: {
    fontSize: "11px",
    color: BRAND.textDim,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginTop: "1px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: BRAND.text,
    margin: "0 0 6px",
    letterSpacing: "-0.02em",
  },
  subheading: {
    fontSize: "14px",
    color: BRAND.textSub,
    margin: "0 0 32px",
  },
  inputWrap: {
    position: "relative",
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    background: BRAND.surface,
    border: `1px solid ${BRAND.border}`,
    borderRadius: "10px",
    padding: "12px 14px 12px 42px",
    fontSize: "14px",
    color: BRAND.text,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: BRAND.muted,
    fontSize: "16px",
    pointerEvents: "none",
  },
  inputEye: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: BRAND.muted,
    fontSize: "15px",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  },
  strengthWrap: {
    marginTop: "-8px",
    marginBottom: "16px",
  },
  strengthBar: {
    display: "flex",
    gap: "4px",
    marginBottom: "4px",
  },
  strengthLabel: {
    fontSize: "11px",
  },
  btn: {
    width: "100%",
    background: BRAND.green,
    color: "#0a0f0a",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.02em",
    marginTop: "4px",
    transition: "background 0.2s, transform 0.1s",
    fontFamily: "inherit",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: BRAND.border,
  },
  dividerText: {
    fontSize: "12px",
    color: BRAND.textDim,
    letterSpacing: "0.04em",
  },
  oauthBtn: {
    width: "100%",
    background: BRAND.surface,
    border: `1px solid ${BRAND.border}`,
    borderRadius: "10px",
    padding: "11px",
    fontSize: "13px",
    fontWeight: "500",
    color: BRAND.text,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "10px",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  checkRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "20px",
    marginTop: "4px",
  },
  checkbox: {
    marginTop: "2px",
    accentColor: BRAND.green,
    cursor: "pointer",
    width: "14px",
    height: "14px",
    flexShrink: 0,
  },
  checkLabel: {
    fontSize: "12px",
    color: BRAND.textSub,
    lineHeight: "1.5",
  },
  switchRow: {
    textAlign: "center",
    marginTop: "28px",
    fontSize: "13px",
    color: BRAND.textSub,
  },
  switchLink: {
    color: BRAND.green,
    fontWeight: "600",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "13px",
    fontFamily: "inherit",
  },
  error: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#fca5a5",
    marginBottom: "16px",
  },
  success: {
    background: "rgba(34,197,94,0.08)",
    border: "1px solid rgba(34,197,94,0.25)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: BRAND.green,
    marginBottom: "16px",
  },
};

function getPasswordStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "#ef4444", "#f59e0b", "#3b82f6", BRAND.green];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="0" y="0" width="7.5" height="7.5" fill="#F25022"/>
      <rect x="8.5" y="0" width="7.5" height="7.5" fill="#7FBA00"/>
      <rect x="0" y="8.5" width="7.5" height="7.5" fill="#00A4EF"/>
      <rect x="8.5" y="8.5" width="7.5" height="7.5" fill="#FFB900"/>
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = () => {
    setError("");
    setSuccess("");
    if (!form.name || !form.email || !form.password || !form.confirm)
      return setError("Please fill in all fields.");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    if (strength < 2)
      return setError("Please use a stronger password.");
    if (!agreed)
      return setError("Please accept the terms to continue.");
    setSuccess("Account created! Check your email to verify.");
    // TODO: connect real auth
  };

  const focusStyle = (e) => (e.target.style.borderColor = BRAND.greenDark);
  const blurStyle = (e) => (e.target.style.borderColor = BRAND.border);

  return (
    <div style={s.root}>
      <div style={s.grid} />
      <div style={s.glow} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoRow}>
          <div style={s.logoIcon}>♻</div>
          <div>
            <div style={s.logoText}>ProfitLoop AI</div>
            <div style={s.logoSub}>Retail Recovery System</div>
          </div>
        </div>

        <h1 style={s.heading}>Create account</h1>
        <p style={s.subheading}>Start recovering profit autonomously</p>

        {error && <div style={s.error}>⚠ {error}</div>}
        {success && <div style={s.success}>✓ {success}</div>}

        {/* Full name */}
        <div style={s.inputWrap}>
          <span style={s.inputIcon}>👤</span>
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={set("name")}
            style={s.input}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* Email */}
        <div style={s.inputWrap}>
          <span style={s.inputIcon}>✉</span>
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={set("email")}
            style={s.input}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* Password */}
        <div style={s.inputWrap}>
          <span style={s.inputIcon}>🔒</span>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={set("password")}
            style={s.input}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
          <button
            style={s.inputEye}
            onClick={() => setShowPass(p => !p)}
            type="button"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? "🙈" : "👁"}
          </button>
        </div>

        {/* Strength bar */}
        {form.password && (
          <div style={s.strengthWrap}>
            <div style={s.strengthBar}>
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "3px",
                    borderRadius: "2px",
                    background: i <= strength ? strengthColors[strength] : BRAND.border,
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
            <span style={{ ...s.strengthLabel, color: strengthColors[strength] }}>
              {strengthLabels[strength]}
            </span>
          </div>
        )}

        {/* Confirm password */}
        <div style={s.inputWrap}>
          <span style={s.inputIcon}>🔒</span>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            value={form.confirm}
            onChange={set("confirm")}
            style={s.input}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
          <button
            style={s.inputEye}
            onClick={() => setShowConfirm(p => !p)}
            type="button"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirm ? "🙈" : "👁"}
          </button>
        </div>

        {/* Terms */}
        <div style={s.checkRow}>
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            style={s.checkbox}
          />
          <label htmlFor="agree" style={s.checkLabel}>
            I agree to the{" "}
            <span style={{ color: BRAND.green, cursor: "pointer" }}>Terms of Service</span>
            {" "}and{" "}
            <span style={{ color: BRAND.green, cursor: "pointer" }}>Privacy Policy</span>
          </label>
        </div>

        {/* Submit */}
        <button
          style={s.btn}
          onClick={handleSubmit}
          onMouseEnter={e => (e.target.style.background = BRAND.greenDark)}
          onMouseLeave={e => (e.target.style.background = BRAND.green)}
          onMouseDown={e => (e.target.style.transform = "scale(0.98)")}
          onMouseUp={e => (e.target.style.transform = "scale(1)")}
        >
          Create account →
        </button>

        {/* OAuth */}
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>or continue with</span>
          <div style={s.dividerLine} />
        </div>
        <button
          style={s.oauthBtn}
          onMouseEnter={e => (e.currentTarget.style.borderColor = BRAND.borderHover)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = BRAND.border)}
        >
          <GoogleIcon /> Google
        </button>
        <button
          style={s.oauthBtn}
          onMouseEnter={e => (e.currentTarget.style.borderColor = BRAND.borderHover)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = BRAND.border)}
        >
          <MicrosoftIcon /> Microsoft
        </button>

        {/* Switch to Login */}
        <div style={s.switchRow}>
          Already have an account?{" "}
          <button style={s.switchLink} onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
