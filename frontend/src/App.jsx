import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import RegisterSelect from "./pages/RegisterSelect.jsx";
import RegisterClient from "./pages/RegisterClient.jsx";
import RegisterWorker from "./pages/RegisterWorker.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import CareersPage from "./pages/CareersPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import HelpCenterPage from "./pages/HelpCenterPage.jsx";
import TrustSafetyPage from "./pages/TrustSafetyPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import TermsOfServicePage from "./pages/TermsOfServicePage.jsx";
import CancellationPolicyPage from "./pages/CancellationPolicyPage.jsx";
import WorkerDashboard from "./pages/worker/Dashboard.jsx";
import WorkerJobs from "./pages/worker/Jobs.jsx";
import WorkerProfile from "./pages/worker/Profile.jsx";
import SavedClients from "./pages/worker/SavedClients.jsx";
import ClientProfileView from "./pages/worker/ClientProfileView.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Import Sub-Apps
import ClientApp from "./apps/client/App.jsx";
import AdminApp from "./apps/admin/App.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterSelect />} />
        <Route path="/register/client" element={<RegisterClient />} />
        <Route path="/register/worker" element={<RegisterWorker />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/trust-safety" element={<TrustSafetyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />

        {/* Client App Route */}
        <Route path="/client/*" element={<ClientApp />} />

        {/* Admin App Route */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Worker routes */}
        <Route element={<ProtectedRoute roles={["worker"]} />}>
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/jobs" element={<WorkerJobs />} />
          <Route path="/worker/profile" element={<WorkerProfile />} />
          <Route path="/worker/saved-clients" element={<SavedClients />} />
          <Route path="/worker/client/:clientId" element={<ClientProfileView />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
