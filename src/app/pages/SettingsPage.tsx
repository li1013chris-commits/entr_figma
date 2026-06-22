import { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { DeleteAccountModal } from "../components/DeleteAccountModal";

export function SettingsPage() {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Account</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>Settings</h1>
      </motion.div>

      {/* Account info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16 }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1E", margin: "0 0 16px" }}>Account information</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#9CA3AF", minWidth: 72 }}>Name</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0F1E" }}>{user?.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#9CA3AF", minWidth: 72 }}>Email</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0F1E" }}>{user?.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#9CA3AF", minWidth: 72 }}>Role</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.08em" }}>{user?.role}</span>
          </div>
          {user?.restaurant_name && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, color: "#9CA3AF", minWidth: 72 }}>Restaurant</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0F1E" }}>{user.restaurant_name}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: "#fff", border: "1.5px solid #FECACA", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <p style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Danger zone</p>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1E", margin: "0 0 6px" }}>Delete account</h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px", lineHeight: 1.5 }}>
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <motion.button
          onClick={() => setShowDeleteModal(true)}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "transparent", color: "#DC2626", border: "1.5px solid #DC2626", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: "pointer" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Delete my account
        </motion.button>
      </motion.div>

      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
    </div>
  );
}
