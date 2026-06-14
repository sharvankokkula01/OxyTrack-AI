import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SimulationProvider } from './contexts/SimulationContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import DashboardPage from './components/dashboard/DashboardPage';
import CylinderListPage from './components/cylinders/CylinderListPage';
import CylinderDetailPage from './components/cylinders/CylinderDetailPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import InventoryPage from './components/inventory/InventoryPage';
import AlertsPage from './components/alerts/AlertsPage';
import MaintenancePage from './components/maintenance/MaintenancePage';
import DevicesPage from './components/devices/DevicesPage';
import EmergencyPage from './components/emergency/EmergencyPage';
import ReportsPage from './components/reports/ReportsPage';
import AdminPage from './components/admin/AdminPage';
import FeaturesPage from './components/footer/FeaturesPage';
import PricingPage from './components/footer/PricingPage';
import SecurityPage from './components/footer/SecurityPage';
import AboutPage from './components/footer/AboutPage';
import BlogPage from './components/footer/BlogPage';
import CareersPage from './components/footer/CareersPage';
import DocumentationPage from './components/footer/DocumentationPage';
import SupportPage from './components/footer/SupportPage';
import StatusPage from './components/footer/StatusPage';
import PrivacyPolicyPage from './components/footer/PrivacyPolicyPage';
import TermsOfServicePage from './components/footer/TermsOfServicePage';
import { UserRole } from './types';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route
                element={
                  <SimulationProvider>
                    <AppLayout />
                  </SimulationProvider>
                }
              >
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cylinders"
                  element={
                    <ProtectedRoute>
                      <CylinderListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cylinders/:id"
                  element={
                    <ProtectedRoute>
                      <CylinderDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute>
                      <InventoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alerts"
                  element={
                    <ProtectedRoute>
                      <AlertsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/maintenance"
                  element={
                    <ProtectedRoute>
                      <MaintenancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/devices"
                  element={
                    <ProtectedRoute>
                      <DevicesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/emergency"
                  element={
                    <ProtectedRoute>
                      <EmergencyPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRoles={['super_admin', 'hospital_admin'] as UserRole[]}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
