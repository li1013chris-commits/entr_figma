import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ShareModalProps {
  jobId: number;
  jobTitle: string;
  onClose: () => void;
}

export function ShareModal({ jobId, jobTitle, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const jobUrl = `${window.location.origin}/jobs/${jobId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
    } catch {
      const input = document.createElement("input");
      input.value = jobUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = `/api/jobs/${jobId}/qrcode`;
    link.download = `entr-job-${jobId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px", fontFamily: "Inter, sans-serif" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", maxWidth: 420, background: "#ffffff", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" }}
        >
          {/* Header */}
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px" }}>Share</p>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{jobTitle}</h2>
            </div>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", alignItems: "center", padding: 6, borderRadius: 6 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0A0F1E"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 24px 24px" }}>
            {/* QR code */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ border: "2px solid #E5E7EB", borderRadius: 12, padding: 12, background: "#F9FAFB" }}>
                <img
                  src={`/api/jobs/${jobId}/qrcode`}
                  alt="QR code for this job"
                  width={160}
                  height={160}
                  style={{ display: "block", borderRadius: 4 }}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const parent = el.parentElement;
                    if (parent) {
                      parent.style.display = "flex";
                      parent.style.alignItems = "center";
                      parent.style.justifyContent = "center";
                      parent.style.width = "160px";
                      parent.style.height = "160px";
                      parent.innerHTML = '<span style="font-size:12px;color:#9CA3AF">QR not available</span>';
                    }
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", margin: "0 0 18px" }}>Scan to open this job listing</p>

            {/* URL display */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              <span style={{ fontSize: 12, color: "#6B7280", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{jobUrl}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <motion.button
                onClick={copyLink}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 16px", background: copied ? "#DCFCE7" : "#C9A84C", color: copied ? "#16A34A" : "#0A0F1E", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: "pointer", transition: "background 0.2s, color 0.2s", boxShadow: copied ? "none" : "0 2px 8px rgba(201,168,76,0.3)" }}
              >
                {copied ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    Link copied!
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy link
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={downloadQR}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 16px", background: "transparent", color: "#0A0F1E", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#0A0F1E"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download QR code
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
