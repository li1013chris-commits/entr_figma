import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { employerApi } from "../../api/client";
import { useLang } from "../../context/LanguageContext";

const SKILLS = ["grill", "fryer", "prep_cook", "dishwasher", "server", "cashier"];

const SKILL_LABELS: Record<string, Record<string, string>> = {
  grill: { en: "Grill cooking", es: "Cocina a la parrilla", zh: "烤架烹饪", fr: "Cuisson au grill", pt: "Cozimento em grelha", vi: "Nướng trên vỉ" },
  fryer: { en: "Deep fryer", es: "Freidora", zh: "油炸锅", fr: "Friteuse", pt: "Fritadeira", vi: "Chiên sâu" },
  prep_cook: { en: "Food prep", es: "Preparación de alimentos", zh: "食物准备", fr: "Préparation des aliments", pt: "Preparação de comida", vi: "Chuẩn bị thực phẩm" },
  dishwasher: { en: "Dishwashing", es: "Lavado de platos", zh: "洗碗", fr: "Vaisselle", pt: "Lavagem de louça", vi: "Rửa bát" },
  server: { en: "Serving customers", es: "Servir a clientes", zh: "服务顾客", fr: "Service à la clientèle", pt: "Servir clientes", vi: "Phục vụ khách" },
  cashier: { en: "Cash register", es: "Caja registradora", zh: "收银机", fr: "Caisse", pt: "Caixa registradora", vi: "Máy tính tiền" },
};

export function PostJobPage() {
  const navigate = useNavigate();
  const { t, currentLang } = useLang();
  const p = t.postJob;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [hours, setHours] = useState("");
  const [experienceRequired, setExperienceRequired] = useState(0);
  const [languagePreference, setLanguagePreference] = useState("");
  const [location, setLocation] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [requiresFoodSafety, setRequiresFoodSafety] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setRequiredSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await employerApi.createJob({
        title,
        description,
        pay,
        hours,
        experience_required: experienceRequired,
        language_preference: languagePreference,
        location,
        required_skills: requiredSkills.join(","),
        requires_food_safety: requiresFoodSafety,
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
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#0A0F1E",
    marginBottom: 6,
  };
  const focus = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => (e.target.style.borderColor = "#C9A84C");
  const blur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => (e.target.style.borderColor = "#E5E7EB");

  const getSkillLabel = (skill: string): string => {
    const label = SKILL_LABELS[skill];
    if (!label) return skill;
    return label[currentLang] || label.en;
  };

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
          {p.label}
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>
          {p.title}
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "6px 0 0" }}>
          {p.subtitle}
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
          <div>
            <label style={labelStyle}>
              {p.titleField} <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder={p.titlePlaceholder}
              style={inputStyle}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          <div>
            <label style={labelStyle}>{p.description}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder={p.descPlaceholder}
              style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5" }}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>
                {p.pay} <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                required
                placeholder={p.payPlaceholder}
                style={inputStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
            <div>
              <label style={labelStyle}>
                {p.hours} <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
                placeholder={p.hoursPlaceholder}
                style={inputStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>{p.experience}</label>
              <input
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
              <label style={labelStyle}>{p.langPref}</label>
              <select
                value={languagePreference}
                onChange={(e) => setLanguagePreference(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: "16px",
                  paddingRight: 36,
                }}
                onFocus={focus}
                onBlur={blur}
              >
                <option value="">{p.langAny}</option>
                <option value="en">English</option>
                <option value="zh">中文 (普通话)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="pt">Português</option>
                <option value="vi">Tiếng Việt</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>{p.location}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={p.locationPlaceholder}
              style={inputStyle}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          {/* Required Skills */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                color: "#0A0F1E",
                marginBottom: 12,
              }}
            >
              {currentLang === "es"
                ? "Habilidades requeridas"
                : currentLang === "zh"
                  ? "所需技能"
                  : "Skills you need"}
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {SKILLS.map((skill) => (
                <label
                  key={skill}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    padding: 8,
                    borderRadius: 6,
                    background: requiredSkills.includes(skill)
                      ? "#FEF3C7"
                      : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={requiredSkills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    style={{
                      width: 18,
                      height: 18,
                      cursor: "pointer",
                      accentColor: "#C9A84C",
                    }}
                  />
                  <span style={{ fontSize: 13 }}>{getSkillLabel(skill)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Food Safety Certification */}
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                padding: 8,
                borderRadius: 6,
              }}
            >
              <input
                type="checkbox"
                checked={requiresFoodSafety}
                onChange={(e) => setRequiresFoodSafety(e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  cursor: "pointer",
                  accentColor: "#C9A84C",
                }}
              />
              <span style={{ fontSize: 13 }}>
                {currentLang === "es"
                  ? "Se requiere certificado de seguridad alimentaria"
                  : currentLang === "zh"
                    ? "需要食品安全认证"
                    : "Food safety certified required"}
              </span>
            </label>
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
              {loading ? p.submitting : p.submit}
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
              {p.cancel}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
