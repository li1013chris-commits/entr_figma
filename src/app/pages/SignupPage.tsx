import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { authApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
  "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV",
  "WI","WY","DC",
];

function ageFromDob(dob: string): number | null {
  if (!dob) return null;
  const d = new Date(dob + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age;
}

function SocialButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button onClick={onClick}
      whileHover={{ scale: 1.01, boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.98 }}
      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 16px", background: "#ffffff", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#0A0F1E", fontFamily: "Inter, sans-serif", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#0A0F1E"}
      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"}>
      {icon}{label}
    </motion.button>
  );
}

// ── Password strength ─────────────────────────────────────────────────────────

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
          <div
            key={n}
            style={{
              flex: 1, height: 3, borderRadius: 99,
              background: level >= n ? color : "#E5E7EB",
              transition: "background 0.25s",
            }}
          />
        ))}
      </div>
      {level > 0 && (
        <p style={{ fontSize: 11, color, margin: 0, fontWeight: 600 }}>{label} password</p>
      )}
      {level === 0 && password.length > 0 && (
        <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>At least 8 characters required</p>
      )}
    </div>
  );
}

// ── Eye toggle ─────────────────────────────────────────────────────────────────

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

// ── Field label with optional required star ────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>
      {children}
      {required && <span style={{ color: "#EF4444", marginLeft: 3, fontWeight: 700 }}>*</span>}
    </label>
  );
}

// ── Inline field error ─────────────────────────────────────────────────────────

