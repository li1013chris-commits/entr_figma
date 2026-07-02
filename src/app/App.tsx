import { BrowserRouter, Routes, Route } from "react-router";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";

// Landing page sections
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { TechStack } from "./components/TechStack";
import { MetricsBar } from "./components/MetricsBar";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorks } from "./components/HowItWorks";
import { PricingSection } from "./components/PricingSection";
import { Footer } from "./components/Footer";
import { Buddy } from "./components/Buddy";
import { CookieConsent } from "./components/CookieConsent";
import { PrivacyPolicyPage, TermsPage, BiometricConsentPage, DoNotSellPage } from "./pages/LegalPages";

// Auth pages
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

// Public pages
import { PublicJobPage } from "./pages/PublicJobPage";

// Settings
import { SettingsPage } from "./pages/SettingsPage";

// Pricing pages
import { PricingFeaturesPage } from "./pages/PricingFeaturesPage";

// Admin pages
import { PricingGuide } from "./pages/admin/PricingGuide";
import { TestVerificationPage } from "./pages/admin/TestVerificationPage";

// Employer pages
import { EmployerDashboardPage } from "./pages/employer/DashboardPage";
import { PostJobPage } from "./pages/employer/PostJobPage";
import { ApplicationsPage } from "./pages/employer/ApplicationsPage";
import { VerifyBusinessPage } from "./pages/employer/VerifyBusinessPage";

// Worker pages
import { WorkerDashboardPage } from "./pages/worker/DashboardPage";
import { BrowseJobsPage } from "./pages/worker/BrowseJobsPage";
import { ApplyPage } from "./pages/worker/ApplyPage";
import { VerifyPage } from "./pages/worker/VerifyPage";
import { ProfilePage } from "./pages/worker/ProfilePage";

function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body, #root {
          height: 100%;
          font-family: Inter, sans-serif;
          background: #ffffff;
          color: #0A0F1E;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::-webkit-scrollbar { width: 0; background: transparent; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-mockup { display: none !important; }
          .metrics-grid { grid-template-columns: 1fr !important; }
          .metrics-cell {
            border-right: none !important;
            border-bottom: 1px solid #E5E7EB !important;
          }
          .metrics-cell:last-child { border-bottom: none !important; }
          .nav-center { display: none !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 640px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 800px) {
          .feature-row-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />
      <HeroSection />
      <TechStack />
      <MetricsBar />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
      <AuthProvider>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Pricing pages */}
          <Route path="/pricing/features" element={<PricingFeaturesPage />} />

          {/* Admin pages (internal use only) */}
          <Route path="/admin/pricing-guide" element={<PricingGuide />} />
          <Route path="/admin/test-verification" element={<TestVerificationPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Public job listing */}
          <Route path="/jobs/:jobId" element={<PublicJobPage />} />

          {/* Legal pages */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/biometric-consent" element={<BiometricConsentPage />} />
          <Route path="/do-not-sell" element={<DoNotSellPage />} />

          {/* Employer routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute role="employer">
                <AppLayout>
                  <EmployerDashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute role="employer">
                <AppLayout>
                  <PostJobPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/jobs/:jobId/applications"
            element={
              <ProtectedRoute role="employer">
                <AppLayout>
                  <ApplicationsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/verify-business"
            element={
              <ProtectedRoute role="employer">
                <AppLayout>
                  <VerifyBusinessPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Employer settings */}
          <Route
            path="/employer/settings"
            element={
              <ProtectedRoute role="employer">
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Worker routes */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute role="worker">
                <AppLayout>
                  <WorkerDashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/jobs"
            element={
              <ProtectedRoute role="worker">
                <AppLayout>
                  <BrowseJobsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/jobs/:jobId/apply"
            element={
              <ProtectedRoute role="worker">
                <AppLayout>
                  <ApplyPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/verify"
            element={
              <ProtectedRoute role="worker">
                <AppLayout>
                  <VerifyPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/profile"
            element={
              <ProtectedRoute role="worker">
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/settings"
            element={
              <ProtectedRoute role="worker">
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Buddy chatbot — floats on every page */}
        <Buddy />

        {/* Cookie consent banner (first visit only) */}
        <CookieConsent />
      </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
