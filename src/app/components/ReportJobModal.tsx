import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { workerApi } from "../api/client";
import { useLang } from "../context/LanguageContext";

const REASONS = ["fake_job", "wrong_pay", "inappropriate", "other"] as const;

interface Props {
  jobId: number;
  jobTitle: string;
  onClose: () => void;
}

export function ReportJobModal({ jobId, jobTitle, onClose }: Props) {
  const { t } = useLang();
  const r = t.app.report;
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!reason || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await workerApi.reportJob(jobId, reason, notes.trim());
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : r.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(10,15,30,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog" aria-label={r.title}
          style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 14, boxShadow: "0 24px 64px rgba(10,15,30,0.3)", padding: 24, fontFamily: "Inter, sans-serif" }}
        >
          {done ? (
            <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1E", margin: "0 0 18px" }}>{r.thanks}</p>
              <button
                onClick={onClose}
                style={{ padding: "10px 28px", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: "#C9A84C", border: "none", borderRadius: 8, cursor: "pointer", boxShadow: "0 2px 6px rgba(201,168,76,0.3)" }}
              >
                {r.close}
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0A0F1E", margin: "0 0 2px" }}>{r.title}</h2>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px" }}>{jobTitle}</p>

              {error && (
                <p role="alert" style={{ fontSize: 13, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "9px 12px", margin: "0 0 12px" }}>{error}</p>
              )}

              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>{r.reasonLabel}</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none", fontFamily: "Inter, sans-serif", color: reason ? "#0A0F1E" : "#9CA3AF", background: "#fff", boxSizing: "border-box", marginBottom: 14, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px", paddingRight: 36 }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              >
                <option value="" disabled>{r.choose}</option>
                {REASONS.map((key) => (
                  <option key={key} value={key}>{r.reasons[key]}</option>
                ))}
              </select>

              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>{r.notesLabel}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
                rows={3}
                placeholder={r.notesPlaceholder}
                style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none", fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: "#fff", boxSizing: "border-box", resize: "vertical", marginBottom: 18 }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={submit}
                  disabled={!reason || submitting}
                  style={{ flex: 1, padding: "11px", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: !reason || submitting ? "#E5E7EB" : "#C9A84C", border: "none", borderRadius: 8, cursor: !reason || submitting ? "not-allowed" : "pointer", boxShadow: !reason || submitting ? "none" : "0 2px 6px rgba(201,168,76,0.3)" }}
                >
                  {submitting ? r.submitting : r.submit}
                </button>
                <button
                  onClick={onClose}
                  style={{ padding: "11px 18px", fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif", color: "#6B7280", background: "transparent", border: "1.5px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}
                >
                  {r.cancel}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
