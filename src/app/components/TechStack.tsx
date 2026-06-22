import { motion } from "motion/react";
import { useLang } from "../context/LanguageContext";

const techIcons: Record<string, JSX.Element> = {
  "Claude AI": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#C9A84C" strokeWidth="1.5" />
      <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill="#C9A84C" />
    </svg>
  ),
  React: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="2" fill="#61DAFB" />
    </svg>
  ),
  Flask: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 3h6M10 3v6L6 18a2 2 0 001.9 2.7h8.2A2 2 0 0018 18l-4-9V3" stroke="#7C8CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="15" r="1" fill="#7C8CF8" />
      <circle cx="14" cy="17" r="0.75" fill="#7C8CF8" />
    </svg>
  ),
  PostgreSQL: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="7" rx="7" ry="3" stroke="#336791" strokeWidth="1.5" />
      <path d="M5 7v10c0 1.65 3.13 3 7 3s7-1.35 7-3V7" stroke="#336791" strokeWidth="1.5" />
      <path d="M5 12c0 1.65 3.13 3 7 3s7-1.35 7-3" stroke="#336791" strokeWidth="1.5" />
    </svg>
  ),
  AWS: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M7 16c-2.2-.5-4-2.1-4-4.5C3 9 5.5 7 8 7c.3 0 .6 0 .9.1C9.5 5.3 11.1 4 13 4c2.8 0 5 2.2 5 5 0 .2 0 .4-.1.6C19.7 10.1 21 11.5 21 13c0 1.7-1.3 3-3 3H7z" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 19l-2 2M15 19l2 2" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Stripe: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#635BFF" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="#635BFF" strokeWidth="1.5" />
      <rect x="7" y="14" width="4" height="2" rx="1" fill="#635BFF" />
    </svg>
  ),
};

export function TechStack() {
  const { t } = useLang();

  return (
    <section
      style={{
        background: "#FAFAFA",
        borderTop: "1px solid #E5E7EB",
        borderBottom: "1px solid #E5E7EB",
        padding: "20px 32px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#9CA3AF",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {t.tech.label}
        </span>

        <div
          style={{
            height: 16,
            width: 1,
            background: "#E5E7EB",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            flex: 1,
            flexWrap: "wrap",
          }}
        >
          {t.tech.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 16px",
                borderRight: i < t.tech.items.length - 1 ? "1px solid #E5E7EB" : "none",
                cursor: "default",
              }}
            >
              {techIcons[item.name]}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E", lineHeight: 1.2 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 10, fontWeight: 300, color: "#9CA3AF", lineHeight: 1.2 }}>
                  {item.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
