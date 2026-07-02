import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { workerApi, type Job } from "../../api/client";
import { useLang } from "../../context/LanguageContext";
import { ContactEmployer, hasContactInfo } from "../../components/ContactEmployer";
import { EmploymentDisclosure } from "../../components/EmploymentDisclosure";

export function ApplyPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { t } = useLang();
  const a = t.applyPage;

  const [job, setJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    workerApi.getJobs().then((data) => { const found = data.jobs.find((j) => j.id === Number(jobId)); setJob(found || null); }).finally(() => setLoading(false));
  }, [jobId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try { await workerApi.apply(Number(jobId), coverLetter); navigate("/worker/dashboard"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Application failed"); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 64, color: "#6B7280" }}>{t.browseJobs.loading}</div>;
  if (!job) return <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: 20, color: "#DC2626" }}>{a.jobNotFound}</div>;

  const detailRows = [
    { label: a.pay, value: job.pay },
    { label: a.hours, value: job.hours },
    { label: a.location, value: job.location || a.notSpecified },
    { label: a.experienceRequired, value: job.experience_required ? `${job.experience_required}` : a.none },
    { label: a.langPref, value: job.language_preference || a.any },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <button onClick={() => navigate("/worker/jobs")}
          style={{ background: "none", border: "none", color: "#C9A84C", fontSize: 13, fontWeight: 500, cursor: "pointer", padding: "0 0 8px", fontFamily: "Inter, sans-serif" }}>
          {a.back}
        </button>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{a.label}</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{job.title}</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>{job.restaurant_name || job.employer_name}{job.location ? ` · ${job.location}` : ""}</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="apply-grid">
        <style>{`@media (max-width: 768px) { .apply-grid { grid-template-columns: 1fr !important; } }`}</style>

        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
          style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0A0F1E", margin: "0 0 16px" }}>{a.jobDetails}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {detailRows.map((item) => (
              <div key={item.label}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>{item.label}</p>
                <p style={{ fontSize: 14, color: "#0A0F1E", margin: 0, fontWeight: 500 }}>{item.value}</p>
              </div>
            ))}
          </div>
          {job.description && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>{a.description}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{job.description}</p>
            </div>
          )}
          {hasContactInfo(job) && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F3F4F6" }}>
              <ContactEmployer job={job} />
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0A0F1E", margin: "0 0 16px" }}>{a.yourApplication}</h2>
          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#DC2626", marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>{a.coverLetter}</label>
              <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={8} placeholder={a.coverLetterPlaceholder}
                style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none", fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: "#fff", boxSizing: "border-box", resize: "vertical", lineHeight: "1.5" }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A84C")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0" }}>{a.coverLetterNote}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <motion.button type="submit" disabled={submitting} whileHover={submitting ? {} : { scale: 1.01 }} whileTap={submitting ? {} : { scale: 0.98 }}
                style={{ flex: 1, padding: "12px", background: submitting ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}>
                {submitting ? a.submitting : a.submit}
              </motion.button>
              <button type="button" onClick={() => navigate("/worker/jobs")}
                style={{ padding: "12px 16px", background: "transparent", color: "#6B7280", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif", cursor: "pointer" }}>
                {a.cancel}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <EmploymentDisclosure />
    </div>
  );
}
