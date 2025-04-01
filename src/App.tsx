<<<<<<< HEAD
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useFirebaseContext } from './contexts/FirebaseContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import MiaChat from './components/MiaChat';
import ProtectedLayout from './components/ProtectedLayout';
import LandingPage from './pages/LandingPage';
import LoadingFallback from './components/LoadingFallback';
import GoalsPage from './pages/Goals';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import DebugLogin from '@/pages/DebugLogin';

// Lazy load routes for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const FoodTracking = lazy(() => import('./pages/FoodTracking'));
const WaterPage = lazy(() => import('./pages/WaterPage'));
const ExercisePage = lazy(() => import('./pages/ExercisePage'));
const VitalsPage = lazy(() => import('./pages/VitalsPage'));
const Calendar = lazy(() => import('./pages/Calendar'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const MealPlanner = lazy(() => import('./pages/MealPlanner'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  const { isAuthenticated, isLoading } = useFirebaseContext();

  // Show loading indicator while checking authentication state
  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="health-guardian-theme">
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/debug-login" element={<DebugLogin />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="/profile" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProfilePage />
              </Suspense>
            } />
            <Route path="/food-tracking" element={
              <Suspense fallback={<LoadingFallback />}>
                <FoodTracking />
              </Suspense>
            } />
            <Route path="/water" element={
              <Suspense fallback={<LoadingFallback />}>
                <WaterPage />
              </Suspense>
            } />
            <Route path="/exercise" element={
              <Suspense fallback={<LoadingFallback />}>
                <ExercisePage />
              </Suspense>
            } />
            <Route path="/vitals" element={
              <Suspense fallback={<LoadingFallback />}>
                <VitalsPage />
              </Suspense>
            } />
            <Route path="/calendar" element={
              <Suspense fallback={<LoadingFallback />}>
                <Calendar />
              </Suspense>
            } />
            <Route path="/progress" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProgressPage />
              </Suspense>
            } />
            <Route path="/settings" element={
              <Suspense fallback={<LoadingFallback />}>
                <SettingsPage />
              </Suspense>
            } />
            <Route path="/meal-planner" element={
              <Suspense fallback={<LoadingFallback />}>
                <MealPlanner />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<LoadingFallback />}>
                <Contact />
              </Suspense>
            } />
            <Route path="/goals" element={
              <Suspense fallback={<LoadingFallback />}>
                <GoalsPage />
              </Suspense>
            } />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Global chat assistant */}
        <MiaChat />
        
        {/* Global toast notifications */}
        <Toaster richColors position="top-right" />
      </Router>
    </ThemeProvider>
  );
}
=======

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import FoodTracking from "./pages/FoodTracking";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import SSOCallback from "./pages/SSOCallback";
import ExercisePage from "./pages/ExercisePage";
import VitalsPage from "./pages/VitalsPage";
import HabitsPage from "./pages/HabitsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import MiaChat from "./components/MiaChat";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import HealthyRecipes from "./pages/HealthyRecipes";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { AuthProvider } from '@/contexts/AuthContext';
import RequireAuth from './components/RequireAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FirebaseProvider>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" richColors />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sso-callback" element={<SSOCallback />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/healthy-recipes" element={<HealthyRecipes />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              
              <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/food-tracking" element={<FoodTracking />} />
                  <Route path="/exercise" element={<ExercisePage />} />
                  <Route path="/vitals" element={<VitalsPage />} />
                  <Route path="/habits" element={<HabitsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <MiaChat />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </FirebaseProvider>
  </QueryClientProvider>
);
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac

export default App;
