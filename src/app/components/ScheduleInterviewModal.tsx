import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { interviewApi, calendarApi, type SlotSuggestion } from "../api/client";

const NAVY = "#0A0F1E";
const GOLD = "#D4A853";

function formatSlot(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "long", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

interface Props {
  appId: number;
  workerName: string;
  onClose: () => void;
  onScheduled: () => void;
}

export function ScheduleInterviewModal({ appId, workerName, onClose, onScheduled }: Props) {
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState<SlotSuggestion | null>(null);
  const [calConnected, setCalConnected] = useState<boolean | null>(null);
  const [oauthAvailable, setOauthAvailable] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [manualDateTime, setManualDateTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<"proposed" | "scheduled" | null>(null);

  useEffect(() => {
    Promise.all([interviewApi.suggestSlots(appId), calendarApi.status()])
      .then(([sug, cal]) => {
        setSuggestion(sug);
        setCalConnected(cal.connected);
        setOauthAvailable(cal.oauth_available);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Could not load scheduling info")
      )
      .finally(() => setLoading(false));
  }, [appId]);

  const connectCalendar = async () => {
    try {
      const res = await calendarApi.connect();
      window.location.href = res.auth_url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not start Google Calendar connection");
    }
  };

  const proposeSlot = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError("");
    try {
      await interviewApi.propose(appId, selectedSlot);
      setDone("proposed");
      onScheduled();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not propose interview");
    } finally {
      setSubmitting(false);
    }
  };

  const scheduleManual = async () => {
    if (!manualDateTime) { setError("Please pick a date and time."); return; }
    setSubmitting(true);
    setError("");
    try {
      await interviewApi.scheduleDirect(appId, new Date(manualDateTime).toISOString());
      setDone("scheduled");
      onScheduled();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not schedule interview");
    } finally {
      setSubmitting(false);
    }
  };

  const hasSlots = !!(suggestion?.slots && suggestion.slots.length > 0);
  const availability = suggestion?.worker_availability;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 16, fontFamily: "Inter, sans-serif" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Schedule interview"
          style={{ width: "100%", maxWidth: 460, background: "#fff", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" }}
        >
          {/* Header */}
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px" }}>Interview</p>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: NAVY, margin: 0 }}>Schedule with {workerName}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 6, borderRadius: 6 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div style={{ padding: "20px 24px 24px" }}>
            {error && (
              <div role="alert" style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 13px", fontSize: 13, color: "#DC2626", marginBottom: 14 }}>
                {error}
              </div>
            )}

            {loading ? (
              <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", padding: 24 }}>Loading availability…</p>
            ) : done ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: NAVY, margin: "0 0 6px" }}>
                  {done === "proposed" ? "Time proposed!" : "Interview scheduled!"}
                </p>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
                  {done === "proposed"
                    ? `${workerName} has been notified and will confirm the time. Once confirmed, it goes on both calendars.`
                    : "A confirmation email was sent to both of you."}
                </p>
                <button
                  onClick={onClose}
                  style={{ marginTop: 18, padding: "10px 24px", background: GOLD, color: NAVY, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: "pointer" }}
                >
                  Done
                </button>
              </div>
            ) : hasSlots ? (
              <>
                <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 12px", lineHeight: 1.5 }}>
                  These times are free on both your calendar and {workerName}'s. Pick one — {workerName} will confirm it.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {suggestion!.slots!.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      aria-pressed={selectedSlot === slot}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 14px", fontSize: 14, fontWeight: selectedSlot === slot ? 600 : 400,
                        fontFamily: "Inter, sans-serif", color: NAVY, textAlign: "left",
                        background: selectedSlot === slot ? "#FFFBF0" : "#fff",
                        border: `1.5px solid ${selectedSlot === slot ? GOLD : "#E5E7EB"}`,
                        borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={selectedSlot === slot ? GOLD : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formatSlot(slot)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={proposeSlot}
                  disabled={!selectedSlot || submitting}
                  style={{ width: "100%", padding: 12, background: !selectedSlot || submitting ? "#E5E7EB" : GOLD, color: NAVY, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: !selectedSlot || submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? "Proposing…" : "Propose this time"}
                </button>
              </>
            ) : (
              <>
                {/* Manual fallback */}
                <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 12px", lineHeight: 1.5 }}>
                  {suggestion?.both_connected
                    ? "No overlapping free times were found this week. Pick a time manually — both of you will get a confirmation email."
                    : "Pick a date and time. Both of you will get a confirmation email."}
                </p>

                {availability && (availability.days.length > 0 || availability.times.length > 0) && (
                  <div style={{ background: "#F7F7F5", border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 13px", marginBottom: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: GOLD, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>{workerName} is available</p>
                    <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>
                      {availability.days.join(", ")}{availability.days.length && availability.times.length ? " · " : ""}{availability.times.join(", ")}
                    </p>
                  </div>
                )}

                <label htmlFor="manual-datetime" style={{ display: "block", fontSize: 13, fontWeight: 500, color: NAVY, marginBottom: 6 }}>
                  Interview date &amp; time
                </label>
                <input
                  id="manual-datetime"
                  type="datetime-local"
                  value={manualDateTime}
                  onChange={(e) => setManualDateTime(e.target.value)}
                  min={new Date(Date.now() + 3600_000).toISOString().slice(0, 16)}
                  style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none", fontFamily: "Inter, sans-serif", color: NAVY, boxSizing: "border-box", marginBottom: 16 }}
                  onFocus={(e) => (e.target.style.borderColor = GOLD)}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
                <button
                  onClick={scheduleManual}
                  disabled={submitting}
                  style={{ width: "100%", padding: 12, background: submitting ? "#E5E7EB" : GOLD, color: NAVY, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? "Scheduling…" : "Schedule interview"}
                </button>

                {!calConnected && oauthAvailable && (
                  <button
                    onClick={connectCalendar}
                    style={{ width: "100%", marginTop: 10, padding: 11, background: "transparent", color: NAVY, border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Connect Google Calendar for automatic time suggestions
                  </button>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
