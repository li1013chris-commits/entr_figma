import { motion } from "motion/react";
import { useLang } from "../context/LanguageContext";

export function HowItWorks() {
  const { t } = useLang();
  const h = t.howItWorks;

  return (
    <section
      id="how-it-works"
      style={{
        background: "#F7F7F5",
        borderTop: "1px solid #E5E7EB",
        fontFamily: "Inter, sans-serif",
        padding: "104px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#C9A84C",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {h.label}
          </div>
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(34px, 4vw, 52px)",
              fontWeight: 700,
              color: "#0A0F1E",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              margin: "0 auto",
              marginBottom: 72,
              textAlign: "center",
            }}
          >
            {h.heading}
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div
          className="steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 64,
          }}
        >
          {h.steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "40px 32px",
                position: "relative",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
            >
              {/* Connector */}
              {i < h.steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: 52,
                    right: -24,
                    width: 40,
                    height: 1,
                    background: "#E5E7EB",
                    zIndex: 1,
                  }}
                />
              )}

              <div
                style={{
                  fontSize: 56,
                  fontWeight: 300,
                  color: "#C9A84C",
                  lineHeight: 1,
                  marginBottom: 24,
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "-2px",
                  opacity: 0.9,
                }}
              >
                {step.number}
              </div>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0A0F1E",
                  margin: 0,
                  marginBottom: 12,
                  letterSpacing: "-0.25px",
                }}
              >
                {step.heading}
              </h3>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  fontWeight: 400,
                  color: "#6B7280",
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: "center" }}
        >
          <a
            href="/signup"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              color: "#0A0F1E",
              textDecoration: "none",
              background: "#C9A84C",
              padding: "15px 32px",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              display: "inline-block",
              transition: "box-shadow 0.15s, transform 0.15s",
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
            {h.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
