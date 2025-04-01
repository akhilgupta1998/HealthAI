
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './layout/AppHeader';
import MobileBottomNav from './MobileBottomNav';
import DesktopSidebar from './layout/DesktopSidebar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <DesktopSidebar />
      
      <div className="flex-1 flex flex-col pb-16 md:pb-0">
        {/* Header */}
        <AppHeader />
        
        {/* Main content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
