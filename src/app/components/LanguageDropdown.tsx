import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLang, type Lang } from "../context/LanguageContext";

const LANGUAGES = [
  { code: "en" as Lang, native: "English", short: "EN" },
  { code: "zh" as Lang, native: "简体中文", short: "简体" },
  { code: "zhHant" as Lang, native: "繁體中文", short: "繁體" },
  { code: "es" as Lang, native: "Español", short: "ES" },
  { code: "fr" as Lang, native: "Français", short: "FR" },
  { code: "pt" as Lang, native: "Português", short: "PT" },
  { code: "vi" as Lang, native: "Tiếng Việt", short: "VI" },
] as const;

interface Props {
  variant?: "light" | "dark";
  /** Show only the short code (EN, 简体, 繁體, …) in the trigger button */
  compact?: boolean;
}

export function LanguageDropdown({ variant = "dark", compact = false }: Props) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const btnColor = variant === "light" ? "rgba(255,255,255,0.75)" : "#6B7280";
  const btnBorder = variant === "light"
    ? open
      ? "1.5px solid rgba(255,255,255,0.6)"
      : "1.5px solid rgba(255,255,255,0.25)"
    : open
      ? "1.5px solid #C9A84C"
      : "1.5px solid #E5E7EB";
  const btnBg = variant === "light" ? "rgba(255,255,255,0.1)" : "#F7F7F5";
  const btnText = variant === "light" ? "#ffffff" : "#0A0F1E";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Change language"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: btnText,
          background: btnBg,
          border: btnBorder,
          borderRadius: 7,
          padding: "5px 10px",
          cursor: "pointer",
          transition: "border-color 0.15s",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={btnColor} strokeWidth="1.5" />
          <path
            d="M12 3c-3 3.5-3 14.5 0 18M12 3c3 3.5 3 14.5 0 18M3 12h18"
            stroke={btnColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>{compact ? current.short : current.native}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
        >
          <polyline
            points="6 9 12 15 18 9"
            stroke={btnColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              background: "#ffffff",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              minWidth: 200,
              overflow: "hidden",
              zIndex: 300,
            }}
          >
            {LANGUAGES.map((l, i) => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#C9A84C" : "#0A0F1E",
                    background: active ? "#FFFBF0" : "transparent",
                    border: "none",
                    borderBottom:
                      i < LANGUAGES.length - 1 ? "1px solid #F3F4F6" : "none",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = active
                      ? "#FFFBF0"
                      : "transparent";
                  }}
                >
                  <span>{l.native}</span>
                  {active && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="#C9A84C"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
