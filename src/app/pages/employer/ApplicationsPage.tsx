import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { employerApi, referralApi, type Application, type Job, type Referral } from "../../api/client";
import { ScheduleInterviewModal } from "../../components/ScheduleInterviewModal";
import { useLang } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { markJobApplicationsSeen } from "../../utils/notifications";

// Business verification is temporarily hidden from the UI (code kept intact).
const SHOW_BUSINESS_VERIFICATION = false;

// ── Sub-components ─────────────────────────────────────────────────────────────

function VerifBadge({ status }: { status: string | null | undefined }) {
  const { t } = useLang();
  const labels = t.app.appsPage.verif;
  const map: Record<string, { bg: string; color: string; label: string }> = {
    verified: { bg: "#DCFCE7", color: "#16A34A", label: labels.verified },
    flagged:  { bg: "#FEF2F2", color: "#DC2626", label: labels.flagged  },
    pending:  { bg: "#FEF3C7", color: "#D97706", label: labels.pending  },
  };
  const c = map[status || "pending"] || map.pending;
  return <span style={{ background: c.bg, color: c.color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20 }}>{c.label}</span>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#6B7280", accepted: "#16A34A", rejected: "#DC2626",
  interview_scheduled: "#D4A853",
};

function StatusDropdown({ appId, currentStatus, onUpdate }: {
  appId: number; currentStatus: string; onUpdate: (id: number, s: string) => void;
}) {
  const { t } = useLang();
  const statusLabels = t.app.appsPage.statusLabels;
  const options = [
    { value: "pending",  label: statusLabels.pending },
    { value: "accepted", label: statusLabels.accepted },
    { value: "rejected", label: statusLabels.rejected },
  ];
  // Optimistic: the UI flips instantly; the server sync runs in the background
  // and the change is rolled back only if that sync fails.
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    const previous = currentStatus;
    onUpdate(appId, next);
    employerApi.updateApplicationStatus(appId, next)
      .catch(() => onUpdate(appId, previous));
  };
  return (
    <select value={currentStatus} onChange={handleChange}
      style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLORS[currentStatus] || "#6B7280", border: "1.5px solid #E5E7EB", borderRadius: 6, padding: "4px 8px", background: "#fff", fontFamily: "Inter, sans-serif", cursor: "pointer", outline: "none" }}>
      {!options.some((o) => o.value === currentStatus) && (
        <option value={currentStatus} disabled>
          {currentStatus === "interview_scheduled" ? statusLabels.interview_scheduled : currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ color: STATUS_COLORS[o.value] }}>{o.label}</option>
      ))}
    </select>
  );
}

