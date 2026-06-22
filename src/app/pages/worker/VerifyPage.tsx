import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { workerApi, type Verification } from "../../api/client";
import { useLang } from "../../context/LanguageContext";

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current, total, stepOf, of }: { current: number; total: number; stepOf: string; of: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: done ? "#C9A84C" : active ? "#0A0F1E" : "#F3F4F6", color: done || active ? "#fff" : "#9CA3AF", transition: "all 0.25s", flexShrink: 0 }}>
              {done ? (
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M1.5 6L5.5 10L12.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : step}
            </div>
            {step < total && <div style={{ width: 48, height: 2, background: done ? "#C9A84C" : "#E5E7EB", borderRadius: 99, transition: "background 0.35s" }} />}
          </div>
        );
      })}
      <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: "#6B7280" }}>{stepOf} {current} {of} {total}</span>
    </div>
  );
}

// ── Three-option upload picker ─────────────────────────────────────────────────

interface UploadOption {
  id: string;
  title: string;
  hint: string;
  accept: string;
  capture?: "user" | "environment";
  icon: React.ReactNode;
}

function UploadOptions({
  onFile,
  uploading,
  mode,
  uploadLabels,
}: {
  onFile: (f: File) => void;
  uploading: boolean;
  mode: "id" | "selfie";
  uploadLabels: { clickOrDrag: string; uploading: string; selected: string };
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setPreview(URL.createObjectURL(file));
    setSelected(file.name);
    onFile(file);
  };

  const options: UploadOption[] = [
    {
      id: "camera",
      title: "Take Photo",
      hint: mode === "selfie" ? "Front camera" : "Use camera",
      accept: "image/*",
      capture: mode === "selfie" ? "user" : "environment",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      ),
    },
    {
      id: "photos",
      title: "Choose from Photos",
      hint: "Photo library",
      accept: "image/*",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      ),
    },
    {
      id: "document",
      title: "Upload Document",
      hint: "PDF or image scan",
      accept: "image/jpeg,image/png,application/pdf",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
    },
  ];

  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          border: "2px solid #C9A84C",
          borderRadius: 12,
          padding: "20px",
          background: "#FFFBF0",
          textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          opacity: uploading ? 0.7 : 1,
        }}
        onClick={() => !uploading && refs.current[1]?.click()}
      >
        <img src={preview} alt="Preview" style={{ maxHeight: 160, maxWidth: "100%", borderRadius: 8, marginBottom: 12, objectFit: "contain" }} />
        <p style={{ fontSize: 13, color: uploading ? "#C9A84C" : "#16A34A", fontWeight: 600, margin: 0 }}>
          {uploading ? uploadLabels.uploading : uploadLabels.selected}
        </p>
        {!uploading && selected && (
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected}</p>
        )}
        {/* Hidden input for re-picking */}
        <input ref={el => refs.current[1] = el} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </motion.div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {options.map((opt, i) => (
        <motion.button
          key={opt.id}
          type="button"
          disabled={uploading}
          onClick={() => refs.current[i]?.click()}
          whileHover={uploading ? {} : { y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}
          whileTap={uploading ? {} : { scale: 0.97 }}
          style={{
            background: "#ffffff",
            border: "1.5px solid #E5E7EB",
            borderRadius: 12,
            padding: "20px 12px",
            cursor: uploading ? "not-allowed" : "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            fontFamily: "Inter, sans-serif",
            transition: "border-color 0.15s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            opacity: uploading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => { if (!uploading) (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; }}
        >
          <div style={{ color: "#C9A84C" }}>{opt.icon}</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E", margin: 0, textAlign: "center", lineHeight: 1.3 }}>{opt.title}</p>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: "3px 0 0", textAlign: "center" }}>{opt.hint}</p>
          </div>
          <input
            ref={el => refs.current[i] = el}
            type="file"
            accept={opt.accept}
            {...(opt.capture ? { capture: opt.capture } : {})}
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </motion.button>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function VerifyPage() {
  const { t } = useLang();
  const v = t.verifyPage;
  const [verification, setVerification] = useState<Verification | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resubmitting, setResubmitting] = useState(false);

  const loadVerification = async () => {
    try {
      const data = await workerApi.getVerification();
      setVerification(data.verification);
      if (data.verification) {
        setStep(data.verification.selfie_path ? 3 : data.verification.id_document_path ? 2 : 1);
      } else { setStep(1); }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadVerification(); }, []);

  const handleIdUpload = async (file: File) => {
    setError(""); setMessage(""); setUploading(true);
    try { const res = await workerApi.uploadId(file); setMessage(res.message); setStep(2); await loadVerification(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSelfieUpload = async (file: File) => {
    setError(""); setMessage(""); setUploading(true);
    try { const res = await workerApi.uploadSelfie(file); setVerification(res.verification); setStep(3); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); }
  };

  const handleResubmit = async () => {
    setResubmitting(true);
    try { await workerApi.resubmitVerification(); setVerification(null); setStep(1); setError(""); setMessage(""); }
    finally { setResubmitting(false); }
  };

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    verified:      { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    flagged:       { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    manual_review: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    pending:       { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  };

  const errorBox = (msg: string) => (
    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 16 }}>{msg}</div>
  );
  const successBox = (msg: string) => (
    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#16A34A", marginBottom: 16 }}>{msg}</div>
  );

  const cardStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: 16, padding: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  };

  return (
    <div>
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{v.label}</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{v.title}</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "6px 0 0" }}>{v.tagline}</p>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 64, color: "#6B7280" }}>{v.loading}</div>
      ) : (
        /* Centered container, max 650px */
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          <StepIndicator current={step} total={3} stepOf={v.stepOf} of={v.of} />

          <AnimatePresence mode="wait">

            {/* ── Step 1: Upload ID ── */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} style={cardStyle}>
                <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0A0F1E", margin: "0 0 6px" }}>{v.step1.title}</h2>
                <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>{v.step1.desc}</p>
                {error && errorBox(error)}
                <UploadOptions onFile={handleIdUpload} uploading={uploading} mode="id" uploadLabels={v.upload} />
                {uploading && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
                    <div style={{ width: 16, height: 16, border: "2px solid #E5E7EB", borderTop: "2px solid #C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ fontSize: 13, color: "#C9A84C", margin: 0, fontWeight: 500 }}>{v.step1.uploading}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 2: Upload selfie ── */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} style={cardStyle}>
                <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0A0F1E", margin: "0 0 6px" }}>{v.step2.title}</h2>
                <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>{v.step2.desc}</p>
                {message && successBox(message)}
                {error && errorBox(error)}
                <UploadOptions onFile={handleSelfieUpload} uploading={uploading} mode="selfie" uploadLabels={v.upload} />
                {uploading && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
                    <div style={{ width: 16, height: 16, border: "2px solid #E5E7EB", borderTop: "2px solid #C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ fontSize: 13, color: "#C9A84C", margin: 0, fontWeight: 500 }}>{v.step2.uploading}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 3: Result ── */}
            {step === 3 && verification && (() => {
              const status = verification.verification_status || "pending";
              const c = statusColors[status] || statusColors.pending;
              const r = v.result;
              const titleText =
                status === "verified" ? r.verified :
                status === "flagged"  ? r.flagged :
                status === "manual_review" ? r.manualReview : r.pending;

              return (
                <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                  <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 32, marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      {status === "verified" ? (
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="16" height="13" viewBox="0 0 16 13" fill="none"><path d="M1.5 7L6 11.5L14.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                      )}
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 600, color: c.color, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{v.title}</p>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{titleText}</h2>
                      </div>
                    </div>

                    {verification.failure_reason && errorBox(verification.failure_reason)}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {verification.extracted_name && (
                        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "12px 14px" }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>{r.nameOnId}</p>
                          <p style={{ fontSize: 14, color: "#0A0F1E", margin: 0, fontWeight: 600 }}>{verification.extracted_name}</p>
                        </div>
                      )}
                      {verification.face_match_score != null && (
                        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "12px 14px" }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>{r.faceMatchScore}</p>
                          <p style={{ fontSize: 14, margin: 0, fontWeight: 700, color: verification.face_match_score >= 80 ? "#16A34A" : verification.face_match_score >= 60 ? "#D97706" : "#DC2626" }}>
                            {Math.round(verification.face_match_score)}%
                          </p>
                        </div>
                      )}
                      <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "12px 14px" }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>{r.ageVerified}</p>
                        <p style={{ fontSize: 14, color: verification.age_verified ? "#16A34A" : "#DC2626", margin: 0, fontWeight: 600 }}>{verification.age_verified ? r.ageYes : r.ageNo}</p>
                      </div>
                    </div>
                  </div>

                  {(status === "flagged" || status === "pending") && (
                    <motion.button onClick={handleResubmit} disabled={resubmitting} whileHover={resubmitting ? {} : { scale: 1.01 }} whileTap={resubmitting ? {} : { scale: 0.98 }}
                      style={{ width: "100%", padding: "13px", background: resubmitting ? "#E5E7EB" : "#C9A84C", color: "#0A0F1E", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: resubmitting ? "not-allowed" : "pointer", boxShadow: resubmitting ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}>
                      {resubmitting ? r.resetting : r.resubmit}
                    </motion.button>
                  )}
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
