import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router";
import { motion } from "motion/react";
import { authApi } from "../api/client";

const API_BASE = "https://entr-production.up.railway.app";

async function verifyToken(token: string): Promise<{ ok: boolean; role?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Email arrives via router state from the signup page
  const email: string =
    (location.state as { email?: string } | null)?.email ||
    searchParams.get("email") ||
    "";

  const [state, setState] = useState<"pending" | "verifying" | "success" | "error">(
    token ? "verifying" : "pending"
  );
  const [errMsg, setErrMsg] = useState("");
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState("");
  const [resendEmail, setResendEmail] = useState(email);

  // Legacy path: verify when a token is in the URL (new emails link to the
  // backend directly, which redirects to /login?verified=1)
  useEffect(() => {
    if (!token) return;
    setState("verifying");
    verifyToken(token)
      .then((res) => {
        if (res.ok) {
          setState("success");
          setTimeout(() => navigate("/login?verified=1", { replace: true }), 2000);
        } else {
          setState("error");
          setErrMsg(res.error ?? "Verification failed.");
        }
      })
      .catch(() => {
        setState("error");
        setErrMsg("Could not connect to the server.");
      });
  }, [token]);

  const handleResend = async () => {
    const target = (resendEmail || email).trim();
    if (!target) {
      setResentMsg("Please enter your email address.");
      return;
    }
    setResending(true);
    setResentMsg("");
    try {
      const res = await authApi.resendVerification(target);
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

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 14,
    border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none",
    fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: "#fff",
    boxSizing: "border-box", textAlign: "center",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 520, background: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "48px 44px", textAlign: "center" }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 32 }}>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#0A0F1E" }}>EN</span><span style={{ color: "#C9A84C" }}>TR</span>
          </span>
        </Link>

        {/* Verifying */}
        {state === "verifying" && (
          <>
            <div style={{ width: 48, height: 48, border: "3px solid #E5E7EB", borderTop: "3px solid #C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0F1E", margin: "0 0 8px" }}>Verifying your email...</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Just a moment.</p>
          </>
        )}

        {/* Success */}
        {state === "success" && (
          <>
            <div style={{ width: 56, height: 56, background: "#DCFCE7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none" aria-hidden="true">
                <path d="M2 10l7 8L22 2" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Email Verified</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0F1E", margin: "0 0 10px" }}>You are all set!</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Taking you to the login page...</p>
          </>
        )}

        {/* Error */}
        {state === "error" && (
          <>
            <div style={{ width: 56, height: 56, background: "#FEF2F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#DC2626"/>
              </svg>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Verification Failed</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0F1E", margin: "0 0 10px" }}>Invalid or expired link</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 20px" }}>{errMsg}</p>
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address for resend"
              style={{ ...inputStyle, marginBottom: 10, maxWidth: 320 }}
            />
            <button onClick={handleResend} disabled={resending}
              style={{ padding: "11px 24px", background: resending ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: resending ? "not-allowed" : "pointer", boxShadow: resending ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}>
              {resending ? "Sending..." : "Resend verification email"}
            </button>
            {resentMsg && <p style={{ fontSize: 13, color: "#16A34A", marginTop: 12 }}>{resentMsg}</p>}
          </>
        )}

        {/* Pending: just signed up */}
        {state === "pending" && (
          <>
            <div style={{ width: 56, height: 56, background: "#FFF9E6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="26" height="22" viewBox="0 0 24 20" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22 6 12 13 2 6"/>
              </svg>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Check Your Email</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0F1E", margin: "0 0 10px" }}>Check your email</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 28px", lineHeight: 1.6 }}>
              We sent a verification link to <strong style={{ color: "#0A0F1E" }}>{email || "your email address"}</strong>.
              Click it to activate your account.
            </p>

            {!email && (
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address for resend"
                style={{ ...inputStyle, marginBottom: 10, maxWidth: 320 }}
              />
            )}
            <button onClick={handleResend} disabled={resending}
              style={{ padding: "11px 22px", background: resending ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: resending ? "not-allowed" : "pointer", boxShadow: resending ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}>
              {resending ? "Sending..." : "Resend email"}
            </button>

            {resentMsg && (
              <p style={{ fontSize: 13, color: "#16A34A", marginTop: 12, fontWeight: 500 }}>{resentMsg}</p>
            )}

            <p style={{ marginTop: 28, fontSize: 13, color: "#9CA3AF" }}>
              Already clicked the link?{" "}
              <Link to="/login" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "none" }}>Log in</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
