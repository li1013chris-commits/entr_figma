import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLang } from "../context/LanguageContext";

// UI Mockups for paid features
const FeatureMockups: Record<string, () => JSX.Element> = {
  "Fit scores": () => (
    <div
      style={{
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: 10 }}>
        Applicants Sorted by Fit Score
      </div>
      {[
        { name: "Maria Garcia", score: 92, color: "#16A34A" },
        { name: "Carlos Rodriguez", score: 78, color: "#D97706" },
        { name: "Anh Tran", score: 64, color: "#D97706" },
      ].map((app) => (
        <div key={app.name} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #E5E7EB", marginBottom: 8 }}>
          <span style={{ color: "#0A0F1E", fontWeight: 500 }}>{app.name}</span>
          <span style={{ background: app.color === "#16A34A" ? "#DCFCE7" : "#FEF3C7", color: app.color, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
            {app.score}
          </span>
        </div>
      ))}
    </div>
  ),
  "Worker verification": () => (
    <div
      style={{
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: 10 }}>
        Verification Status
      </div>
      {[
        { name: "Maria Garcia", status: "Verified", color: "#DCFCE7", textColor: "#16A34A" },
        { name: "Carlos Rodriguez", status: "Pending", color: "#FEF3C7", textColor: "#D97706" },
      ].map((worker) => (
        <div key={worker.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid #E5E7EB", marginBottom: 8 }}>
          <span style={{ color: "#0A0F1E", fontWeight: 500 }}>{worker.name}</span>
          <span style={{ background: worker.color, color: worker.textColor, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
            {worker.status}
          </span>
        </div>
      ))}
    </div>
  ),
  "Full verification reports": () => (
    <div
      style={{
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: 10 }}>
        Full Verification Details
      </div>
      <div style={{ color: "#0A0F1E", lineHeight: 1.6 }}>
        <div style={{ marginBottom: 4 }}>✓ Identity Verified</div>
        <div style={{ marginBottom: 4 }}>✓ Government ID Confirmed</div>
        <div style={{ marginBottom: 4 }}>Face Match: 96%</div>
        <div>Age: 21 (18+ confirmed)</div>
      </div>
    </div>
  ),
  "Priority support": () => (
    <div
      style={{
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: 10 }}>
        Support Response Time
      </div>
      <div style={{ color: "#0A0F1E", lineHeight: 1.8 }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: "#16A34A", fontWeight: 600 }}>You:</span> Fast response within hours
        </div>
        <div>
          <span style={{ color: "#9CA3AF", fontWeight: 500 }}>Others:</span> Response within 24 hours
        </div>
      </div>
    </div>
  ),
  "Analytics dashboard": () => (
    <div
      style={{
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: 10 }}>
        Job Application Trends
      </div>
      <div style={{ display: "flex", gap: 8, height: 60, alignItems: "flex-end", marginBottom: 8 }}>
        {[40, 65, 90, 55, 75].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: "#C9A84C",
              height: `${h}%`,
              borderRadius: 4,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#6B7280" }}>
        <div>Line Cook: 92 apps</div>
        <div>Server: 47 apps</div>
      </div>
    </div>
  ),
  "Multiple locations": () => (
    <div
      style={{
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: 10 }}>
        Location Switcher
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        {["San Francisco", "Oakland", "San Jose"].map((loc) => (
          <div
            key={loc}
            style={{
              padding: "6px 12px",
              background: loc === "San Francisco" ? "#C9A84C" : "#F3F4F6",
              color: loc === "San Francisco" ? "#0A0F1E" : "#6B7280",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {loc}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#0A0F1E" }}>View all applications across locations</div>
    </div>
  ),
  "Team access": () => (
    <div
      style={{
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", fontSize: 10 }}>
        Team Members
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {["You", "Maria", "James"].map((name) => (
          <div
            key={name}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#C9A84C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0A0F1E",
              fontWeight: 700,
              fontSize: 14,
            }}
            title={name}
          >
            {name[0]}
          </div>
        ))}
        <span style={{ color: "#6B7280", fontSize: 11 }}>Invite more team members</span>
      </div>
    </div>
  ),
};

export function PricingFeaturesPage() {
  const { t } = useLang();
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const explanations = t.featureExplanations;
  const features = Object.entries(explanations.features);

  // Filter features based on search query
  const filteredFeatures = useMemo(() => {
    if (!searchQuery.trim()) return features;
    const query = searchQuery.toLowerCase();
    return features.filter(([key, feature]) =>
      key.toLowerCase().includes(query) ||
      feature.heading.toLowerCase().includes(query) ||
      feature.description.toLowerCase().includes(query)
    );
  }, [features, searchQuery]);

  const toggleExpand = (featureKey: string) => {
    setExpandedFeature(expandedFeature === featureKey ? null : featureKey);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "60px 24px",
        fontFamily: "Inter, sans-serif",
        color: "#0A0F1E",
      }}
    >
      <div style={{ maxWidth: 650, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#0A0F1E",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            {explanations.title}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {explanations.subtitle}
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: 32 }}
        >
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              background: "#F9FAFB",
              color: "#0A0F1E",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid #C9A84C";
              e.currentTarget.style.background = "#ffffff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid #E5E7EB";
              e.currentTarget.style.background = "#F9FAFB";
            }}
          />
        </motion.div>

        {/* Features accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {filteredFeatures.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                padding: 40,
                color: "#9CA3AF",
              }}
            >
              <p style={{ margin: 0, fontSize: 14 }}>No features match your search.</p>
            </motion.div>
          ) : (
            filteredFeatures.map(([featureKey, feature], index) => (
              <motion.div
                key={featureKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Feature header - clickable */}
                <motion.button
                  onClick={() => toggleExpand(featureKey)}
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid #F3F4F6",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#F9FAFB";
                    el.style.paddingLeft = "12px";
                    el.style.paddingRight = "12px";
                    el.style.borderRadius = "6px";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent";
                    el.style.paddingLeft = "0";
                    el.style.paddingRight = "0";
                    el.style.borderRadius = "0";
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#0A0F1E",
                      margin: 0,
                      textAlign: "left",
                    }}
                  >
                    {feature.heading}
                  </h3>
                  <motion.div
                    animate={{ rotate: expandedFeature === featureKey ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </motion.div>
                </motion.button>

                {/* Feature content - expandable */}
                <AnimatePresence>
                  {expandedFeature === featureKey && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ paddingBottom: 16 }}>
                        {/* Description */}
                        <p
                          style={{
                            fontSize: 14,
                            color: "#4B5563",
                            lineHeight: 1.7,
                            margin: "0 0 12px",
                          }}
                        >
                          {feature.description}
                        </p>

                        {/* Mockup for paid features only */}
                        {feature.isPaidFeature && FeatureMockups[featureKey] && (
                          <div style={{ marginTop: 12 }}>
                            {FeatureMockups[featureKey]()}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {/* Results count */}
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              margin: "32px 0 0",
              textAlign: "center",
            }}
          >
            {filteredFeatures.length} of {features.length} features match your search
          </motion.p>
        )}

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: 48, textAlign: "center" }}
        >
          <a
            href="/#pricing"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#C9A84C",
              textDecoration: "none",
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid #C9A84C",
              display: "inline-block",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "#C9A84C";
              el.style.color = "#0A0F1E";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.color = "#C9A84C";
            }}
          >
            Back to Pricing
          </a>
        </motion.div>
      </div>
    </div>
  );
}
