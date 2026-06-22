import { motion } from "motion/react";

const tiers = [
  {
    name: "Free",
    price: "$0/month",
    pitch: "Great for testing the platform with basic hiring needs.",
    talkingPoints: [
      "No credit card required to get started",
      "Perfect for small restaurants testing multilingual hiring",
      "Basic applicant list shows all applications in one place",
      "All 6 languages included from day one",
      "No per-posting fees ever",
      "Upgrade anytime as you grow",
    ],
  },
  {
    name: "Starter",
    price: "$19/month",
    pitch: "For growing restaurants that need to see the best candidates first.",
    talkingPoints: [
      "AI screening saves 5-10 hours per week reading applications",
      "See fit scores instantly, no manual review needed",
      "Starter verification shows if worker submitted ID",
      "3 active listings perfect for seasonal hiring cycles",
      "Most restaurants here for their first 6-12 months",
      "Upgrade to Pro when you need full verification details",
    ],
  },
  {
    name: "Pro",
    price: "$39/month",
    pitch: "For serious restaurant operators who need complete hiring confidence.",
    talkingPoints: [
      "Face match 95%+ means you know exactly who will show up",
      "See full verification reports with government ID confirmation",
      "Age verified prevents hiring mistakes with minors",
      "Unlimited job postings for all your positions",
      "Priority support means faster answers when you need help",
      "Most popular plan for established restaurant chains",
    ],
  },
  {
    name: "Business",
    price: "$79/month",
    pitch: "For multi-location owners and large teams who need control and visibility.",
    talkingPoints: [
      "Manage all locations from one dashboard, see applications everywhere",
      "Add your managers and HR staff as team members",
      "Real analytics show which positions get the most interest",
      "Track hiring trends across all your restaurants",
      "See which jobs convert best, adjust pay or description accordingly",
      "Complete audit trail of who did what for compliance",
    ],
  },
];

