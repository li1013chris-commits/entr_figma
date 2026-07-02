import { useLang, type Lang } from "../context/LanguageContext";

const languageLinks = [
  { label: "English", code: "en" as Lang },
  { label: "Español", code: "en" as Lang },
  { label: "中文", code: "zh" as Lang },
  { label: "Français", code: "en" as Lang },
  { label: "Português", code: "en" as Lang },
  { label: "Tiếng Việt", code: "en" as Lang },
];

function FooterLink({ label, href }: { label: string; href?: string }) {
  return (
    <a
      href={href || "#"}
      target={href && href.startsWith("http") ? "_blank" : undefined}
      rel={href && href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 14,
        fontWeight: 300,
        color: "rgba(255,255,255,0.45)",
        textDecoration: "none",
        display: "block",
        transition: "color 0.15s",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
      }}
    >
      {label}
    </a>
  );
}

export function Footer() {
  const { t, setLang } = useLang();

  const columns = [
    {
      heading: t.footer.columns.product,
      links: [
        { label: t.nav.platform },
        { label: t.nav.howItWorks },
        { label: t.pricing.label },
      ],
    },
    {
      heading: t.footer.columns.support,
      links: [
        { label: "Help Center" },
        { label: "Ask AI" },
        { label: "Contact" },
      ],
    },
    {
      heading: t.footer.columns.company,
      links: [
        { label: "About" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/christopher-li-64b149251" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Biometric Consent", href: "/biometric-consent" },
        { label: "Do Not Sell My Information", href: "/do-not-sell" },
      ],
    },
  ];

  return (
    <footer style={{ background: "#0A0F1E", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 56px" }}>
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr",
            gap: 48,
            alignItems: "flex-start",
          }}
        >
          {/* Brand column */}
          <div>
            <a href="#" style={{ textDecoration: "none", display: "inline-block", marginBottom: 16 }}>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", fontFamily: "Inter, sans-serif" }}>
                <span style={{ color: "#ffffff" }}>EN</span>
                <span style={{ color: "#C9A84C" }}>TR</span>
              </span>
            </a>
            <p
              style={{
                fontSize: 13,
                fontWeight: 300,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.65,
                margin: 0,
                maxWidth: 220,
              }}
            >
              {t.footer.tagline}
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                {col.heading}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {col.links.map((link) => (
                  <FooterLink key={link.label} label={link.label} href={(link as any).href} />
                ))}
              </div>
            </div>
          ))}

          {/* Languages column */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {t.footer.columns.languages}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {languageLinks.map((l) => (
                <button
                  key={l.label}
                  onClick={() => setLang(l.code)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.45)",
                    textDecoration: "none",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textAlign: "left",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#C9A84C";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.25)" }}>
            {new Date().getFullYear()} ENTR Technologies, Inc. All rights reserved.
          </span>
          <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.25)" }}>
            Built for immigrant-owned restaurants.
          </span>
        </div>
      </div>
    </footer>
  );
}
