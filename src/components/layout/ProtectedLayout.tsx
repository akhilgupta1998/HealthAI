import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import MobileBottomNav from '../MobileBottomNav';
import DesktopSidebar from './DesktopSidebar';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { useIsMobile } from '@/hooks/use-mobile';

const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useFirebaseContext();
  const isMobile = useIsMobile();
  const location = useLocation();

  // If authentication is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  // If the user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1">
        {!isMobile && <DesktopSidebar />}
        <main className="flex-1 px-4 pb-12 pt-16 md:px-6 md:pb-8 md:pt-20">
          <Outlet />
        </main>
      </div>
      {isMobile && <MobileBottomNav />}
      {/* Safe area for iOS */}
      {isMobile && <div className="h-16 md:hidden" />}
    </div>
  );
};

export default ProtectedLayout; 