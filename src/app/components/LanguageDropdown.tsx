import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLang, type Lang } from "../context/LanguageContext";

const LANGUAGES = [
  { code: "en" as Lang, native: "English", available: true },
  { code: "zh" as Lang, native: "中文", available: true },
  { code: "es" as Lang, native: "Español", available: true },
  { code: "fr" as Lang, native: "Français", available: true },
  { code: "pt" as Lang, native: "Português", available: true },
  { code: "vi" as Lang, native: "Tiếng Việt", available: true },
] as const;

const DIALECT_LABELS: Record<string, string> = {
  mandarin: "Mandarin (普通话)",
  cantonese: "Cantonese (广东话)",
  fujian: "Fujianese (闽南话)",
  shanghai: "Shanghainese (上海话)",
  latin_american: "Latin American",
  castilian: "Castilian",
};

interface Props {
  variant?: "light" | "dark";
}

export function LanguageDropdown({ variant = "dark" }: Props) {
  const { lang, setLang, dialect, setDialect, languageFamilies } = useLang();
  const [open, setOpen] = useState(false);
  const [showDialects, setShowDialects] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowDialects(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const hasDialects = languageFamilies[lang]?.dialects.length > 0;
  const dialectLabel =
    dialect && DIALECT_LABELS[dialect] ? DIALECT_LABELS[dialect] : "";

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
        <span>
          {current.native}
          {dialectLabel && ` (${dialectLabel.split(" ")[0]})`}
        </span>
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
              minWidth: 220,
              overflow: "hidden",
              zIndex: 300,
            }}
          >
            {!showDialects ? (
              LANGUAGES.map((l, i) => {
                const active = lang === l.code;
                const hasSubDialects = languageFamilies[l.code]?.dialects.length > 0;
                return (
                  <button
                    key={l.code}
                    disabled={!l.available}
                    onClick={() => {
                      if (l.available) {
                        setLang(l.code as Lang);
                        if (hasSubDialects) {
                          setShowDialects(true);
                        } else {
                          setOpen(false);
                        }
                      }
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
                      color: !l.available
                        ? "#C4C9D4"
                        : active
                          ? "#C9A84C"
                          : "#0A0F1E",
                      background: active ? "#FFFBF0" : "transparent",
                      border: "none",
                      borderBottom:
                        i < LANGUAGES.length - 1 ? "1px solid #F3F4F6" : "none",
                      cursor: l.available ? "pointer" : "not-allowed",
                      fontFamily: "Inter, sans-serif",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (l.available && !active)
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
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                      {!l.available && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#9CA3AF",
                            background: "#F3F4F6",
                            border: "1px solid #E5E7EB",
                            borderRadius: 4,
                            padding: "1px 5px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Soon
                        </span>
                      )}
                      {hasSubDialects && active && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <polyline
                            points="9 18 15 12 9 6"
                            stroke="#6B7280"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <>
                <button
                  onClick={() => setShowDialects(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0A0F1E",
                    background: "#F9FAFB",
                    border: "none",
                    borderBottom: "1px solid #F3F4F6",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <polyline
                      points="15 18 9 12 15 6"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Back
                </button>
                {languageFamilies[lang]?.dialects.map((d, i) => {
                  const active = dialect === d;
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        setDialect(d);
                        setShowDialects(false);
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
                          i < (languageFamilies[lang]?.dialects.length || 0) - 1
                            ? "1px solid #F3F4F6"
                            : "none",
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
                      <span>{DIALECT_LABELS[d] || d}</span>
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
