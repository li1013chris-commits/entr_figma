import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

const API = "/api";

async function verifyToken(token: string): Promise<{ ok: boolean; role?: string; error?: string }> {
  const res = await fetch(`${API}/auth/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

async function resend(): Promise<{ ok: boolean; sent: boolean; error?: string }> {
  const res = await fetch(`${API}/auth/resend-verification`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export function VerifyEmailPage() {
  const [searchParams]      = useSearchParams();
  const navigate             = useNavigate();
  const { user, fetchMe }   = useAuth();
  const token               = searchParams.get("token");

  const [state, setState] = useState<"pending" | "verifying" | "success" | "error">(
    token ? "verifying" : "pending"
  );
  const [errMsg, setErrMsg]     = useState("");
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState("");

  // Auto-verify when token is in the URL
  useEffect(() => {
    if (!token) return;
    setState("verifying");
    verifyToken(token).then(async (res) => {
      if (res.ok) {
        await fetchMe();
        setState("success");
        const role = res.role ?? user?.role;
        setTimeout(() => {
          navigate(role === "employer" ? "/employer/dashboard" : "/worker/dashboard", { replace: true });
        }, 2500);
      } else {
        setState("error");
        setErrMsg(res.error ?? "Verification failed.");
      }
    }).catch(() => {
      setState("error");
      setErrMsg("Could not connect to the server.");
    });
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    setResentMsg("");
    try {
      const res = await resend();
      if (res.ok) {
        setResentMsg(
          res.sent
            ? "Verification email sent. Check your inbox."
            : "Verification link printed to server console (SMTP not configured)."
        );
      } else {
        setResentMsg(res.error ?? "Could not resend.");
      }
    } catch {
      setResentMsg("Could not connect to the server.");
    } finally {
      setResending(false);
    }
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
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                <path d="M2 10l7 8L22 2" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Email Verified</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0F1E", margin: "0 0 10px" }}>You are all set!</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Redirecting you to your dashboard...</p>
          </>
        )}

        {/* Error */}
        {state === "error" && (
          <>
            <div style={{ width: 56, height: 56, background: "#FEF2F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#DC2626"/>
              </svg>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Verification Failed</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0F1E", margin: "0 0 10px" }}>Invalid or expired link</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>{errMsg}</p>
            {user && (
              <button onClick={handleResend} disabled={resending}
                style={{ padding: "11px 24px", background: resending ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: resending ? "not-allowed" : "pointer", boxShadow: resending ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}>
                {resending ? "Sending..." : "Resend verification email"}
              </button>
            )}
            {resentMsg && <p style={{ fontSize: 13, color: "#16A34A", marginTop: 12 }}>{resentMsg}</p>}
          </>
        )}

        {/* Pending: no token in URL */}
        {state === "pending" && (
          <>
            <div style={{ width: 56, height: 56, background: "#FFF9E6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="26" height="22" viewBox="0 0 24 20" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22 6 12 13 2 6"/>
              </svg>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Check Your Inbox</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0F1E", margin: "0 0 10px" }}>Verify your email address</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 6px", lineHeight: 1.6 }}>
              We sent a confirmation link to <strong>{user?.email ?? "your email address"}</strong>.
            </p>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 28px" }}>
              Click the link in that email to activate your account.
            </p>

            {user && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={handleResend} disabled={resending}
                  style={{ padding: "11px 22px", background: resending ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: resending ? "not-allowed" : "pointer", boxShadow: resending ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}>
                  {resending ? "Sending..." : "Resend email"}
                </button>
                <button onClick={() => navigate(user.role === "employer" ? "/employer/dashboard" : "/worker/dashboard", { replace: true })}
                  style={{ padding: "10px 22px", background: "transparent", color: "#6B7280", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif", cursor: "pointer" }}>
                  Continue anyway
                </button>
              </div>
            )}

            {resentMsg && (
              <p style={{ fontSize: 13, color: "#16A34A", marginTop: 12, fontWeight: 500 }}>{resentMsg}</p>
            )}

            <p style={{ marginTop: 28, fontSize: 13, color: "#9CA3AF" }}>
              No SMTP configured?{" "}
              <span style={{ color: "#6B7280" }}>The link is printed in the server console.</span>
            </p>

            <p style={{ marginTop: 16, fontSize: 13 }}>
              <Link to="/" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "none" }}>Back to home</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
