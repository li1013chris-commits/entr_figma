import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { publicApi, type Job } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ShareModal } from "../components/ShareModal";
import { ContactEmployer, hasContactInfo } from "../components/ContactEmployer";
import { EmploymentDisclosure } from "../components/EmploymentDisclosure";

function MetaBadge({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "14px 16px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10 }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 500, color: "#0A0F1E", margin: 0 }}>{value}</p>
    </div>
  );
}

export function PublicJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    publicApi.getJob(Number(jobId))
      .then((data) => setJob(data.job))
      .catch(() => setError("Job not found or no longer available."))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ color: "#6B7280", fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0A0F1E", margin: "0 0 8px" }}>Job not found</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>{error}</p>
          <Link to="/" style={{ display: "inline-block", padding: "10px 22px", background: "#C9A84C", color: "#0A0F1E", fontWeight: 600, fontSize: 14, textDecoration: "none", borderRadius: 8 }}>Go home</Link>
        </div>
      </div>
    );
  }

  const canApply = user?.role === "worker";
  const jobIdNum = Number(jobId);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: "Inter, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid #E5E7EB", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>
              <span style={{ color: "#0A0F1E" }}>EN</span><span style={{ color: "#C9A84C" }}>TR</span>
            </span>
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            {!user && (
              <>
                <Link to="/login" style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, color: "#0A0F1E", border: "1.5px solid #E5E7EB", borderRadius: 8, textDecoration: "none", background: "#fff" }}>Log in</Link>
                <Link to="/signup?role=worker" style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", textDecoration: "none", borderRadius: 8, boxShadow: "0 2px 6px rgba(201,168,76,0.3)" }}>Sign up</Link>
              </>
            )}
            {user?.role === "worker" && (
              <Link to="/worker/dashboard" style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, color: "#0A0F1E", border: "1.5px solid #E5E7EB", borderRadius: 8, textDecoration: "none", background: "#fff" }}>My Dashboard</Link>
            )}
            {user?.role === "employer" && (
              <Link to="/employer/dashboard" style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, color: "#0A0F1E", border: "1.5px solid #E5E7EB", borderRadius: 8, textDecoration: "none", background: "#fff" }}>Dashboard</Link>
            )}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>

          {/* Header card */}
          <div style={{ background: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "28px 28px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ background: job.status === "open" ? "#DCFCE7" : "#F3F4F6", color: job.status === "open" ? "#16A34A" : "#6B7280", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20 }}>
                    {job.status === "open" ? "Now Hiring" : "Position Closed"}
                  </span>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0F1E", margin: "0 0 6px", lineHeight: 1.2 }}>{job.title}</h1>
                {(job.restaurant_name || job.employer_name) && (
                  <p style={{ fontSize: 15, color: "#6B7280", margin: "0 0 4px" }}>
                    {job.restaurant_name || job.employer_name}
                  </p>
                )}
                {job.location && (
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {job.location}
                  </p>
                )}
              </div>

              {/* Share button */}
              <button
                onClick={() => setShareOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", background: "transparent", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#6B7280", cursor: "pointer", fontFamily: "Inter, sans-serif", flexShrink: 0, transition: "border-color 0.15s, color 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C"; (e.currentTarget as HTMLElement).style.color = "#0A0F1E"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; (e.currentTarget as HTMLElement).style.color = "#6B7280"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
            </div>

            {/* CTA section */}
            {job.status === "open" && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #E5E7EB" }}>
                {canApply ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/worker/jobs/${jobId}/apply`)}
                    style={{ padding: "13px 32px", background: "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: "pointer", boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}
                  >
                    Apply Now
                  </motion.button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <Link to="/signup?role=worker"
                      style={{ display: "inline-block", padding: "13px 28px", background: "#C9A84C", color: "#0A0F1E", fontWeight: 600, fontSize: 15, textDecoration: "none", borderRadius: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}>
                      Sign up to apply
                    </Link>
                    <Link to="/login"
                      style={{ display: "inline-block", padding: "13px 20px", background: "transparent", color: "#6B7280", fontWeight: 500, fontSize: 14, textDecoration: "none", borderRadius: 8, border: "1.5px solid #E5E7EB" }}>
                      Log in
                    </Link>
                  </div>
                )}
              </div>
            )}
            {job.status !== "open" && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>This position is no longer accepting applications.</p>
              </div>
            )}
          </div>

          {/* Detail badges */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <MetaBadge label="Pay" value={job.pay} />
            <MetaBadge label="Hours" value={job.hours} />
            <MetaBadge label="Experience" value={job.experience_required === 0 ? "No experience required" : `${job.experience_required} year${job.experience_required !== 1 ? "s" : ""}`} />
            {job.language_preference && job.language_preference !== "any" && (
              <MetaBadge label="Language" value={job.language_preference} />
            )}
            {job.location && (
              <MetaBadge label="Location" value={job.location} />
            )}
          </div>

          {/* Description */}
          {job.description && (
            <div style={{ background: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1E", margin: "0 0 12px" }}>About this role</h2>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>{job.description}</p>
            </div>
          )}

          {/* Contact methods */}
          {hasContactInfo(job) && (
            <div style={{ marginTop: 14, background: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <ContactEmployer job={job} />
            </div>
          )}

          {/* Bottom banner for unauthenticated */}
          {job.status === "open" && !user && (
            <div style={{ marginTop: 16, padding: "20px 24px", background: "#0A0F1E", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", margin: "0 0 3px" }}>Interested in this job?</p>
                <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Create a free account and apply in minutes.</p>
              </div>
              <Link to="/signup?role=worker" style={{ display: "inline-block", padding: "11px 24px", background: "#C9A84C", color: "#0A0F1E", fontWeight: 600, fontSize: 14, textDecoration: "none", borderRadius: 8, flexShrink: 0 }}>
                Sign up free
              </Link>
            </div>
          )}
          <EmploymentDisclosure />
        </motion.div>
      </main>

      {shareOpen && (
        <ShareModal jobId={jobIdNum} jobTitle={job.title} onClose={() => setShareOpen(false)} />
      )}
    </div>
  );
}
