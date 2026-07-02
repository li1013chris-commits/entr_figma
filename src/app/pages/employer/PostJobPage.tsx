import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { employerApi } from "../../api/client";

const PAY_TYPES = [
  { value: "per_hour",    label: "Per Hour" },
  { value: "per_day",     label: "Per Day" },
  { value: "per_week",    label: "Per Week" },
  { value: "biweekly",    label: "Biweekly" },
  { value: "per_month",   label: "Per Month" },
  { value: "salary_year", label: "Salary (yearly)" },
];

const HOURS_OPTIONS = [
  { value: "full_time",     label: "Full-time (35–40 hrs/wk)" },
  { value: "part_time",     label: "Part-time (15–25 hrs/wk)" },
  { value: "weekends_only", label: "Weekends Only" },
  { value: "flexible",      label: "Flexible" },
  { value: "on_call",       label: "On-call" },
];

const CONTACT_FIELDS = [
  { key: "contact_phone",    label: "Phone number",        placeholder: "e.g. (336) 555-0142" },
  { key: "contact_whatsapp", label: "WhatsApp",            placeholder: "e.g. +1 336 555 0142" },
  { key: "contact_wechat",   label: "WeChat",              placeholder: "WeChat ID" },
  { key: "contact_line",     label: "Line",                placeholder: "Line ID" },
  { key: "contact_gchat",    label: "Google Chat / Gmail", placeholder: "you@gmail.com" },
] as const;

