import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Pages — lazy loaded for performance
const LandingPage       = lazy(() => import('./pages/LandingPage'));
const LoginPage         = lazy(() => import('./pages/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/RegisterPage'));
const DashboardPage     = lazy(() => import('./pages/DashboardPage'));
const ProfilePage       = lazy(() => import('./pages/ProfilePage'));
const SchemesPage       = lazy(() => import('./pages/SchemesPage'));
const SchemeDetailPage  = lazy(() => import('./pages/SchemeDetailPage'));
const OCRUploadPage     = lazy(() => import('./pages/OCRUploadPage'));
const AboutPage         = lazy(() => import('./pages/AboutPage'));
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'));

const App = () => (
  <Suspense fallback={<LoadingSpinner fullScreen label="Loading Eligify..." />}>
    <Routes>
      {/* Public routes */}
      <Route path="/"           element={<LandingPage />} />
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/register"   element={<RegisterPage />} />
      <Route path="/about"      element={<AboutPage />} />

      {/* App routes */}
      <Route path="/dashboard"  element={<DashboardPage />} />
      <Route path="/profile"    element={<ProfilePage />} />
      <Route path="/schemes"    element={<SchemesPage />} />
      <Route path="/scheme/:id" element={<SchemeDetailPage />} />
      <Route path="/ocr"        element={<OCRUploadPage />} />

      {/* Legacy / alternative paths matching previous nav links */}
      <Route path="/schemes" element={<SchemesPage />} />
      <Route path="/ocr"      element={<OCRUploadPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default App;
