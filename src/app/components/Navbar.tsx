import { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext";
import { LanguageDropdown } from "./LanguageDropdown";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLang();

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
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ textDecoration: "none" }}>
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
        </div>
      </div>
    </nav>
  );
}
