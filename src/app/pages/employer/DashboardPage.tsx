import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { employerApi, type Job } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";
import { ShareModal } from "../../components/ShareModal";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>{label}</p>
      <p style={{ fontSize: 36, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{value}</p>
    </motion.div>
  );
}

export function EmployerDashboardPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const d = t.employerDash;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);
  const [renewing, setRenewing] = useState<number | null>(null);
  const [shareJob, setShareJob] = useState<Job | null>(null);

  const fetchJobs = async () => {
    try { const data = await employerApi.getJobs(); setJobs(data.jobs); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleToggle = async (jobId: number) => {
    setToggling(jobId);
    try {
      const res = await employerApi.toggleJob(jobId);
      setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status: res.status as "open" | "closed" } : j));
    } finally { setToggling(null); }
  };

  const handleRenew = async (jobId: number) => {
    setRenewing(jobId);
    try {
      const res = await employerApi.renewJob(jobId);
      setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, expires_at: res.expires_at } : j));
    } finally { setRenewing(null); }
  };

  const getDaysLeft = (expiresAt?: string | null): number | null => {
    if (!expiresAt) return null;
    return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "open").length;
  const totalApps = jobs.reduce((sum, j) => sum + (j.application_count ?? 0), 0);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{d.label}</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{d.welcome} {user?.name}</h1>
        {user?.restaurant_name && <p style={{ fontSize: 15, color: "#6B7280", margin: "4px 0 0" }}>{user.restaurant_name}</p>}
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label={d.totalJobs} value={totalJobs} />
        <StatCard label={d.activeJobs} value={activeJobs} />
        <StatCard label={d.totalApplications} value={totalApps} />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{d.yourJobPostings}</h2>
          <Link to="/employer/post-job" style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", textDecoration: "none", padding: "8px 16px", borderRadius: 8, boxShadow: "0 2px 6px rgba(201,168,76,0.3)" }}>
            {d.postJob}
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#6B7280" }}>{d.loading}</div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 16 }}>{d.noJobsYet}</p>
            <Link to="/employer/post-job" style={{ fontSize: 14, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", textDecoration: "none", padding: "10px 20px", borderRadius: 8 }}>{d.postFirstJob}</Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  {[d.cols.title, d.cols.location, d.cols.pay, d.cols.applications, d.cols.status, "Expires", d.cols.actions].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={job.id} style={{ borderBottom: i < jobs.length - 1 ? "1px solid #F3F4F6" : "none", transition: "background 0.1s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontSize: 14, fontWeight: 600, color: "#0A0F1E" }}>{job.title}</span></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontSize: 13, color: "#6B7280" }}>{job.location || "—"}</span></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontSize: 13, color: "#6B7280" }}>{job.pay}</span></td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: (job.application_count ?? 0) > 0 ? "#0A0F1E" : "#6B7280" }}>{job.application_count ?? 0}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: job.status === "open" ? "#DCFCE7" : "#F3F4F6", color: job.status === "open" ? "#16A34A" : "#6B7280", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20 }}>
                        {job.status === "open" ? d.open : d.closed}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {(() => {
                        const days = getDaysLeft(job.expires_at);
                        if (days === null) return <span style={{ fontSize: 12, color: "#9CA3AF" }}>—</span>;
                        const bg = days <= 3 ? "#FEF2F2" : days <= 7 ? "#FEF9C3" : "#DCFCE7";
                        const color = days <= 3 ? "#DC2626" : days <= 7 ? "#D97706" : "#16A34A";
                        return (
                          <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
                            {days <= 0 ? "Expired" : `${days}d left`}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <Link to={`/employer/jobs/${job.id}/applications`}
                          style={{ fontSize: 12, fontWeight: 500, color: "#0A0F1E", background: "transparent", border: "1.5px solid #0A0F1E", textDecoration: "none", padding: "5px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>
                          {d.viewApps}
                        </Link>
                        <button onClick={() => setShareJob(job)}
                          style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", border: "none", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4, boxShadow: "0 1px 4px rgba(201,168,76,0.35)" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                          </svg>
                          Share
                        </button>
                        {job.expires_at && getDaysLeft(job.expires_at) !== null && getDaysLeft(job.expires_at)! <= 7 && (
                          <button onClick={() => handleRenew(job.id)} disabled={renewing === job.id}
                            style={{ fontSize: 12, fontWeight: 500, color: "#C9A84C", background: "transparent", border: "1.5px solid #C9A84C", padding: "5px 10px", borderRadius: 6, cursor: renewing === job.id ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap", opacity: renewing === job.id ? 0.6 : 1 }}>
                            {renewing === job.id ? "…" : "Renew"}
                          </button>
                        )}
                        <button onClick={() => handleToggle(job.id)} disabled={toggling === job.id}
                          style={{ fontSize: 12, fontWeight: 500, color: job.status === "open" ? "#DC2626" : "#16A34A", background: "transparent", border: `1.5px solid ${job.status === "open" ? "#DC2626" : "#16A34A"}`, padding: "5px 10px", borderRadius: 6, cursor: toggling === job.id ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap", opacity: toggling === job.id ? 0.6 : 1 }}>
                          {toggling === job.id ? "…" : job.status === "open" ? d.close : d.reopen}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {shareJob && (
        <ShareModal jobId={shareJob.id} jobTitle={shareJob.title} onClose={() => setShareJob(null)} />
      )}
    </div>
  );
}
