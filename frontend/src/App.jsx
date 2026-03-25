// import { Routes, Route, Navigate, Link } from 'react-router-dom'
// import HomePage from './pages/HomePage'
// import CategoriesPage from './pages/CategoriesPage'
// import HowItWorksPage from './pages/HowItWorksPage'
// import AboutPage from './pages/AboutPage'
// import RegisterChoicePage from './pages/auth/RegisterChoicePage'
// import ClientRegisterPage from './pages/auth/ClientRegisterPage'
// import WorkerRegisterPage from './pages/auth/WorkerRegisterPage'
// import VerifyEmailPage from './pages/auth/VerifyEmailPage'
// import ChangePasswordPage from './pages/auth/ChangePasswordPage'
// import LoginPage from './pages/auth/LoginPage'
// import RegisterPage from './pages/auth/RegisterPage'
// import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
// import ResetPasswordPage from './pages/auth/ResetPasswordPage'
// import WorkerDashboard from './pages/worker/Dashboard'
// import WorkerJobs from './pages/worker/Jobs'
// import WorkerProfile from './pages/worker/Profile'
// import SavedClients from './pages/worker/SavedClients'
// import { AuthProvider, useAuth } from './hooks/useAuth'

// const Protected = ({ children, roles }) => {
//   const { user } = useAuth()
//   if (!user) return <Navigate to="/login" replace />
//   if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
//   return children
// }

// const Nav = () => {
//   const { user, logout } = useAuth()
//   return (
//     <header style={{ background: '#fff', padding: '12px 24px', borderBottom: '1px solid #e5e8ef' }}>
//       <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
//         <Link to="/">Quick Staff</Link>
//         <Link to="/worker/dashboard">Worker</Link>
//         {user ? (
//           <>
//             <span style={{ marginLeft: 'auto' }}>{user.name}</span>
//             <button className="btn secondary" onClick={logout}>Logout</button>
//           </>
//         ) : (
//           <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
//             <Link to="/login" className="btn secondary">Login</Link>
//             <Link to="/register" className="btn">Register</Link>
//           </div>
//         )}
//       </nav>
//     </header>
//   )
// }

// export default function App () {
//   return (
//     <AuthProvider>
//       <Nav />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/register/options" element={<RegisterChoicePage />} />
//         <Route path="/register/client" element={<ClientRegisterPage />} />
//         <Route path="/register/worker" element={<WorkerRegisterPage />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         <Route path="/reset-password" element={<ResetPasswordPage />} />
//         <Route path="/verify-email" element={<VerifyEmailPage />} />
//         <Route path="/change-password" element={<ChangePasswordPage />} />
//         <Route path="/categories" element={<CategoriesPage />} />
//         <Route path="/how-it-works" element={<HowItWorksPage />} />
//         <Route path="/about" element={<AboutPage />} />

//         <Route
//           path="/worker/dashboard"
//           element={
//             <Protected roles={['worker']}>
//               <WorkerDashboard />
//             </Protected>
//           }
//         />
//         <Route
//           path="/worker/jobs/:tab"
//           element={
//             <Protected roles={['worker']}>
//               <WorkerJobs />
//             </Protected>
//           }
//         />
//         <Route
//           path="/worker/profile"
//           element={
//             <Protected roles={['worker']}>
//               <WorkerProfile />
//             </Protected>
//           }
//         />
//         <Route
//           path="/worker/saved-clients"
//           element={
//             <Protected roles={['worker']}>
//               <SavedClients />
//             </Protected>
//           }
//         />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </AuthProvider>
//   )
// }
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import Login from "./pages/Login.jsx";
// import RegisterSelect from "./pages/RegisterSelect.jsx";
// import RegisterClient from "./pages/RegisterClient.jsx";
// import RegisterWorker from "./pages/RegisterWorker.jsx";
// import WorkerDashboard from "./pages/WorkerDashboard.jsx";
// import WorkerProfile from "./pages/WorkerProfile.jsx";
// import WorkerJobs from "./pages/WorkerJobs.jsx";
// import SavedClients from "./pages/SavedClients.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import { AuthProvider } from "./context/AuthContext.jsx";

// const App = () => {
//   return (
//     <AuthProvider>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<RegisterSelect />} />
//         <Route path="/register/client" element={<RegisterClient />} />
//         <Route path="/register/worker" element={<RegisterWorker />} />

//         <Route element={<ProtectedRoute roles={["worker"]} />}>
//           <Route path="/worker/dashboard" element={<WorkerDashboard />} />
//           <Route path="/worker/profile" element={<WorkerProfile />} />
//           <Route path="/worker/jobs" element={<WorkerJobs />} />
//           <Route path="/worker/saved-clients" element={<SavedClients />} />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </AuthProvider>
//   );
// };

// export default App;


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
