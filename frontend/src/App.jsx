import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';

// Lazy loading pages for code splitting (Production Level)
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const HowItWorks = React.lazy(() => import('./pages/HowItWorks'));
const Impact = React.lazy(() => import('./pages/Impact'));
const Contact = React.lazy(() => import('./pages/Contact'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const CommunityGuidelines = React.lazy(() => import('./pages/CommunityGuidelines'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const DonorDashboard = React.lazy(() => import('./pages/DonorDashboard'));
const NgoDashboard = React.lazy(() => import('./pages/NgoDashboard'));
const VolunteerDashboard = React.lazy(() => import('./pages/VolunteerDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const MapPage = React.lazy(() => import('./pages/MapPage'));
const RequestsPage = React.lazy(() => import('./pages/RequestsPage'));

// Global Loading Fallback Indicator
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-900">
    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const routes = { donor: '/donor', ngo: '/ngo', volunteer: '/volunteer', admin: '/admin' };
  return <Navigate to={routes[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/guidelines" element={<CommunityGuidelines />} />
        </Route>

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/donor" element={<ProtectedRoute roles={['donor']}><DonorDashboard /></ProtectedRoute>} />
          <Route path="/ngo" element={<ProtectedRoute roles={['ngo']}><NgoDashboard /></ProtectedRoute>} />
          <Route path="/volunteer" element={<ProtectedRoute roles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Route>

        <Route path="*" element={<DashboardRedirect />} />
      </Routes>
    </Suspense>
  );
}
