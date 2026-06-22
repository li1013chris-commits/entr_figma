import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { employerVerifyApi, type EmployerVerification } from "../../api/client";

function StatusCard({ ev }: { ev: EmployerVerification }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    verified: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    pending:  { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    failed:   { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  };
  const s = ev.business_verification_status;
  const c = colors[s] || colors.pending;

  return (
    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 14, padding: 28, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        {s === "verified" ? (
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="13" viewBox="0 0 16 13" fill="none"><path d="M1.5 7L6 11.5L14.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        ) : (
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="white"/></svg>
          </div>
        )}
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: c.color, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Business Verification</p>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>
            {s === "verified" ? "Business Verified" : s === "failed" ? "Verification Failed" : "Verification Pending"}
          </h2>
        </div>
      </div>

      {ev.failure_reason && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 14 }}>
          {ev.failure_reason}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {ev.business_name_entered && (
          <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>Business Name</p>
            <p style={{ fontSize: 13, color: "#0A0F1E", margin: 0, fontWeight: 600 }}>{ev.business_name_entered}</p>
          </div>
        )}
        {ev.address_entered && (
          <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>Address</p>
            <p style={{ fontSize: 13, color: "#0A0F1E", margin: 0 }}>{ev.address_entered}</p>
          </div>
        )}
        {ev.document_type && (
          <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>Document Type</p>
            <p style={{ fontSize: 13, color: "#0A0F1E", margin: 0 }}>{ev.document_type}</p>
          </div>
        )}
        {ev.match_confidence != null && (
          <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>Match Confidence</p>
            <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: ev.match_confidence >= 75 ? "#16A34A" : "#D97706" }}>
              {ev.match_confidence.toFixed(0)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentUpload({ onFile, uploading }: { onFile: (f: File) => void; uploading: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fname, setFname] = useState("");

  const handle = (file: File) => {
    setPreview(URL.createObjectURL(file));
    setFname(file.name);
    onFile(file);
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 8 }}>
        Business Document <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(business license, health permit, or utility bill)</span>
      </label>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: preview ? "2px solid #C9A84C" : "2px dashed #D1D5DB",
          borderRadius: 10, padding: preview ? "16px" : "28px 20px",
          background: preview ? "#FFFBF0" : "#F9FAFB",
          cursor: uploading ? "not-allowed" : "pointer",
          textAlign: "center", opacity: uploading ? 0.7 : 1,
          transition: "all 0.15s",
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" style={{ maxHeight: 120, maxWidth: "100%", borderRadius: 6, objectFit: "contain", marginBottom: 8 }} />
            <p style={{ fontSize: 12, color: uploading ? "#C9A84C" : "#16A34A", fontWeight: 600, margin: "0 0 2px" }}>
              {uploading ? "Uploading..." : "Document selected"}
            </p>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{fname} — click to change</p>
          </>
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1E", margin: "0 0 3px" }}>Click to upload document</p>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>JPG or PNG photo of the document</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />
    </div>
  );
}

export function VerifyBusinessPage() {
  const [ev, setEv]               = useState<EmployerVerification | null>(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");
  const [file, setFile]           = useState<File | null>(null);
  const [name, setName]           = useState("");
  const [address, setAddress]     = useState("");
  const [showForm, setShowForm]   = useState(false);

  useEffect(() => {
    employerVerifyApi.getStatus()
      .then((d) => {
        setEv(d.verification);
        if (!d.verification) setShowForm(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Please upload your business document."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await employerVerifyApi.submit(name, address, file);
      setEv(res.verification);
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 14,
    border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none",
    fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: "#fff", boxSizing: "border-box",
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Employer</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>Business Verification</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "6px 0 0" }}>
          Verified businesses can issue referrals for workers they have hired.
        </p>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 64, color: "#6B7280" }}>Loading...</div>
      ) : (
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          {ev && <StatusCard ev={ev} />}

          {/* Resubmit link for non-verified states */}
          {ev && ev.business_verification_status !== "verified" && !showForm && (
            <button onClick={() => setShowForm(true)}
              style={{ fontSize: 13, fontWeight: 600, color: "#C9A84C", background: "none", border: "none", cursor: "pointer", padding: "0 0 20px", fontFamily: "Inter, sans-serif" }}>
              Resubmit with a different document
            </button>
          )}

          <AnimatePresence>
            {showForm && (
              <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0A0F1E", margin: "0 0 20px" }}>
                  {ev ? "Resubmit Verification" : "Verify Your Business"}
                </h2>

                {error && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>
                      Business Name <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      placeholder="e.g. Golden Dragon Restaurant"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0A0F1E", marginBottom: 6 }}>
                      Business Address <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required
                      placeholder="e.g. 123 Main Street, San Francisco, CA 94103"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0" }}>
                      Must match exactly what appears on your document.
                    </p>
                  </div>
                  <DocumentUpload onFile={setFile} uploading={submitting} />
                  <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                    <motion.button type="submit" disabled={submitting}
                      whileHover={submitting ? {} : { scale: 1.01 }} whileTap={submitting ? {} : { scale: 0.98 }}
                      style={{ flex: 1, padding: "12px", background: submitting ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}>
                      {submitting ? "Verifying..." : "Submit for Verification"}
                    </motion.button>
                    {ev && (
                      <button type="button" onClick={() => setShowForm(false)}
                        style={{ padding: "12px 16px", background: "transparent", color: "#6B7280", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif", cursor: "pointer" }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {!ev && !showForm && (
            <div style={{ background: "#F7F7F5", border: "1px solid #E5E7EB", borderRadius: 12, padding: "24px", textAlign: "center" }}>
              <p style={{ color: "#6B7280", fontSize: 15, margin: 0 }}>No verification submitted yet.</p>
              <button onClick={() => setShowForm(true)} style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", border: "none", borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                Start Verification
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
