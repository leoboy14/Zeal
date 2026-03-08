import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
          isMobile={false}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full min-w-0 bg-muted/60 dark:bg-muted/10">
        <AdminHeader 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar setup inside AdminSidebar passing Sheet props */}
      <div className="md:hidden">
         <AdminSidebar 
            isCollapsed={false} 
            isMobile={true} 
            isOpen={isMobileMenuOpen} 
            setIsOpen={setIsMobileMenuOpen} 
         />
      </div>
    </div>
  );
}
