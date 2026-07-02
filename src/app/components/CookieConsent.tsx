import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

const STORAGE_KEY = "entr_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          role="region"
          aria-label="Cookie consent"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            background: "#0A0F1E",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.25)",
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.5, maxWidth: 640 }}>
            ENTR uses cookies to keep you signed in. We don't use tracking or advertising
            cookies, and we never sell your information.{" "}
            <Link to="/privacy" style={{ color: "#D4A853", textDecoration: "underline" }}>
              Privacy Policy
            </Link>
          </p>
          <button
            onClick={accept}
            style={{
              padding: "9px 26px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              color: "#0A0F1E",
              background: "#D4A853",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Accept
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
