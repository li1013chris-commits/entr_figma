import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { authApi } from "../api/client";
import { BackArrow } from "../components/BackArrow";
import { LanguageDropdown } from "../components/LanguageDropdown";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 14,
    border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none",
    fontFamily: "Inter, sans-serif", color: "#0A0F1E",
    background: "#fff", boxSizing: "border-box",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <BackArrow floating />
      <div style={{ position: "fixed", top: 20, right: 24, zIndex: 200 }}>
        <LanguageDropdown compact />
      </div>
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

        {submitted ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0A0F1E", margin: "0 0 10px" }}>Check your email</h1>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: "0 0 24px" }}>
              If an account exists for <strong style={{ color: "#0A0F1E" }}>{email}</strong>, we've sent a reset link. It expires in 1 hour.
            </p>
            <Link to="/login" style={{ display: "block", textAlign: "center", padding: "12px", background: "#C9A84C", color: "#0A0F1E", fontWeight: 600, fontSize: 14, textDecoration: "none", borderRadius: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}>
              Back to log in
            </Link>
          </motion.div>
        ) : (
          <>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Password reset</p>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0F1E", margin: "0 0 8px" }}>Forgot your password?</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>
              Enter the email for your account. We'll send you a link to reset your password.
            </p>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#DC2626", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>Email address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required placeholder="you@example.com" style={inputBase}
                  onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
              <motion.button
                type="submit" disabled={loading || !email}
                whileHover={loading || !email ? {} : { scale: 1.01 }}
                whileTap={loading || !email ? {} : { scale: 0.98 }}
                style={{ marginTop: 6, padding: "13px", background: loading || !email ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: loading || !email ? "not-allowed" : "pointer", boxShadow: loading || !email ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </motion.button>
            </form>

            <p style={{ marginTop: 24, fontSize: 14, color: "#6B7280", textAlign: "center" }}>
              Remember your password?{" "}
              <Link to="/login" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "none" }}>Log in</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
