import { useState, type FormEvent } from "react";
import { useNavigate, Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { authApi } from "../api/client";

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, whiteSpace: "nowrap" }}>or continue with</span>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
    </div>
  );
}

function SocialButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01, boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        padding: "11px 16px", background: "#ffffff",
        border: "1.5px solid #E5E7EB", borderRadius: 8,
        fontSize: 14, fontWeight: 500, color: "#0A0F1E",
        fontFamily: "Inter, sans-serif", cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#0A0F1E"}
      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"}
    >
      {icon}
      {label}
    </motion.button>
  );
}

export function LoginPage() {
  const { login }  = useAuth();
  const { t }      = useLang();
  const a          = t.auth;
  const navigate   = useNavigate();

  const [searchParams] = useSearchParams();

  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending]   = useState(false);
  const [resentMsg, setResentMsg]   = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState("");

  // Banners set by the email-link redirect (/login?verified=1 or ?verify_error=1)
  const justVerified = searchParams.get("verified") === "1";
  const verifyError  = searchParams.get("verify_error") === "1";

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setUnverified(false); setResentMsg(""); setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "employer" ? "/employer/dashboard" : "/worker/dashboard", { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg.toLowerCase().includes("verify your email")) {
        setUnverified(true);
        setError("Your email is not verified. Check your inbox or resend the link.");
      } else {
        setError(msg);
      }
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setResentMsg("Enter your email above first.");
      return;
    }
    setResending(true);
    setResentMsg("");
    try {
      const res = await authApi.resendVerification(email.trim());
      setResentMsg(
        res.sent
          ? "Verification email sent. Check your inbox."
          : "If that account exists and is unverified, a new link was sent."
      );
    } catch (e: unknown) {
      setResentMsg(e instanceof Error ? e.message : "Could not resend. Try again in a minute.");
    } finally {
      setResending(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 14,
    border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none",
    fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: "#fff", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 560, background: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "40px 40px" }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "block", marginBottom: 28 }}>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#0A0F1E" }}>EN</span><span style={{ color: "#C9A84C" }}>TR</span>
          </span>
        </Link>

        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{a.welcomeBack}</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0F1E", margin: "0 0 24px" }}>{a.signInTitle}</h1>

        {justVerified && (
          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#16A34A", marginBottom: 18, display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
            Email verified! You can log in now.
          </div>
        )}
        {verifyError && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#DC2626", marginBottom: 18 }}>
            That verification link is invalid or was already used. Log in, or resend the link from the signup confirmation page.
          </div>
        )}
        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#DC2626", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
              {error}
            </div>
            {unverified && (
              <div style={{ marginTop: 10 }}>
                <button type="button" onClick={handleResend} disabled={resending}
                  style={{ padding: "8px 16px", background: resending ? "#F3F4F6" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: resending ? "not-allowed" : "pointer" }}>
                  {resending ? "Sending…" : "Resend verification email"}
                </button>
                {resentMsg && <p style={{ fontSize: 12.5, color: "#16A34A", margin: "8px 0 0" }}>{resentMsg}</p>}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>{a.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="you@example.com" style={inputBase}
              onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#0A0F1E" }}>{a.password}</label>
              <Link to="/forgot-password" style={{ fontSize: 12, color: "#C9A84C", fontWeight: 500, textDecoration: "none" }}>Forgot password?</Link>
            </div>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{ ...inputBase, paddingRight: 38 }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", alignItems: "center", padding: 2 }} tabIndex={-1}>
                {showPw
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={loading ? {} : { scale: 1.01 }} whileTap={loading ? {} : { scale: 0.98 }}
            style={{ marginTop: 6, padding: "13px", background: loading ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}>
            {loading ? a.signingIn : a.signIn}
          </motion.button>
        </form>

        <Divider />

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SocialButton
            onClick={() => showToast("Google sign-in is coming soon.")}
            label="Continue with Google"
            icon={
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.1 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6.3-6.3C34.4 5.9 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-7.9 19.7-20 0-1.3-.1-2.7-.2-4z"/>
                <path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3 0 5.7 1.1 7.8 2.9l6.3-6.3C34.4 5.9 29.5 4 24 4 16.1 4 9.3 8.4 6.3 14.7z"/>
                <path fill="#FBBC05" d="M24 44c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.5 35.5 26.9 36 24 36c-5.6 0-10.1-2.9-11.7-7.5l-7 5.4C8.2 39.8 15.5 44 24 44z"/>
                <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.8 2.3-2.2 4.3-4.1 5.8l6.5 5.3C41.8 36.3 44.5 30.6 44.5 24c0-1.3-.1-2.7-.2-4z"/>
              </svg>
            }
          />
          <SocialButton
            onClick={() => showToast("Phone sign-in is coming soon.")}
            label="Continue with Phone Number"
            icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            }
          />
        </div>

        <p style={{ marginTop: 24, fontSize: 14, color: "#6B7280", textAlign: "center" }}>
          {a.noAccount}{" "}
          <Link to="/signup" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "none" }}>{a.signUpLink}</Link>
        </p>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#0A0F1E", color: "#ffffff", fontSize: 13, fontWeight: 500, padding: "10px 20px", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 999, whiteSpace: "nowrap", fontFamily: "Inter, sans-serif" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
