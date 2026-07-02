import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { DeleteAccountModal } from "../components/DeleteAccountModal";
import { calendarApi } from "../api/client";
import { BackArrow } from "../components/BackArrow";

const API_BASE = "https://entr-production.up.railway.app";

export function SettingsPage() {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [calStatus, setCalStatus] = useState<{ oauth_available: boolean; connected: boolean } | null>(null);
  const [calBusy, setCalBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    calendarApi.status().then(setCalStatus).catch(() => setCalStatus(null));
  }, []);

  const connectCalendar = async () => {
    setCalBusy(true);
    try {
      const res = await calendarApi.connect();
      window.location.href = res.auth_url;
    } catch {
      setCalBusy(false);
    }
  };

  const disconnectCalendar = async () => {
    setCalBusy(true);
    try {
      await calendarApi.disconnect();
      setCalStatus((s) => (s ? { ...s, connected: false } : s));
    } finally {
      setCalBusy(false);
    }
  };

  const exportData = async () => {
    setExporting(true);
    setExportError("");
    try {
      const res = await fetch(`${API_BASE}/api/user/export`, { credentials: "include" });
      if (!res.ok) throw new Error("Export failed. Please try again.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "entr-data-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setExportError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <BackArrow />
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

      {/* Google Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
        style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16 }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1E", margin: "0 0 6px" }}>Google Calendar</h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px", lineHeight: 1.5 }}>
          Connect your calendar so ENTR can suggest interview times that work for everyone
          and add confirmed interviews automatically.
        </p>
        {calStatus === null ? (
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Checking connection…</p>
        ) : !calStatus.oauth_available ? (
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
            Calendar connection is not available right now. You can still schedule interviews manually.
          </p>
        ) : calStatus.connected ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "7px 12px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
              Connected
            </span>
            <button
              onClick={disconnectCalendar}
              disabled={calBusy}
              style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif", color: "#6B7280", background: "transparent", border: "1.5px solid #E5E7EB", borderRadius: 8, cursor: calBusy ? "not-allowed" : "pointer" }}
            >
              {calBusy ? "…" : "Disconnect"}
            </button>
          </div>
        ) : (
          <button
            onClick={connectCalendar}
            disabled={calBusy}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: calBusy ? "#E5E7EB" : "#D4A853", border: "none", borderRadius: 8, cursor: calBusy ? "not-allowed" : "pointer", boxShadow: calBusy ? "none" : "0 2px 6px rgba(212,168,83,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {calBusy ? "Opening Google…" : "Connect Google Calendar"}
          </button>
        )}
      </motion.div>

      {/* Your data (GDPR export) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16 }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1E", margin: "0 0 6px" }}>Your data</h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px", lineHeight: 1.5 }}>
          Download a copy of everything ENTR has stored about your account as a JSON file.
        </p>
        {exportError && <p role="alert" style={{ fontSize: 13, color: "#DC2626", margin: "0 0 10px" }}>{exportError}</p>}
        <button
          onClick={exportData}
          disabled={exporting}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: "transparent", border: "1.5px solid #0A0F1E", borderRadius: 8, cursor: exporting ? "not-allowed" : "pointer", opacity: exporting ? 0.6 : 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {exporting ? "Preparing…" : "Export my data"}
        </button>
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