// Worker referrals display
function WorkerReferrals({ referrals, count }: { referrals: Referral[]; count: number }) {
  const { t } = useLang();
  if (count === 0) return null;
  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#0A0F1E" }}>
          {count} {count !== 1 ? t.app.appsPage.workedWithMany : t.app.appsPage.workedWithOne}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {referrals.map((r) => (
          <div key={r.id}
            style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#F7F7F5", borderRadius: 7, padding: "8px 10px", border: "1px solid #E5E7EB" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="#0A0F1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E" }}>
                {r.restaurant_name || r.employer_name}
              </span>
              {r.referral_note && (
                <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0", fontStyle: "italic" }}>
                  "{r.referral_note}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Refer worker button + inline form
function ReferButton({ app, employerVerified, onReferred }: {
  app: Application;
  employerVerified: boolean;
  onReferred: (appId: number) => void;
}) {
  const { t } = useLang();
  const ap = t.app.appsPage;
  const [open, setOpen]       = useState(false);
  const [note, setNote]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(app.already_referred ?? false);

  if (app.status !== "hired" && app.status !== "accepted") return null;

  if (done) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 7, padding: "5px 10px" }}>
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#16A34A" }}>{ap.referred}</span>
      </div>
    );
  }

  if (!employerVerified) {
    // Business verification UI is hidden: no referrals prompt for unverified employers.
    if (!SHOW_BUSINESS_VERIFICATION) return null;
    return (
      <div style={{ position: "relative", display: "inline-block" }}
        title="Verify your business to refer workers.">
        <button disabled style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", background: "#F3F4F6", border: "1.5px solid #E5E7EB", borderRadius: 7, padding: "5px 12px", cursor: "not-allowed", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Refer this worker
        </button>
      </div>
    );
  }

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      await referralApi.create(app.id, note);
      setDone(true); setOpen(false);
      onReferred(app.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create referral.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      {!open && (
        <button onClick={() => setOpen(true)}
          style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", border: "none", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 6px rgba(201,168,76,0.3)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          {ap.referWorker}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }}
            style={{ overflow: "hidden", marginTop: 8 }}>
            <div style={{ background: "#F7F7F5", border: "1px solid #E5E7EB", borderRadius: 8, padding: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E", margin: "0 0 8px" }}>{ap.referNote}</p>
              {error && <p style={{ fontSize: 12, color: "#DC2626", margin: "0 0 6px" }}>{error}</p>}
              <textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 200))} rows={2}
                placeholder={ap.referPlaceholder}
                style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: "1.5px solid #E5E7EB", borderRadius: 7, outline: "none", fontFamily: "Inter, sans-serif", color: "#0A0F1E", resize: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
              <p style={{ fontSize: 10, color: "#9CA3AF", margin: "2px 0 8px", textAlign: "right" }}>{note.length}/200</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleSubmit} disabled={loading}
                  style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E", background: loading ? "#E5E7EB" : "#C9A84C", border: "none", borderRadius: 6, padding: "6px 14px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}>
                  {loading ? ap.saving : ap.confirmReferral}
                </button>
                <button onClick={() => { setOpen(false); setNote(""); setError(""); }}
                  style={{ fontSize: 12, color: "#6B7280", background: "transparent", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                  {ap.cancel}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function ApplicationsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate  = useNavigate();
  const { t }     = useLang();
  const ap        = t.app.appsPage;
  const { user }  = useAuth();
  const [job, setJob]                       = useState<Job | null>(null);
  const [applications, setApplications]     = useState<Application[]>([]);
  const [employerVerified, setEmployerVerified] = useState(false);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [scheduleApp, setScheduleApp]       = useState<Application | null>(null);

  useEffect(() => {
    if (!jobId) return;
    employerApi.getApplications(Number(jobId))
      .then((data) => {
        setJob(data.job);
        const apps = (data as any).applications ?? [];
        setApplications(apps);
        setEmployerVerified((data as any).employer_verified ?? false);
        // Viewing this page counts every current applicant as seen,
        // which clears the red badges for this job.
        if (user) markJobApplicationsSeen(user.id, Number(jobId), apps.length);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [jobId, user]);

  const handleStatusUpdate = (appId: number, newStatus: string) =>
    setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status: newStatus as Application["status"] } : a));

  const handleReferred = (appId: number) =>
    setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, already_referred: true } : a));

  if (loading) return <div style={{ textAlign: "center", padding: 64, color: "#6B7280" }}>{ap.loading}</div>;
  if (error || !job) return <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: 20, color: "#DC2626" }}>{error || ap.jobNotFound}</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <button onClick={() => navigate("/employer/dashboard")}
          style={{ background: "none", border: "none", color: "#0A0F1E", fontSize: 13, fontWeight: 400, cursor: "pointer", padding: "0 0 8px", fontFamily: "Inter, sans-serif", textDecoration: "none" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}>
          {ap.backToDashboard}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#0A0F1E", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{ap.label}</p>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{job.title}</h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>
              {applications.length} {applications.length !== 1 ? ap.applicationPlural : ap.application}
            </p>
          </div>
          {SHOW_BUSINESS_VERIFICATION && !employerVerified && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "6px 12px", marginLeft: "auto" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#D97706" }}>
                <a href="/employer/verify-business" style={{ color: "#D97706", fontWeight: 700 }}>Verify your business</a> to issue referrals
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {applications.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 48, textAlign: "center", color: "#6B7280" }}>
          {ap.noApplications}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {applications.map((app, i) => (
            <motion.div key={app.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", padding: 24 }}>

              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: "#0A0F1E" }}>{app.name}</span>
                    <VerifBadge status={app.verification_status} />
                    {app.status === "hired" && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED", background: "#F3E8FF", border: "1px solid #DDD6FE", padding: "2px 7px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>{ap.hired}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{app.email}</span>
                  {app.phone && <span style={{ fontSize: 13, color: "#6B7280" }}> &middot; {app.phone}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <StatusDropdown appId={app.id} currentStatus={app.status} onUpdate={handleStatusUpdate} />
                  {(app.status as string) === "interview_scheduled" ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 7, padding: "5px 10px" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {ap.interviewScheduled}
                    </span>
                  ) : app.status !== "rejected" && (
                    <button
                      onClick={() => setScheduleApp(app)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#0A0F1E", background: "transparent", border: "1.5px solid #D4A853", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#FFFBF0"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {ap.scheduleInterview}
                    </button>
                  )}
                  <ReferButton app={app} employerVerified={employerVerified} onReferred={handleReferred} />
                </div>
              </div>

              {/* Cover letter */}
              {app.cover_letter && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>{ap.letterFromWorker}</p>
                  <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{app.cover_letter}</p>
                </div>
              )}

              {/* Meta row */}
              {(app.experience_years != null || app.languages_spoken || app.face_match_score != null) && (
                <div style={{ paddingTop: 10, borderTop: "1px solid #F3F4F6", display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 2 }}>
                  {app.experience_years != null && (
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{ap.experience}</span>
                      <p style={{ fontSize: 13, color: "#0A0F1E", margin: "2px 0 0" }}>{app.experience_years} {app.experience_years !== 1 ? ap.yrs : ap.yr}</p>
                    </div>
                  )}
                  {app.languages_spoken && (
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{ap.languages}</span>
                      <p style={{ fontSize: 13, color: "#0A0F1E", margin: "2px 0 0" }}>{app.languages_spoken}</p>
                    </div>
                  )}
                  {app.face_match_score != null && (
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{ap.faceMatch}</span>
                      <p style={{ fontSize: 13, color: "#0A0F1E", margin: "2px 0 0" }}>{Math.round(app.face_match_score)}%</p>
                    </div>
                  )}
                </div>
              )}

              {/* Worker referrals */}
              <WorkerReferrals referrals={app.referrals ?? []} count={app.referral_count ?? 0} />
            </motion.div>
          ))}
        </div>
      )}

      {scheduleApp && (
        <ScheduleInterviewModal
          appId={scheduleApp.id}
          workerName={scheduleApp.name || "the worker"}
          onClose={() => setScheduleApp(null)}
          onScheduled={() => {
            // Direct manual scheduling marks the application immediately;
            // proposals stay pending until the worker confirms.
            setApplications((prev) =>
              prev.map((a) => a.id === scheduleApp.id ? { ...a } : a)
            );
          }}
        />
      )}
    </div>
  );
}
