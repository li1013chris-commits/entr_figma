import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { userApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface DeleteAccountModalProps {
  onClose: () => void;
}

export function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await userApi.deleteAccount();
      await logout();
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not delete account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={loading ? undefined : onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px", fontFamily: "Inter, sans-serif" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", maxWidth: 400, background: "#ffffff", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" }}
        >
          <div style={{ padding: "24px 24px 20px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", margin: "0 0 8px" }}>Delete your account?</h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: "0 0 6px" }}>
              This will permanently delete your account and all of your data. This cannot be undone.
            </p>
            <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.5, margin: "0 0 20px" }}>
              All jobs, applications, and verifications will be removed.
            </p>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#DC2626", marginBottom: 16 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                disabled={loading}
                style={{ flex: 1, padding: "11px 16px", background: "transparent", color: "#0A0F1E", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}
              >
                Cancel
              </button>
              <motion.button
                onClick={handleDelete}
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.01 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                style={{ flex: 1, padding: "11px 16px", background: loading ? "#E5E7EB" : "#DC2626", color: loading ? "#9CA3AF" : "#ffffff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Deleting…" : "Delete account"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
