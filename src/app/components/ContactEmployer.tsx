import { useState } from "react";
import type { Job } from "../api/client";

/**
 * Worker-facing "Contact Employer" section.
 * Renders a tappable pill for each contact method the employer filled in.
 */

function digitsOnly(v: string): string {
  return v.replace(/[^\d]/g, "");
}

const PILL: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "Inter, sans-serif",
  color: "#0A0F1E",
  background: "#F7F7F5",
  border: "1.5px solid #E5E7EB",
  borderRadius: 8,
  padding: "8px 12px",
  textDecoration: "none",
  cursor: "pointer",
  transition: "border-color 0.15s, background 0.15s",
};

function hoverOn(e: React.MouseEvent) {
  (e.currentTarget as HTMLElement).style.borderColor = "#D4A853";
  (e.currentTarget as HTMLElement).style.background = "#FFFBF0";
}
function hoverOff(e: React.MouseEvent) {
  (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB";
  (e.currentTarget as HTMLElement).style.background = "#F7F7F5";
}

const ICONS = {
  phone: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  whatsapp: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  wechat: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <circle cx="9" cy="10" r="1" fill="#0A0F1E"/>
      <circle cx="15" cy="10" r="1" fill="#0A0F1E"/>
    </svg>
  ),
  line: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="4"/>
      <path d="M8 9v4M11 13V9l3 4V9M17 9v4h2" strokeWidth="1.6"/>
    </svg>
  ),
  gmail: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M22 7l-10 6L2 7"/>
    </svg>
  ),
};

function WeChatPill({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      const input = document.createElement("input");
      input.value = id;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy WeChat ID ${id}`}
      style={{ ...PILL, background: copied ? "#DCFCE7" : PILL.background, borderColor: copied ? "#BBF7D0" : "#E5E7EB" }}
      onMouseEnter={copied ? undefined : hoverOn}
      onMouseLeave={copied ? undefined : hoverOff}
    >
      {ICONS.wechat}
      {copied ? "Copied!" : `WeChat: ${id}`}
    </button>
  );
}

export function hasContactInfo(job: Job): boolean {
  return Boolean(
    job.contact_phone || job.contact_whatsapp || job.contact_wechat ||
    job.contact_line || job.contact_gchat
  );
}

export function ContactEmployer({ job, compact = false }: { job: Job; compact?: boolean }) {
  if (!hasContactInfo(job)) return null;

  const lineValue = (job.contact_line || "").trim();
  const lineHref = lineValue.startsWith("http")
    ? lineValue
    : `https://line.me/ti/p/~${encodeURIComponent(lineValue)}`;

  return (
    <div style={{ marginTop: compact ? 12 : 0 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#D4A853",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: "0 0 8px",
        }}
      >
        Contact Employer
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {job.contact_phone && (
          <a
            href={`tel:${job.contact_phone.replace(/[^\d+]/g, "")}`}
            style={PILL}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
            aria-label={`Call ${job.contact_phone}`}
          >
            {ICONS.phone}
            {compact ? "Call" : job.contact_phone}
          </a>
        )}
        {job.contact_whatsapp && (
          <a
            href={`https://wa.me/${(() => { const d = digitsOnly(job.contact_whatsapp!); return d.length === 10 ? "1" + d : d; })()}`}
            target="_blank"
            rel="noopener noreferrer"
            style={PILL}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
            aria-label="Message on WhatsApp"
          >
            {ICONS.whatsapp}
            WhatsApp
          </a>
        )}
        {job.contact_wechat && <WeChatPill id={job.contact_wechat} />}
        {job.contact_line && (
          <a
            href={lineHref}
            target="_blank"
            rel="noopener noreferrer"
            style={PILL}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
            aria-label="Add on Line"
          >
            {ICONS.line}
            Line
          </a>
        )}
        {job.contact_gchat && (
          <a
            href={`mailto:${job.contact_gchat}`}
            style={PILL}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
            aria-label={`Email ${job.contact_gchat}`}
          >
            {ICONS.gmail}
            {compact ? "Email" : job.contact_gchat}
          </a>
        )}
      </div>
    </div>
  );
}
