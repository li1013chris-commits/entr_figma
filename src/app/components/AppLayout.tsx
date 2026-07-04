import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { LanguageDropdown } from "./LanguageDropdown";
import { NotificationBadge } from "./NotificationBadge";
import { employerVerifyApi, employerApi, workerApi, interviewApi } from "../api/client";
import { totalUnseenApplications, countStatusUpdates, NOTIFICATIONS_CHANGED } from "../utils/notifications";

const CARD_SHADOW = "0 2px 8px rgba(0,0,0,0.08)";

export { CARD_SHADOW };

// Business verification is temporarily hidden from the UI (code kept intact).
const SHOW_BUSINESS_VERIFICATION = false;

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();
  const { t, fitFont }    = useLang();
  const [loggingOut, setLoggingOut] = useState(false);
  const [bizVerified, setBizVerified] = useState<boolean | null>(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (user?.role === "employer") {
      employerVerifyApi.getStatus()
        .then((d) => setBizVerified(d.verification?.business_verified === 1))
        .catch(() => setBizVerified(false));
    }
  }, [user]);

  // Red badge on "Dashboard": unseen applicants (employer) or application
  // updates + interviews awaiting confirmation (worker). Refreshes on page
  // change, once a minute, and immediately when something is marked seen.
  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    try {
      if (user.role === "employer") {
        const data = await employerApi.getJobs();
        setNotifCount(totalUnseenApplications(user.id, data.jobs));
      } else {
        const [appsData, ivData] = await Promise.all([
          workerApi.getApplications(),
          interviewApi.listWorker().catch(() => ({ interviews: [] })),
        ]);
        const pendingInterviews = ivData.interviews.filter((iv) => !iv.worker_confirmed).length;
        setNotifCount(countStatusUpdates(user.id, appsData.applications) + pendingInterviews);
      }
    } catch { /* badge is best-effort */ }
  }, [user]);

  useEffect(() => {
    refreshNotifications();
    const timer = setInterval(refreshNotifications, 60_000);
    window.addEventListener(NOTIFICATIONS_CHANGED, refreshNotifications);
    return () => {
      clearInterval(timer);
      window.removeEventListener(NOTIFICATIONS_CHANGED, refreshNotifications);
    };
  }, [refreshNotifications, location.pathname]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "Inter, sans-serif", fontSize: fitFont(14),
    fontWeight: active ? 600 : 400,
    color: active ? "#0A0F1E" : "#6B7280",
    textDecoration: "none",
    padding: "6px 12px", borderRadius: 6,
    background: active ? "#F7F7F5" : "transparent",
    border: active ? "1px solid #E5E7EB" : "1px solid transparent",
    transition: "all 0.15s",
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logout(); navigate("/"); }
    finally { setLoggingOut(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: "Inter, sans-serif" }}>

      {/* Top nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>

          {/* Logo — always goes to the user's dashboard, never "out" of the app */}
          <Link
            to={user?.role === "employer" ? "/employer/dashboard" : "/worker/dashboard"}
            style={{ textDecoration: "none", flexShrink: 0 }}
            aria-label="Go to dashboard"
          >
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>
              <span style={{ color: "#0A0F1E" }}>EN</span>
              <span style={{ color: "#C9A84C" }}>TR</span>
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
            {user?.role === "employer" ? (
              <>
                <span style={{ position: "relative", display: "inline-flex" }}>
                  <Link to="/employer/dashboard" style={navLinkStyle(isActive("/employer/dashboard"))}>{t.layout.dashboard}</Link>
                  <NotificationBadge count={notifCount} />
                </span>
                {(bizVerified || !SHOW_BUSINESS_VERIFICATION) ? (
                  <Link to="/employer/post-job" style={navLinkStyle(isActive("/employer/post-job"))}>{t.layout.postJob}</Link>
                ) : (
                  <div title="Verify your restaurant to start posting jobs" style={{ ...navLinkStyle(false), opacity: 0.5, cursor: "not-allowed" }}>{t.layout.postJob}</div>
                )}
                {SHOW_BUSINESS_VERIFICATION && (
                  <Link to="/employer/verify-business"
                    style={{ ...navLinkStyle(isActive("/employer/verify-business")), display: "flex", alignItems: "center", gap: 5 }}>
                    {bizVerified ? (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Verified Business</>
                    ) : (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Verify Business</>
                    )}
                  </Link>
                )}
                <Link to="/employer/settings" style={navLinkStyle(isActive("/employer/settings"))}>{t.app.nav.settings}</Link>
              </>
            ) : (
              <>
                <span style={{ position: "relative", display: "inline-flex" }}>
                  <Link to="/worker/dashboard" style={navLinkStyle(isActive("/worker/dashboard"))}>{t.layout.dashboard}</Link>
                  <NotificationBadge count={notifCount} />
                </span>
                <Link to="/worker/jobs" style={navLinkStyle(isActive("/worker/jobs"))}>{t.layout.browseJobs}</Link>
                <Link to="/worker/verify" style={navLinkStyle(isActive("/worker/verify"))}>{t.layout.verification}</Link>
                <Link to="/worker/settings" style={navLinkStyle(isActive("/worker/settings"))}>{t.app.nav.settings}</Link>
              </>
            )}
          </div>

          {/* Right: language selector (every page, left of profile) + user info + logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <LanguageDropdown compact />

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1E" }}>{user?.name}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.08em" }}>{user?.role}</div>
            </div>

            {/* Exit / logout button */}
            <motion.button
              onClick={handleLogout}
              disabled={loggingOut}
              whileHover={loggingOut ? {} : { scale: 1.04 }}
              whileTap={loggingOut ? {} : { scale: 0.96 }}
              title={t.layout.logout}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
                color: loggingOut ? "#9CA3AF" : "#0A0F1E",
                background: "transparent",
                border: "1.5px solid #E5E7EB",
                borderRadius: 7, padding: "6px 12px",
                cursor: loggingOut ? "not-allowed" : "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!loggingOut) {
                  (e.currentTarget as HTMLElement).style.borderColor = "#DC2626";
                  (e.currentTarget as HTMLElement).style.color = "#DC2626";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB";
                (e.currentTarget as HTMLElement).style.color = loggingOut ? "#9CA3AF" : "#0A0F1E";
              }}
            >
              {/* Exit door icon */}
              {loggingOut ? "..." : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  {t.layout.logout}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {children}
      </main>
    </div>
  );
}
