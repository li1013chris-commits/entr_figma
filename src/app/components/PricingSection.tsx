import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLang } from "../context/LanguageContext";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  features: PlanFeature[];
  cta: string;
  badge?: string;
  variant: "default" | "gold" | "navy" | "filled";
  delay?: number;
  onCTA?: () => void;
  perMonth?: string;
}

function Checkmark({ included, filled }: { included: boolean; filled?: boolean }) {
  if (!included) {
    return (
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: filled ? "rgba(255,255,255,0.1)" : "#F3F4F6",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
          <path d="M1 1h6" stroke={filled ? "rgba(255,255,255,0.3)" : "#D1D5DB"} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#C9A84C",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
        <path d="M1 3.5L3.5 6L8 1" stroke="#0A0F1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PricingCard({ name, price, features, cta, badge, variant, delay = 0, onCTA, perMonth = "/month" }: PricingCardProps) {
  const isFilled = variant === "filled";
  const isGold = variant === "gold";

  const borderColor = {
    default: "#E5E7EB",
    gold: "#C9A84C",
    navy: "#0A0F1E",
    filled: "#0A0F1E",
  }[variant];
  const borderWidth = variant === "default" ? 1 : 2;
  const cardBg = isFilled ? "#0A0F1E" : "#ffffff";
  const nameColor = isFilled ? "rgba(255,255,255,0.5)" : "#6B7280";
  const priceColor = isFilled ? "#ffffff" : "#0A0F1E";
  const perPostColor = isFilled ? "rgba(255,255,255,0.45)" : "#6B7280";
  const featureColor = isFilled ? "rgba(255,255,255,0.8)" : "#0A0F1E";
  const dividerColor = isFilled ? "rgba(255,255,255,0.08)" : "#F3F4F6";
  const ctaBg = isFilled ? "#C9A84C" : isGold ? "#C9A84C" : variant === "navy" ? "#0A0F1E" : "#F7F7F5";
  const ctaColor = isFilled ? "#0A0F1E" : isGold ? "#0A0F1E" : variant === "navy" ? "#ffffff" : "#6B7280";
  const ctaHoverShadow =
    isGold || isFilled ? "0 8px 24px rgba(201,168,76,0.35)" : variant === "navy" ? "0 8px 24px rgba(10,15,30,0.25)" : "0 4px 12px rgba(0,0,0,0.08)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{
        background: cardBg,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: 14,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: isFilled
          ? "0 16px 48px rgba(10,15,30,0.3)"
          : isGold
          ? "0 8px 32px rgba(201,168,76,0.15)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {badge && (
        <div
          style={{
            position: "absolute",
            top: -13,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#C9A84C",
            color: "#0A0F1E",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: 20,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </div>
      )}

      <div style={{ fontSize: 12, fontWeight: 600, color: nameColor, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
        {name}
      </div>

      <div style={{ marginBottom: 28 }}>
        <span style={{ fontSize: 40, fontWeight: 700, color: priceColor, letterSpacing: "-1px", lineHeight: 1 }}>
          {price}
        </span>
        {price !== "$0" && (
          <span style={{ fontSize: 13, fontWeight: 300, color: perPostColor, marginLeft: 4 }}>{perMonth}</span>
        )}
      </div>

      <div style={{ height: 1, background: dividerColor, marginBottom: 24 }} />

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
          marginBottom: 32,
        }}
      >
        {features.map((f) => (
          <li
            key={f.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: f.included ? featureColor : isFilled ? "rgba(255,255,255,0.3)" : "#9CA3AF",
            }}
          >
            <Checkmark included={f.included} filled={isFilled} />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      {/* Learn more link */}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <a
          href="/pricing/features"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: isFilled ? "rgba(201,168,76,0.9)" : "#C9A84C",
            textDecoration: "none",
            transition: "opacity 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.7";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          Questions about what's included?
        </a>
      </div>

      <motion.button
        onClick={onCTA}
        whileHover={{ scale: 1.01, boxShadow: ctaHoverShadow }}
        whileTap={{ scale: 0.98 }}
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: ctaColor,
          background: ctaBg,
          padding: "12px 20px",
          borderRadius: 8,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          textAlign: "center",
          display: "block",
          cursor: "pointer",
          transition: "box-shadow 0.15s, transform 0.15s",
          width: "100%",
        }}
      >
        {cta}
      </motion.button>
    </motion.div>
  );
}


export function PricingSection() {
  const { t } = useLang();
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleCTA = () => {
    showToast("Payment options coming soon. Build your plan now!");
  };

  // Map translated plan data to variant types
  const plans: PricingCardProps[] = t.pricing.plans.map((plan, i) => ({
    ...plan,
    variant: i === 0 ? "default" : i === 1 ? "navy" : i === 2 ? "gold" : "filled",
    badge: i === 2 ? t.pricing.badge : undefined,
    delay: i * 0.08,
    onCTA: handleCTA,
    perMonth: t.pricing.perMonth,
  }));

  return (
    <section
      id="pricing"
      style={{
        background: "#ffffff",
        borderTop: "1px solid #E5E7EB",
        padding: "80px 24px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#C9A84C",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 12px",
            }}
          >
            {t.pricing.label}
          </p>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#0A0F1E",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            {t.pricing.heading}
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "#6B7280",
              margin: 0,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            {t.pricing.subtext}
          </p>
        </div>

        <div
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {plans.map((plan, i) => (
            <PricingCard
              key={plan.name}
              {...plan}
              delay={i * 0.08}
              onCTA={handleCTA}
            />
          ))}
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: "fixed",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#0A0F1E",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 500,
              padding: "10px 20px",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              zIndex: 999,
              whiteSpace: "nowrap",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
