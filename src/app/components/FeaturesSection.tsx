import { motion } from "motion/react";
import { useLang } from "../context/LanguageContext";

// ── Actual app-UI cards (look like real screenshots) ─────────────────────────

function AIScreeningCard() {
  const candidates = [
    { name: "Maria G.",   role: "Line Cook · 3 yrs",  score: 87, color: "#16A34A", bg: "#DCFCE7", initials: "MG", avatarBg: "#BBF7D0" },
    { name: "Carlos R.",  role: "Prep Cook · 1 yr",   score: 64, color: "#D97706", bg: "#FEF3C7", initials: "CR", avatarBg: "#FDE68A" },
    { name: "Jae-won L.", role: "Line Cook · 6 mo",   score: 31, color: "#DC2626", bg: "#FEE2E2", initials: "JL", avatarBg: "#FECACA" },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Card header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#FAFAFA",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E" }}>Applicants</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#C9A84C",
            background: "#FFF9E6",
            border: "1px solid #F0D87A",
            padding: "2px 8px",
            borderRadius: 20,
            letterSpacing: "0.04em",
          }}
        >
          AI Ranked
        </span>
      </div>

      {/* Rows */}
      <div>
        {candidates.map((c, i) => (
          <div
            key={c.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 16px",
              borderBottom: i < candidates.length - 1 ? "1px solid #F3F4F6" : "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: c.avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "#374151",
                flexShrink: 0,
              }}
            >
              {c.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1E" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{c.role}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 56, height: 4, borderRadius: 99, background: "#F3F4F6", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${c.score}%`, background: c.color, borderRadius: 99 }} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.color,
                  background: c.bg,
                  padding: "2px 7px",
                  borderRadius: 20,
                  minWidth: 28,
                  textAlign: "center",
                }}
              >
                {c.score}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid #F3F4F6",
          background: "#FAFAFA",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>3 of 18 applicants shown</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C" }}>View all →</span>
      </div>
    </div>
  );
}

function LanguageCard({ chips }: { chips: string[] }) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #F3F4F6",
          background: "#FAFAFA",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E", marginBottom: 2 }}>
          Job Posting Language
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>Select a language to preview</div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Language chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {chips.map((chip, i) => (
            <button
              key={chip}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: i === 2 ? 600 : 400,
                color: i === 2 ? "#0A0F1E" : "#6B7280",
                background: i === 2 ? "#C9A84C" : "#F7F7F5",
                border: i === 2 ? "1.5px solid #C9A84C" : "1.5px solid #E5E7EB",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div
          style={{
            background: "#F7F7F5",
            borderRadius: 8,
            padding: 12,
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#C9A84C",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}
          >
            中文 Preview
          </div>
          <div style={{ fontSize: 13, color: "#0A0F1E", lineHeight: 1.55, marginBottom: 8 }}>
            招聘经验丰富的炒锅厨师，负责晚间服务。每周发薪，提供餐饮福利。
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#9CA3AF",
              borderTop: "1px solid #E5E7EB",
              paddingTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22C55E",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            Auto-translated from English
          </div>
        </div>
      </div>
    </div>
  );
}

function VerificationCard({ checks }: { checks: string[] }) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #F3F4F6",
          background: "#FAFAFA",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E" }}>Identity Verification</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#16A34A",
            background: "#DCFCE7",
            border: "1px solid #BBF7D0",
            padding: "2px 8px",
            borderRadius: 20,
          }}
        >
          Verified
        </span>
      </div>

      <div style={{ padding: 16 }}>
        {/* Worker row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 700,
              color: "#1D4ED8",
              flexShrink: 0,
              border: "2px solid #22C55E",
            }}
          >
            AT
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0A0F1E" }}>Anh Tran</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>Server · Ho Chi Minh City</div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "#DCFCE7",
                border: "1px solid #BBF7D0",
                borderRadius: 20,
                padding: "2px 8px",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: "#16A34A" }}>Identity Verified</span>
            </div>
          </div>
        </div>

        {/* Check rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {checks.map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                background: "#F7F7F5",
                borderRadius: 7,
                border: "1px solid #E5E7EB",
              }}
            >
              <span style={{ fontSize: 12, color: "#0A0F1E" }}>{label}</span>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#22C55E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="8" height="6" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Feature row ───────────────────────────────────────────────────────────────

interface FeatureRowProps {
  reverse?: boolean;
  card: React.ReactNode;
  label: string;
  heading: string;
  body: string;
  index: number;
}

function FeatureRow({ reverse = false, card, label, heading, body, index }: FeatureRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 72,
        alignItems: "center",
        marginBottom: 80,
      }}
    >
      {/* Card panel — clean white box, simple border */}
      <div style={{ order: reverse ? 2 : 1 }}>
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #E5E7EB",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {card}
        </div>
      </div>

      {/* Copy */}
      <div style={{ order: reverse ? 1 : 2, padding: "0 8px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#C9A84C",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {label}
        </div>
        <h3
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 700,
            color: "#0A0F1E",
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: 0,
            marginBottom: 16,
          }}
        >
          {heading}
        </h3>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 400,
            color: "#6B7280",
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function FeaturesSection() {
  const { t } = useLang();
  const f = t.features;

  return (
    <section
      id="platform"
      style={{
        background: "#ffffff",
        fontFamily: "Inter, sans-serif",
        padding: "104px 0 40px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 80 }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#C9A84C",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {f.sectionLabel}
          </div>
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(34px, 4vw, 52px)",
              fontWeight: 700,
              color: "#0A0F1E",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              margin: 0,
              maxWidth: 560,
            }}
          >
            {f.sectionHeading}
          </h2>
        </motion.div>

        <FeatureRow
          index={0}
          card={<AIScreeningCard />}
          label={f.aiScreening.label}
          heading={f.aiScreening.heading}
          body={f.aiScreening.body}
        />
        <FeatureRow
          index={1}
          reverse
          card={<LanguageCard chips={f.languages.chips} />}
          label={f.languages.label}
          heading={f.languages.heading}
          body={f.languages.body}
        />
        <FeatureRow
          index={2}
          card={<VerificationCard checks={f.verification.checks} />}
          label={f.verification.label}
          heading={f.verification.heading}
          body={f.verification.body}
        />
      </div>
    </section>
  );
}
