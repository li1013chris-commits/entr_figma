import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";
import { workerApi } from "../../api/client";
import { BackArrow } from "../../components/BackArrow";

const SKILLS = [
  "grill",
  "fryer",
  "prep_cook",
  "dishwasher",
  "server",
  "cashier",
  "food_safety_certified",
  "alcohol_service_certified",
];

const SKILL_LABELS: Record<string, Record<string, string>> = {
  grill: { en: "Grill cooking", es: "Cocina a la parrilla", zh: "烤架烹饪", fr: "Cuisson au grill", pt: "Cozimento em grelha", vi: "Nướng trên vỉ" },
  fryer: { en: "Deep fryer", es: "Freidora", zh: "油炸锅", fr: "Friteuse", pt: "Fritadeira", vi: "Chiên sâu" },
  prep_cook: { en: "Food prep", es: "Preparación de alimentos", zh: "食物准备", fr: "Préparation des aliments", pt: "Preparação de comida", vi: "Chuẩn bị thực phẩm" },
  dishwasher: { en: "Dishwashing", es: "Lavado de platos", zh: "洗碗", fr: "Vaisselle", pt: "Lavagem de louça", vi: "Rửa bát" },
  server: { en: "Serving customers", es: "Servir a clientes", zh: "服务顾客", fr: "Service à la clientèle", pt: "Servir clientes", vi: "Phục vụ khách" },
  cashier: { en: "Cash register", es: "Caja registradora", zh: "收银机", fr: "Caisse", pt: "Caixa registradora", vi: "Máy tính tiền" },
  food_safety_certified: { en: "Food safety certified", es: "Certificado de seguridad alimentaria", zh: "食品安全认证", fr: "Hygiène alimentaire certifiée", pt: "Certificado de segurança alimentar", vi: "Chứng chỉ an toàn thực phẩm" },
  alcohol_service_certified: { en: "Alcohol service certified", es: "Certificado de servicio de alcohol", zh: "酒精服务认证", fr: "Service d'alcool certifié", pt: "Certificado de serviço de álcool", vi: "Chứng chỉ phục vụ rượu" },
};

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, currentLang } = useLang();

  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    languages_spoken: user?.languages_spoken || "",
    experience_years: user?.experience_years || 0,
    skills: user?.skills ? user.skills.split(",") : [],
    availability: user?.availability || "flexible",
    bio: user?.bio || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        phone: formData.phone,
        languages_spoken: formData.languages_spoken,
        experience_years: Number(formData.experience_years),
        skills: formData.skills.join(","),
        availability: formData.availability,
        bio: formData.bio,
      };

      await workerApi.completeProfile(payload);
      navigate("/worker/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getLabel = (key: string): string => {
    const label = SKILL_LABELS[key];
    if (!label) return key;
    return label[currentLang] || label.en;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "40px 24px",
        fontFamily: "Inter, sans-serif",
        color: "#0A0F1E",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <BackArrow />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              margin: "0 0 8px",
              color: "#0A0F1E",
            }}
          >
            {currentLang === "es"
              ? "Tu perfil"
              : currentLang === "zh"
                ? "你的资料"
                : "Your profile"}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#6B7280",
              margin: "0 0 32px",
              lineHeight: 1.6,
            }}
          >
            {currentLang === "es"
              ? "Cuéntanos sobre ti para que los restaurantes encuentren el match perfecto."
              : currentLang === "zh"
                ? "告诉我们关于你的信息，这样餐厅可以找到完美的匹配。"
                : "Tell us about yourself so restaurants can find the perfect match."}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: "#FEE2E2",
                color: "#991B1B",
                padding: 16,
                borderRadius: 8,
                marginBottom: 24,
                fontSize: 14,
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Phone */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#0A0F1E",
                marginBottom: 8,
              }}
            >
              {currentLang === "es"
                ? "Teléfono"
                : currentLang === "zh"
                  ? "电话"
                  : "Phone number"}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder={
                currentLang === "es"
                  ? "555-1234"
                  : currentLang === "zh"
                    ? "555-1234"
                    : "555-1234"
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                border: "1px solid #E5E7EB",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          {/* Languages */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#0A0F1E",
                marginBottom: 8,
              }}
            >
              {currentLang === "es"
                ? "Idiomas que hablas"
                : currentLang === "zh"
                  ? "你说的语言"
                  : "Languages you speak"}
            </label>
            <input
              type="text"
              value={formData.languages_spoken}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  languages_spoken: e.target.value,
                }))
              }
              placeholder={
                currentLang === "es"
                  ? "Ej: Español, Inglés, Cantonés"
                  : currentLang === "zh"
                    ? "例: 英语，西班牙语"
                    : "E.g. English, Spanish, Cantonese"
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                border: "1px solid #E5E7EB",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          {/* Experience */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#0A0F1E",
                marginBottom: 8,
              }}
            >
              {currentLang === "es"
                ? "Años de experiencia en restaurantes"
                : currentLang === "zh"
                  ? "餐厅工作年数"
                  : "Years of restaurant experience"}
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={formData.experience_years}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  experience_years: Number(e.target.value),
                }))
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                border: "1px solid #E5E7EB",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          {/* Skills */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#0A0F1E",
                marginBottom: 12,
              }}
            >
              {currentLang === "es"
                ? "Tus habilidades"
                : currentLang === "zh"
                  ? "你的技能"
                  : "Your skills"}
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
                    background: formData.skills.includes(skill)
                      ? "#FEF3C7"
                      : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    style={{
                      width: 18,
                      height: 18,
                      cursor: "pointer",
                      accentColor: "#C9A84C",
                    }}
                  />
                  <span style={{ fontSize: 13 }}>{getLabel(skill)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#0A0F1E",
                marginBottom: 8,
              }}
            >
              {currentLang === "es"
                ? "¿Cuándo puedes trabajar?"
                : currentLang === "zh"
                  ? "你什么时候可以工作?"
                  : "When can you work?"}
            </label>
            <select
              value={formData.availability}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availability: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                border: "1px solid #E5E7EB",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
                color: "#0A0F1E",
              }}
            >
              <option value="full_time">
                {currentLang === "es"
                  ? "Tiempo completo"
                  : currentLang === "zh"
                    ? "全职"
                    : "Full time"}
              </option>
              <option value="part_time">
                {currentLang === "es"
                  ? "Tiempo parcial"
                  : currentLang === "zh"
                    ? "兼职"
                    : "Part time"}
              </option>
              <option value="weekends_only">
                {currentLang === "es"
                  ? "Solo fines de semana"
                  : currentLang === "zh"
                    ? "仅周末"
                    : "Weekends only"}
              </option>
              <option value="flexible">
                {currentLang === "es"
                  ? "Flexible"
                  : currentLang === "zh"
                    ? "灵活"
                    : "Flexible"}
              </option>
            </select>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 32 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#0A0F1E",
                marginBottom: 8,
              }}
            >
              {currentLang === "es"
                ? "Cuéntanos sobre ti (200 caracteres máx)"
                : currentLang === "zh"
                  ? "自我介绍（最多200个字符）"
                  : "About you (max 200 characters)"}
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setFormData((prev) => ({ ...prev, bio: e.target.value }));
                }
              }}
              placeholder={
                currentLang === "es"
                  ? "Soy un cocinero entusiasta con 5 años de experiencia..."
                  : currentLang === "zh"
                    ? "我是一个热情的厨师，有5年的经验..."
                    : "I am an enthusiastic cook with 5 years of experience..."
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                border: "1px solid #E5E7EB",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
                minHeight: 100,
                resize: "none",
              }}
            />
            <p
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                margin: "8px 0 0",
              }}
            >
              {formData.bio.length}/200
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "#0A0F1E",
              background: "#C9A84C",
              border: "none",
              borderRadius: 8,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {loading
              ? currentLang === "es"
                ? "Guardando..."
                : currentLang === "zh"
                  ? "保存中..."
                  : "Saving..."
              : currentLang === "es"
                ? "Guardar perfil"
                : currentLang === "zh"
                  ? "保存资料"
                  : "Save profile"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
