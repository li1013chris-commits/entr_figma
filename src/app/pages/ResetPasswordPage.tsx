import { useState, type FormEvent } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { authApi } from "../api/client";

function getStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (pw.length < 8) return { level: 0, label: "Too short", color: "#E5E7EB" };
  let score = 0;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "#EF4444" };
  if (score === 2) return { level: 2, label: "Fair", color: "#F59E0B" };
  return { level: 3, label: "Strong", color: "#22C55E" };
}

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { level, label, color } = getStrength(password);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ flex: 1, height: 3, borderRadius: 99, background: level >= n ? color : "#E5E7EB", transition: "background 0.25s" }} />
        ))}
      </div>
      {level > 0 && <p style={{ fontSize: 11, color, margin: 0, fontWeight: 600 }}>{label} password</p>}
      {level === 0 && password.length > 0 && <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>At least 8 characters required</p>}
    </div>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getStrength(password);
  const passwordsMatch = password.length >= 8 && confirm === password;
  const canSubmit = !!token && password.length >= 8 && passwordsMatch && strength.level >= 1;

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 14,
    border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none",
    fontFamily: "Inter, sans-serif", color: "#0A0F1E",
    background: "#fff", boxSizing: "border-box",
  };

  const eyeBtn: React.CSSProperties = {
    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", color: "#9CA3AF",
    display: "flex", alignItems: "center", padding: 2,
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      navigate("/login?reset=success", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: 480, background: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "40px 40px", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0A0F1E", margin: "0 0 10px" }}>Invalid reset link</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>This link is missing a reset token. Please request a new one.</p>
          <Link to="/forgot-password" style={{ display: "inline-block", padding: "11px 24px", background: "#C9A84C", color: "#0A0F1E", fontWeight: 600, fontSize: 14, textDecoration: "none", borderRadius: 8 }}>
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 480, background: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "40px 40px" }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "block", marginBottom: 28 }}>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#0A0F1E" }}>EN</span><span style={{ color: "#C9A84C" }}>TR</span>
          </span>
        </Link>

        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>New password</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0F1E", margin: "0 0 8px" }}>Reset your password</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 24px" }}>Choose a strong new password for your account.</p>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#DC2626", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>New password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="At least 8 characters"
                style={{ ...inputBase, paddingRight: 38 }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn} tabIndex={-1}>
                <EyeIcon visible={showPassword} />
              </button>
            </div>
            <StrengthBar password={password} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>Confirm password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                required placeholder="Re-enter your password"
                style={{ ...inputBase, paddingRight: 38, ...(passwordsMatch ? { borderColor: "#22C55E" } : {}) }}
                onFocus={(e) => { if (!passwordsMatch) e.target.style.borderColor = "#C9A84C"; }}
                onBlur={(e) => { e.target.style.borderColor = passwordsMatch ? "#22C55E" : "#E5E7EB"; }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn} tabIndex={-1}>
                <EyeIcon visible={showConfirm} />
              </button>
            </div>
            {confirm.length > 0 && passwordsMatch && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 12, color: "#22C55E", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Passwords match
              </motion.p>
            )}
            {confirm.length > 0 && !passwordsMatch && (
              <p style={{ fontSize: 12, color: "#EF4444", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
                Passwords do not match
              </p>
            )}
          </div>

          <motion.button
            type="submit" disabled={!canSubmit || loading}
            whileHover={!canSubmit || loading ? {} : { scale: 1.01 }}
            whileTap={!canSubmit || loading ? {} : { scale: 0.98 }}
            style={{ marginTop: 6, padding: "13px", background: !canSubmit || loading ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: !canSubmit || loading ? "not-allowed" : "pointer", boxShadow: !canSubmit || loading ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}
          >
            {loading ? "Saving…" : "Set new password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
