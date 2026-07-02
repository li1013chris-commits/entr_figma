import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { LanguageDropdown } from "./LanguageDropdown";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!user) return null;
  const dashboardPath = user.role === "employer" ? "/employer/dashboard" : "/worker/dashboard";
  const settingsPath  = user.role === "employer" ? "/employer/settings"  : "/worker/settings";

  const handleLogout = async () => {
    setOpen(false);
    try { await logout(); } finally { navigate("/"); }
  };

  const itemStyle: React.CSSProperties = {
    display: "block", width: "100%", textAlign: "left",
    padding: "10px 14px", fontSize: 14, fontWeight: 400,
    color: "#0A0F1E", background: "transparent", border: "none",
    cursor: "pointer", fontFamily: "Inter, sans-serif",
    textDecoration: "none", boxSizing: "border-box",
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
      {/* Dashboard link */}
      <Link
        to={dashboardPath}
        style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, color: "#0A0F1E", textDecoration: "none", opacity: 0.85 }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.85")}
      >
        Dashboard
      </Link>

      {/* Profile chip */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "transparent", border: "1.5px solid #E5E7EB",
          borderRadius: 999, padding: "4px 12px 4px 4px",
          cursor: "pointer", fontFamily: "Inter, sans-serif",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#C9A84C")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB")}
      >
        <span
          aria-hidden="true"
          style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "#0A0F1E", color: "#C9A84C",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}
        >
          {initialsOf(user.name)}
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0F1E", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.name}
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 200,
            background: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 190,
            overflow: "hidden", padding: "4px 0",
          }}
        >
          <Link to={dashboardPath} style={itemStyle} onClick={() => setOpen(false)}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F7F7F5")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            Dashboard
          </Link>
          <Link to={settingsPath} style={itemStyle} onClick={() => setOpen(false)}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F7F7F5")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            Account Settings
          </Link>
          <div style={{ height: 1, background: "#F3F4F6", margin: "4px 0" }} />
          <button onClick={handleLogout} style={{ ...itemStyle, color: "#DC2626" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FEF2F2")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.platform,   id: "platform"    },
    { label: t.nav.howItWorks, id: "how-it-works" },
    { label: t.nav.pricing,    id: "pricing"      },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      // Never a logout — logged-in users go straight to their dashboard.
      navigate(user.role === "employer" ? "/employer/dashboard" : "/worker/dashboard");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.88)" : "#ffffff",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.07)" : "none",
        borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid transparent",
        transition: "background 0.25s, box-shadow 0.25s",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "Inter, sans-serif" }}>

        {/* Wordmark */}
        <a href="#" onClick={handleLogoClick} style={{ textDecoration: "none" }} aria-label={user ? "Go to dashboard" : "Back to top"}>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#0A0F1E" }}>EN</span>
            <span style={{ color: "#C9A84C" }}>TR</span>
          </span>
        </a>

        {/* Center nav */}
        <div className="nav-center" style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {navLinks.map(({ label, id }) => (
            <a key={id} href={`#${id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(id); }}
              style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 400, color: "#0A0F1E", textDecoration: "none", opacity: 0.75, transition: "opacity 0.15s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.75")}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <LanguageDropdown />
          {user ? (
            <ProfileMenu />
          ) : (
            <>
              <a href="/login"
                style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 400, color: "#0A0F1E", textDecoration: "none", opacity: 0.75, transition: "opacity 0.15s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.75")}
              >
                {t.nav.login}
              </a>
              <a href="/signup"
                style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, color: "#0A0F1E", textDecoration: "none", background: "#C9A84C", padding: "9px 20px", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "box-shadow 0.15s, transform 0.15s", display: "inline-block" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 4px 16px rgba(201,168,76,0.35)"; el.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; el.style.transform = "translateY(0)"; }}
              >
                {t.nav.getStarted}
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