const EmployerDashboardMockup = ({ tier }: { tier: string }) => {
  const showAIScores = tier !== "Free";
  const showFullVerification = tier === "Pro" || tier === "Business";
  const showLocations = tier === "Business";
  const showAnalytics = tier === "Business";

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#F7F7F5",
          padding: "12px 16px",
          borderBottom: "1px solid #E5E7EB",
          display: "flex",
          gap: 8,
          alignItems: "center",
          fontSize: 11,
          color: "#9CA3AF",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#FCD34D",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#10B981",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#EF4444",
          }}
        />
        <span style={{ marginLeft: 12 }}>employer.entr.app/dashboard</span>
      </div>

      {/* Dashboard content */}
      <div style={{ padding: 24, fontFamily: "Inter, sans-serif" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          {showLocations && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#6B7280",
                marginBottom: 12,
                padding: "8px 12px",
                background: "#F3F4F6",
                borderRadius: 6,
                border: "1px solid #E5E7EB",
              }}
            >
              Location: San Francisco, CA
            </div>
          )}
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#C9A84C",
              margin: "0 0 6px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Dashboard
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>
            Your Restaurants {showLocations && "(3 locations)"}
          </h2>
        </div>

        {/* Stats - hidden on Free tier */}
        {tier !== "Free" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {[
              { label: "Active Jobs", value: "5" },
              { label: "Applications", value: "47" },
              { label: "Verified Workers", value: "12" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "#F7F7F5",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0, fontWeight: 500 }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", margin: "4px 0 0" }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Team members - Business only */}
        {showLocations && (
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#0A0F1E",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 8px",
              }}
            >
              Team Members
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["You", "Maria", "James"].map((name) => (
                <div
                  key={name}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#C9A84C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0A0F1E",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  title={name}
                >
                  {name[0]}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications list */}
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 16 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#0A0F1E",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 12px",
            }}
          >
            Recent Applications
          </p>

          {/* Application cards */}
          {[
            { name: "Maria Garcia", job: "Line Cook", ai: 92, verified: "verified" },
            { name: "Carlos Rodriguez", job: "Prep Cook", ai: 78, verified: "pending" },
            { name: "Anh Tran", job: "Server", ai: 65, verified: "verified" },
          ].map((app, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingBottom: 12,
                borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
                marginBottom: 12,
              }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1E", margin: 0 }}>
                  {app.name}
                </p>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>
                  {app.job}
                </p>
              </div>

              {/* AI Score */}
              {showAIScores && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      background: "#FFFBF0",
                      border: "1px solid #FED7AA",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#C9A84C",
                    }}
                  >
                    {app.ai} match
                  </div>

                  {/* Full Verification Report - Pro/Business */}
                  {showFullVerification && (
                    <div style={{ fontSize: 10, color: "#6B7280", textAlign: "right" }}>
                      <div>✓ ID verified</div>
                      <div>Face: 96%</div>
                      <div>Age: 21</div>
                    </div>
                  )}

                  {/* Basic Verification - Starter */}
                  {tier === "Starter" && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "#16A34A",
                        background: "#F0FDF4",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      ✓ Verified
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Analytics charts - Business only */}
        {showAnalytics && (
          <div style={{ marginTop: 24, borderTop: "1px solid #E5E7EB", paddingTop: 16 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#0A0F1E",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 12px",
              }}
            >
              Hiring Trends
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#F7F7F5",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: 12,
                  height: 60,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-around",
                }}
              >
                {[40, 60, 80, 50].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: `${h}%`,
                      background: "#C9A84C",
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  background: "#F7F7F5",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 11,
                  color: "#6B7280",
                }}
              >
                <div>Line Cook: 92 apps</div>
                <div>Server: 47 apps</div>
                <div>Dishwasher: 12 apps</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function PricingGuide() {
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
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .pricing-guide-page { page-break-after: always; }
          .pricing-tier { page-break-inside: avoid; }
        }
      `}</style>

      <div className="pricing-guide-page" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 48, borderBottom: "2px solid #0A0F1E", paddingBottom: 24 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, margin: "0 0 8px" }}>ENTR Pricing Guide</h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Internal Sales Reference | Print-Friendly</p>
        </div>

        {/* Tier sections */}
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            className="pricing-tier"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              marginBottom: 48,
              paddingBottom: 48,
              borderBottom: index < tiers.length - 1 ? "1px solid #E5E7EB" : "none",
            }}
          >
            {/* Tier header */}
            <div
              style={{
                background: "#0A0F1E",
                color: "#ffffff",
                padding: "24px 28px",
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                <h2 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>{tier.name}</h2>
                <span style={{ fontSize: 20, fontWeight: 700 }}>{tier.price}</span>
              </div>
              <p style={{ fontSize: 14, margin: 0, opacity: 0.95 }}>{tier.pitch}</p>
            </div>

            {/* Two column layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
                marginBottom: 24,
              }}
            >
              {/* Left: Mockup */}
              <div>
                <EmployerDashboardMockup tier={tier.name} />
              </div>

              {/* Right: Talking points */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: "0 0 16px",
                  }}
                >
                  Sales Talking Points
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {tier.talkingPoints.map((point, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: 12,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "#374151",
                      }}
                    >
                      <span
                        style={{
                          color: "#C9A84C",
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        ✓
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key differences callout */}
            <div
              style={{
                background: "#F7F7F5",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: 16,
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              <p style={{ fontWeight: 600, color: "#0A0F1E", marginBottom: 8 }}>Key UI Differences:</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {tier.name === "Free" && (
                  <li>No fit scores visible. Basic applicant list only. No verification data.</li>
                )}
                {tier.name === "Starter" && (
                  <li>Fit scores prominently displayed. Basic verification badge shows if verified.</li>
                )}
                {tier.name === "Pro" && (
                  <li>Full verification details expanded: face match %, age confirmed, ID verification status.</li>
                )}
                {tier.name === "Business" && (
                  <li>Location switcher at top. Team member avatars visible. Analytics charts and hiring trends dashboard.</li>
                )}
              </ul>
            </div>
          </motion.div>
        ))}

        {/* Footer notes */}
        <div style={{ marginTop: 40, borderTop: "1px solid #E5E7EB", paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: "#6B7280", fontStyle: "italic" }}>
            Internal use only. Print this page before demos to have key talking points and visual comparisons at hand.
            Each tier shows the actual dashboard UI the customer will see at that price level.
          </p>
        </div>
      </div>
    </div>
  );
}
