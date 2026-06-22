import { motion } from "motion/react";
import { useLang } from "../context/LanguageContext";

export function HeroSection() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 64,
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 32px",
          display: "grid",
          gridTemplateColumns: "50fr 50fr",
          gap: 64,
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left: Copy */}
        <div>
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#F7F7F5",
              border: "1px solid #E5E7EB",
              borderLeft: "3px solid #C9A84C",
              borderRadius: 32,
              padding: "6px 14px",
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 300,
                color: "#0A0F1E",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {h.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(44px, 5.5vw, 68px)",
              fontWeight: 700,
              color: "#0A0F1E",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              margin: 0,
              marginBottom: 24,
            }}
          >
            {h.headline1}
            <br />
            {h.headline2}{" "}
            <span style={{ color: "#C9A84C" }}>{h.trust}</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 18,
              fontWeight: 400,
              color: "#6B7280",
              margin: 0,
              marginBottom: 40,
              lineHeight: 1.6,
              maxWidth: 480,
            }}
          >
            {h.subtext}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <a
              href="/signup?role=employer"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: "#0A0F1E",
                textDecoration: "none",
                background: "#C9A84C",
                padding: "14px 28px",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "box-shadow 0.15s, transform 0.15s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 8px 24px rgba(201,168,76,0.4)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                el.style.transform = "translateY(0)";
              }}
            >
              {h.ctaPost}
            </a>
            <a
              href="/signup"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: "#0A0F1E",
                textDecoration: "none",
                background: "transparent",
                border: "1.5px solid #0A0F1E",
                padding: "14px 28px",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "box-shadow 0.15s, transform 0.15s, background 0.15s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 8px 24px rgba(10,15,30,0.12)";
                el.style.transform = "translateY(-2px)";
                el.style.background = "rgba(10,15,30,0.04)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                el.style.transform = "translateY(0)";
                el.style.background = "transparent";
              }}
            >
              {h.ctaFind}
            </a>
          </motion.div>
        </div>

        {/* Right: Hero image */}
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1920&h=1440&fit=crop&q=85"
          alt="Casual family-owned diner interior"
          style={{
            width: "100%",
            height: "110%",
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        />
      </div>
    </section>
  );
}