function FieldError({ msg }: { msg: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          style={{ fontSize: 12, color: "#EF4444", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
          </svg>
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function SignupPage() {
  const { fetchMe }       = useAuth();
  const { t }             = useLang();
  const a                 = t.auth;
  const navigate          = useNavigate();
  const [searchParams]    = useSearchParams();

  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirm, setConfirm]               = useState("");
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [role, setRole]                     = useState<"employer" | "worker">((searchParams.get("role") as "employer" | "worker") || "worker");
  const [restaurantName, setRestaurantName] = useState("");
  const [languagePref, setLanguagePref]     = useState("en");
  const [dateOfBirth, setDateOfBirth]       = useState("");
  const [usState, setUsState]               = useState("");
  const [tosAccepted, setTosAccepted]       = useState(false);
  const [apiError, setApiError]             = useState("");
  const [loading, setLoading]               = useState(false);
  const [submitted, setSubmitted]           = useState(false);
  const [toast, setToast]                   = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "employer" || r === "worker") setRole(r);
  }, [searchParams]);

  // ── Validation ───────────────────────────────────────────────────────────────

  const nameError         = submitted && !name.trim()               ? "Full name is required."          : "";
  const emailError        = submitted && !email.trim()              ? "Email address is required."
                          : submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address." : "";
  const passwordError     = submitted && password.length < 8        ? "Password must be at least 8 characters." : "";
  const confirmError      = (submitted || confirm.length > 0) && confirm && password !== confirm
                            ? "Passwords do not match."
                            : submitted && !confirm                 ? "Please confirm your password."   : "";
  const restaurantError   = submitted && role === "employer" && !restaurantName.trim()
                            ? "Restaurant name is required."        : "";
  const tosError          = submitted && !tosAccepted
                            ? "Please agree to the Privacy Policy and Terms of Service." : "";

  const strength = getStrength(password);
  const passwordsMatch = password.length >= 8 && confirm === password;
  const workerAge = role === "worker" ? ageFromDob(dateOfBirth) : null;
  const under18 = workerAge !== null && workerAge < 18;

  const isValid = name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    && password.length >= 8 && passwordsMatch && tosAccepted
    && (role !== "employer" || restaurantName.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setApiError("");
    setLoading(true);
    try {
      await authApi.signup({
        email, password, name, role,
        language_pref: languagePref,
        restaurant_name: restaurantName,
        tos_accepted: tosAccepted,
        date_of_birth: role === "worker" ? dateOfBirth : undefined,
        us_state: role === "worker" ? usState : undefined,
      });
      await fetchMe();
      navigate("/verify-email", { replace: true });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────────

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 14,
    border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none",
    fontFamily: "Inter, sans-serif", color: "#0A0F1E",
    background: "#fff", boxSizing: "border-box",
  };

  const inputError = (hasError: boolean): React.CSSProperties =>
    hasError ? { ...inputBase, borderColor: "#EF4444", background: "#FFF5F5" } : inputBase;

  const focus  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    { if (!(e.target.style.borderColor === "#EF4444")) e.target.style.borderColor = "#C9A84C"; };
  const blur   = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>, err: string) =>
    { e.target.style.borderColor = err ? "#EF4444" : "#E5E7EB"; };

  const pwWrap: React.CSSProperties = { position: "relative" };
  const eyeBtn: React.CSSProperties = {
    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", color: "#9CA3AF",
    display: "flex", alignItems: "center", padding: 2,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 650, background: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "40px 44px" }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "block", marginBottom: 28 }}>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#0A0F1E" }}>EN</span><span style={{ color: "#C9A84C" }}>TR</span>
          </span>
        </Link>

        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
          {a.getStartedFree}
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0F1E", margin: "0 0 6px" }}>{a.createAccountTitle}</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 24px" }}>
          Fields marked <span style={{ color: "#EF4444", fontWeight: 700 }}>*</span> are required.
        </p>

        {/* API error */}
        {apiError && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 14px", fontSize: 14, color: "#DC2626", marginBottom: 20 }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Role */}
          <div>
            <FieldLabel required>I am a</FieldLabel>
            <div style={{ display: "flex", gap: 10 }}>
              {(["employer", "worker"] as const).map((r) => (
                <label key={r} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: `1.5px solid ${role === r ? "#C9A84C" : "#E5E7EB"}`, borderRadius: 8, cursor: "pointer", background: role === r ? "#FFFBF0" : "#fff", transition: "all 0.15s" }}>
                  <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} style={{ accentColor: "#C9A84C" }} />
                  <span style={{ fontSize: 14, fontWeight: role === r ? 600 : 400, color: "#0A0F1E" }}>
                    {r === "employer" ? a.restaurantOwner : a.jobSeeker}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Full name */}
          <div>
            <FieldLabel required>{a.fullName}</FieldLabel>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              style={inputError(!!nameError)}
              onFocus={focus} onBlur={(e) => blur(e, nameError)} />
            <FieldError msg={nameError} />
          </div>

          {/* Email */}
          <div>
            <FieldLabel required>{a.email}</FieldLabel>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputError(!!emailError)}
              onFocus={focus} onBlur={(e) => blur(e, emailError)} />
            <FieldError msg={emailError} />
          </div>

          {/* Password */}
          <div>
            <FieldLabel required>{a.password}</FieldLabel>
            <div style={pwWrap}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                style={{ ...inputError(!!passwordError), paddingRight: 38 }}
                onFocus={focus} onBlur={(e) => blur(e, passwordError)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn} tabIndex={-1}>
                <EyeIcon visible={showPassword} />
              </button>
            </div>
            <StrengthBar password={password} />
            <FieldError msg={passwordError} />
          </div>

          {/* Confirm password */}
          <div>
            <FieldLabel required>Confirm Password</FieldLabel>
            <div style={pwWrap}>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                style={{
                  ...inputError(!!confirmError),
                  paddingRight: 38,
                  ...(passwordsMatch ? { borderColor: "#22C55E" } : {}),
                }}
                onFocus={focus} onBlur={(e) => blur(e, confirmError)}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn} tabIndex={-1}>
                <EyeIcon visible={showConfirm} />
              </button>
            </div>
            {/* Match indicator */}
            {confirm.length > 0 && !confirmError && passwordsMatch && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 12, color: "#22C55E", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Passwords match
              </motion.p>
            )}
            <FieldError msg={confirmError} />
          </div>

          {/* Restaurant name (employer only) */}
          {role === "employer" && (
            <div>
              <FieldLabel required>{a.restaurantName}</FieldLabel>
              <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Your restaurant name"
                style={inputError(!!restaurantError)}
                onFocus={focus} onBlur={(e) => blur(e, restaurantError)} />
              <FieldError msg={restaurantError} />
            </div>
          )}

          {/* Worker: date of birth + state */}
          {role === "worker" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <FieldLabel>Date of birth</FieldLabel>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  aria-label="Date of birth"
                  style={inputBase}
                  onFocus={focus} onBlur={(e) => blur(e, "")}
                />
                {under18 && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 12, color: "#D97706", margin: "6px 0 0", lineHeight: 1.5, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 6, padding: "8px 10px" }}
                  >
                    Some jobs may have age restrictions. Please check with the employer before applying.
                  </motion.p>
                )}
              </div>
              <div>
                <FieldLabel>State</FieldLabel>
                <select
                  value={usState}
                  onChange={(e) => setUsState(e.target.value)}
                  aria-label="US state"
                  style={{ ...inputBase, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px", paddingRight: 36 }}
                  onFocus={focus} onBlur={(e) => blur(e, "")}
                >
                  <option value="">Choose…</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Preferred language */}
          <div>
            <FieldLabel>{a.preferredLanguage}</FieldLabel>
            <select value={languagePref} onChange={(e) => setLanguagePref(e.target.value)}
              style={{ ...inputBase, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px", paddingRight: 36 }}
              onFocus={focus} onBlur={(e) => blur(e, "")}>
              <option value="en">English</option>
              <option value="zh">中文 (普通话)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>

          {/* Terms of Service agreement */}
          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={tosAccepted}
                onChange={(e) => setTosAccepted(e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 1, cursor: "pointer", accentColor: "#D4A853", flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                I agree to the{" "}
                <Link to="/privacy" target="_blank" style={{ color: "#C9A84C", fontWeight: 600 }}>Privacy Policy</Link>
                {" "}and{" "}
                <Link to="/terms" target="_blank" style={{ color: "#C9A84C", fontWeight: 600 }}>Terms of Service</Link>
                <span style={{ color: "#EF4444", marginLeft: 3, fontWeight: 700 }}>*</span>
              </span>
            </label>
            <FieldError msg={tosError} />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.01 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            style={{
              marginTop: 8, padding: "13px",
              background: loading ? "#E5E7EB" : "#C9A84C",
              color: "#0A0F1E", border: "none", borderRadius: 8,
              fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 2px 8px rgba(201,168,76,0.3)",
            }}
          >
            {loading ? a.creatingAccount : a.createAccount}
          </motion.button>
        </form>

        {/* Social sign-up */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, whiteSpace: "nowrap" }}>or sign up with</span>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SocialButton onClick={() => showToast("Google sign-up is coming soon.")} label="Continue with Google"
            icon={<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.1 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6.3-6.3C34.4 5.9 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-7.9 19.7-20 0-1.3-.1-2.7-.2-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3 0 5.7 1.1 7.8 2.9l6.3-6.3C34.4 5.9 29.5 4 24 4 16.1 4 9.3 8.4 6.3 14.7z"/><path fill="#FBBC05" d="M24 44c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.5 35.5 26.9 36 24 36c-5.6 0-10.1-2.9-11.7-7.5l-7 5.4C8.2 39.8 15.5 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.8 2.3-2.2 4.3-4.1 5.8l6.5 5.3C41.8 36.3 44.5 30.6 44.5 24c0-1.3-.1-2.7-.2-4z"/></svg>}
          />
          <SocialButton onClick={() => showToast("Phone sign-up is coming soon.")} label="Continue with Phone Number"
            icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>}
          />
        </div>

        <p style={{ marginTop: 20, fontSize: 14, color: "#6B7280", textAlign: "center" }}>
          {a.alreadyHaveAccount}{" "}
          <Link to="/login" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "none" }}>{a.signInLink}</Link>
        </p>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#0A0F1E", color: "#ffffff", fontSize: 13, fontWeight: 500, padding: "10px 20px", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 999, whiteSpace: "nowrap", fontFamily: "Inter, sans-serif" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