export function PostJobPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payType, setPayType] = useState("per_hour");
  const [tipsIncluded, setTipsIncluded] = useState(false);
  const [hours, setHours] = useState("");
  const [experienceRequired, setExperienceRequired] = useState(0);
  const [location, setLocation] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [contacts, setContacts] = useState<Record<string, string>>({
    contact_phone: "", contact_whatsapp: "", contact_wechat: "",
    contact_line: "", contact_gchat: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasContact = Object.values(contacts).some((v) => v.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!hours) { setError("Please choose the hours for this job."); return; }
    if (!hasContact) { setError("Please add at least one contact method so workers can reach you."); return; }
    setLoading(true);
    try {
      await employerApi.createJob({
        title,
        pay_amount: payAmount,
        pay_type: payType,
        tips_included: tipsIncluded,
        hours,
        experience_required: experienceRequired,
        location,
        skills_text: skillsText,
        additional_info: additionalInfo,
        contact_phone: contacts.contact_phone.trim(),
        contact_whatsapp: contacts.contact_whatsapp.trim(),
        contact_wechat: contacts.contact_wechat.trim(),
        contact_line: contacts.contact_line.trim(),
        contact_gchat: contacts.contact_gchat.trim(),
      });
      navigate("/employer/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    border: "1.5px solid #E5E7EB",
    borderRadius: 8,
    outline: "none",
    fontFamily: "Inter, sans-serif",
    color: "#0A0F1E",
    background: "#fff",
    boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    backgroundSize: "16px",
    paddingRight: 36,
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#0A0F1E",
    marginBottom: 6,
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 700,
    color: "#0A0F1E",
    margin: "4px 0 0",
    paddingTop: 16,
    borderTop: "1px solid #F3F4F6",
  };
  const focus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => (e.target.style.borderColor = "#C9A84C");
  const blur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => (e.target.style.borderColor = "#E5E7EB");

  return (
    <div style={{ maxWidth: 650, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#C9A84C",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: "0 0 6px",
          }}
        >
          New Listing
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>
          Post a Job
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "6px 0 0" }}>
          Tell workers about the job. Simple and clear works best.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 14,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: 32,
        }}
      >
        {error && (
          <div
            role="alert"
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 14,
              color: "#DC2626",
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* Position */}
          <div>
            <label htmlFor="job-title" style={labelStyle}>
              Position <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              id="job-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Line Cook, Server, Dishwasher"
              style={inputStyle}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          {/* Pay */}
          <div>
            <label htmlFor="job-pay" style={labelStyle}>
              Pay <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute", left: 12, top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 14, fontWeight: 600, color: "#6B7280",
                  }}
                >
                  $
                </span>
                <input
                  id="job-pay"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                  placeholder="18"
                  style={{ ...inputStyle, paddingLeft: 26 }}
                  onFocus={focus}
                  onBlur={blur}
                />
              </div>
              <select
                aria-label="Pay period"
                value={payType}
                onChange={(e) => setPayType(e.target.value)}
                style={{ ...selectStyle, flex: 1 }}
                onFocus={focus}
                onBlur={blur}
              >
                {PAY_TYPES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Tips toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0F1E" }}>
                Tips included?
              </span>
              <div style={{ display: "flex", gap: 8 }} role="radiogroup" aria-label="Tips included">
                {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map(({ v, l }) => (
                  <button
                    key={l}
                    type="button"
                    role="radio"
                    aria-checked={tipsIncluded === v}
                    onClick={() => setTipsIncluded(v)}
                    style={{
                      padding: "6px 18px",
                      fontSize: 13,
                      fontWeight: tipsIncluded === v ? 600 : 400,
                      fontFamily: "Inter, sans-serif",
                      color: tipsIncluded === v ? "#0A0F1E" : "#6B7280",
                      background: tipsIncluded === v ? "#FEF3C7" : "#fff",
                      border: `1.5px solid ${tipsIncluded === v ? "#C9A84C" : "#E5E7EB"}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <label htmlFor="job-hours" style={labelStyle}>
              Hours <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              id="job-hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              style={selectStyle}
              onFocus={focus}
              onBlur={blur}
            >
              <option value="" disabled>Choose hours…</option>
              {HOURS_OPTIONS.map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>

          {/* Experience + Location */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label htmlFor="job-exp" style={labelStyle}>Years of experience needed</label>
              <input
                id="job-exp"
                type="number"
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(Number(e.target.value))}
                min={0}
                max={30}
                style={inputStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
            <div>
              <label htmlFor="job-location" style={labelStyle}>Location</label>
              <input
                id="job-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Greensboro, NC"
                style={inputStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
          </div>

          {/* Skills needed (free text — replaces the old checkboxes) */}
          <div>
            <label htmlFor="job-skills" style={labelStyle}>Skills needed (optional)</label>
            <textarea
              id="job-skills"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              rows={3}
              placeholder="e.g. Wok cooking, food prep, works well under pressure"
              style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5" }}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          {/* Contact information */}
          <div>
            <h2 style={sectionTitleStyle}>Contact Information</h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 14px" }}>
              How can workers reach you? Fill in at least one.{" "}
              <span style={{ color: "#DC2626" }}>*</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {CONTACT_FIELDS.map((f) => (
                <div key={f.key}>
                  <label htmlFor={`job-${f.key}`} style={labelStyle}>{f.label}</label>
                  <input
                    id={`job-${f.key}`}
                    type="text"
                    value={contacts[f.key]}
                    onChange={(e) =>
                      setContacts((prev) => ({ ...prev, [f.key]: e.target.value }))
                    }
                    placeholder={f.placeholder}
                    style={inputStyle}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional information */}
          <div>
            <label htmlFor="job-info" style={labelStyle}>Additional Information (optional)</label>
            <textarea
              id="job-info"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
              placeholder="Anything else workers should know — schedule details, meals, parking, how to prepare…"
              style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5" }}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.01 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              style={{
                flex: 1,
                padding: "12px",
                background: loading ? "#E5E7EB" : "#C9A84C",
                color: "#0A0F1E",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading
                  ? "none"
                  : "0 2px 8px rgba(201,168,76,0.3)",
              }}
            >
              {loading ? "Posting…" : "Post Job"}
            </motion.button>
            <button
              type="button"
              onClick={() => navigate("/employer/dashboard")}
              style={{
                padding: "12px 20px",
                background: "transparent",
                color: "#6B7280",
                border: "1.5px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
