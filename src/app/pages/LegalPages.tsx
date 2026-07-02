import type { ReactNode } from "react";
import { Link } from "react-router";

const NAVY = "#0A0F1E";
const GOLD = "#D4A853";

function LegalLayout({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ background: "rgba(255,255,255,0.95)", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>
              <span style={{ color: NAVY }}>EN</span><span style={{ color: GOLD }}>TR</span>
            </span>
          </Link>
          <Link to="/" style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", textDecoration: "none" }}>← Back to ENTR</Link>
        </div>
      </nav>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{label}</p>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: NAVY, margin: "0 0 28px" }}>{title}</h1>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "32px 36px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", fontSize: 15, lineHeight: 1.75, color: "#374151" }}>
          {children}
        </div>
      </main>
    </div>
  );
}

const H = ({ children }: { children: ReactNode }) => (
  <h2 style={{ fontSize: 17, fontWeight: 700, color: NAVY, margin: "28px 0 10px" }}>{children}</h2>
);

export function PrivacyPolicyPage() {
  return (
    <LegalLayout label="Legal" title="Privacy Policy">
      <p style={{ margin: 0 }}>Last updated: July 2026</p>
      <H>What we collect</H>
      <p>
        When you use ENTR we collect the information you give us: your name, email,
        phone number, language preference, and — for workers — your work profile,
        applications, and optional date of birth and state. Employers may add a
        restaurant name and business details.
      </p>
      <H>Identity verification and biometric data</H>
      <p>
        Workers can verify their identity by uploading a photo of a government ID and a
        selfie. We use these images once, to read your name and date of birth and to
        check that the two photos show the same person. <strong>The photos are deleted
        from our servers immediately after this check finishes.</strong> We keep only
        the result: your name, date of birth, and a match score. See our{" "}
        <Link to="/biometric-consent" style={{ color: GOLD }}>Biometric Consent Notice</Link> for details.
      </p>
      <H>How we use your information</H>
      <p>
        To run the platform: showing your application to employers you apply to,
        scoring applications, scheduling interviews, sending you emails about your
        account, and translating job posts when you ask. We use AI services
        (Anthropic Claude) to process text you submit for these features.
      </p>
      <H>What we never do</H>
      <p>
        We never sell your information. We never share worker documents with employers —
        employers only see the verification result. We don't use advertising trackers.
      </p>
      <H>Your rights</H>
      <p>
        You can export all of your data as a JSON file from Settings, and you can delete
        your account (and all associated data) at any time from Settings. Deletion is
        immediate and permanent.
      </p>
      <H>Cookies</H>
      <p>We use one cookie: a session cookie that keeps you signed in. It expires after 7 days.</p>
      <H>Contact</H>
      <p style={{ marginBottom: 0 }}>Questions? Email us at li1013chris@gmail.com.</p>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout label="Legal" title="Terms of Service">
      <p style={{ margin: 0 }}>Last updated: July 2026</p>
      <H>What ENTR is</H>
      <p>
        ENTR is a hiring platform that connects restaurant workers with restaurant
        owners. <strong>ENTR is not an employer, staffing agency, or recruiter.</strong>{" "}
        All employment decisions — interviews, hiring, pay, schedules, and termination —
        are made solely by the restaurant owner.
      </p>
      <H>Your account</H>
      <p>
        You must give accurate information when you sign up. You are responsible for
        keeping your password private. One person, one account.
      </p>
      <H>Acceptable use</H>
      <p>
        Post only real jobs with honest pay and hours. Don't upload documents that are
        not yours. Don't use ENTR to harass anyone or break the law. We may suspend
        accounts that do.
      </p>
      <H>Job listings and applications</H>
      <p>
        Employers are responsible for the accuracy of their listings and for complying
        with employment laws, including age restrictions and wage laws. Workers are
        responsible for the accuracy of their profiles and applications. AI match scores
        are informational only and are never the sole basis of any decision ENTR makes.
      </p>
      <H>No guarantees</H>
      <p>
        ENTR is provided as-is. We do not guarantee that you will find a job or fill a
        position.
      </p>
      <H>Ending your account</H>
      <p style={{ marginBottom: 0 }}>
        You can delete your account at any time in Settings. See our{" "}
        <Link to="/privacy" style={{ color: GOLD }}>Privacy Policy</Link> for how data
        deletion works.
      </p>
    </LegalLayout>
  );
}

export function BiometricConsentPage() {
  return (
    <LegalLayout label="Legal" title="Biometric Consent Notice">
      <p style={{ margin: 0 }}>
        This notice explains how ENTR handles biometric information during identity
        verification, including for residents of Illinois (BIPA), Texas, and Washington.
      </p>
      <H>What we collect and why</H>
      <p>
        If you choose to verify your identity, you upload a photo of your government ID
        and a selfie. Software compares the face on your ID with your selfie to confirm
        they are the same person, and reads your name and date of birth from the ID.
      </p>
      <H>Storage and deletion</H>
      <p>
        Your photos are processed once and <strong>permanently deleted from our servers
        immediately after the check completes</strong> — usually within seconds. We do
        not keep facial geometry, templates, or the images themselves. We keep only the
        text result (name, date of birth, match score).
      </p>
      <H>No selling or sharing</H>
      <p>
        We never sell, lease, trade, or profit from biometric information. Employers
        never see your documents — only whether verification passed.
      </p>
      <H>Your consent</H>
      <p style={{ marginBottom: 0 }}>
        Verification is optional. Before any upload, you will be asked to confirm you
        have read this notice and agree. You may delete your account at any time, which
        removes all stored verification results.
      </p>
    </LegalLayout>
  );
}

export function DoNotSellPage() {
  return (
    <LegalLayout label="Your privacy" title="Do Not Sell My Information">
      <p style={{ margin: 0 }}>
        <strong>ENTR does not sell your personal information. Ever.</strong>
      </p>
      <p>
        Under the California Consumer Privacy Act (CCPA), you have the right to opt out
        of the sale of your personal information. ENTR has nothing for you to opt out
        of: we do not sell, rent, or trade personal information — names, contact
        details, work profiles, applications, or verification results — to anyone, and
        we never have.
      </p>
      <p>
        We share data only when you ask us to (for example, showing your application to
        the employer you applied to) or with the service providers that run the
        platform (hosting and AI processing), who may not use it for anything else.
      </p>
      <p style={{ marginBottom: 0 }}>
        California residents can also request access to or deletion of their data at any
        time — both are built into the app under Settings ("Export my data" and
        "Delete account"), or email li1013chris@gmail.com.
      </p>
    </LegalLayout>
  );
}
