import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { workerApi, type Application, type Verification } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";

function VerificationCard({ verification, labels }: { verification: Verification | null; labels: typeof import("../../context/LanguageContext").translations.en.workerDash.verif }) {
  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    verified:      { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    flagged:       { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    manual_review: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    pending:       { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  };
  const status = verification?.verification_status || "pending";
  const c = statusColors[status] || statusColors.pending;
  const message =
    status === "verified" ? labels.verified :
    status === "flagged"  ? labels.flagged :
    status === "manual_review" ? labels.manualReview :
    verification?.id_document_path ? labels.inProgress : labels.notVerified;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: c.color, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{labels.label}</p>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1E", margin: 0 }}>{message}</p>
        {verification?.failure_reason && <p style={{ fontSize: 13, color: "#DC2626", margin: "4px 0 0" }}>{verification.failure_reason}</p>}
      </div>
      {status !== "verified" && (
        <Link to="/worker/verify"
          style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", textDecoration: "none", padding: "8px 16px", borderRadius: 8, whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(201,168,76,0.3)" }}>
          {status === "flagged" ? labels.resubmit : labels.verifyNow}
        </Link>
      )}
    </motion.div>
  );
}

export function WorkerDashboardPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const d = t.workerDash;
  const [applications, setApplications] = useState<Application[]>([]);
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([workerApi.getApplications(), workerApi.getVerification()])
      .then(([appsData, verData]) => { setApplications(appsData.applications); setVerification(verData.verification); })
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending:  { bg: "#F3F4F6", color: "#6B7280" },
    reviewed: { bg: "#EFF6FF", color: "#2563EB" },
    accepted: { bg: "#DCFCE7", color: "#16A34A" },
    rejected: { bg: "#FEF2F2", color: "#DC2626" },
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{d.label}</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{d.welcome} {user?.name}</h1>
      </motion.div>

      {!loading && <VerificationCard verification={verification} labels={d.verif} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{d.myApplications}</h2>
        <Link to="/worker/jobs" style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", textDecoration: "none", padding: "8px 16px", borderRadius: 8, boxShadow: "0 2px 6px rgba(201,168,76,0.3)" }}>
          {d.browseJobs}
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "#6B7280" }}>{t.employerDash.loading}</div>
      ) : applications.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 16 }}>{d.noApplications}</p>
          <Link to="/worker/jobs" style={{ fontSize: 14, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", textDecoration: "none", padding: "10px 20px", borderRadius: 8 }}>{d.browseAvailable}</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {applications.map((app, i) => {
            const sc = statusColors[app.status] || statusColors.pending;
            return (
              <motion.div key={app.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0F1E", margin: "0 0 2px" }}>{app.title}</p>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{app.restaurant_name || app.employer_name}{app.location ? ` · ${app.location}` : ""}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {app.ai_score != null && (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>{d.aiScore}</p>
                      <span style={{ fontSize: 16, fontWeight: 700, color: app.ai_score >= 70 ? "#16A34A" : app.ai_score >= 40 ? "#D97706" : "#DC2626" }}>{app.ai_score}</span>
                    </div>
                  )}
                  <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20 }}>
                    {(d.appStatuses as Record<string, string>)[app.status] || app.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
