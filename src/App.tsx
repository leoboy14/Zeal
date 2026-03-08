import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import LoadingScreen from './components/LoadingScreen'
import CursorGlow from './components/CursorGlow'
import AdminLayout from './components/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import ProjectsPage from './pages/admin/ProjectsPage'
import ClientsPage from './pages/admin/ClientsPage'
import EditorsPage from './pages/admin/EditorsPage'
import QAFeedbackPage from './pages/admin/QAFeedbackPage'
import SettingsPage from './pages/admin/SettingsPage'
import { DashboardProvider } from './context/DashboardContext'

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isInternal = isAdmin;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!isInternal && <CursorGlow />}
      {!isInternal && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <DashboardProvider>
            <AdminLayout />
          </DashboardProvider>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="editors" element={<EditorsPage />} />
          <Route path="qa" element={<QAFeedbackPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isInternal = isAdmin;
  const [isLoading, setIsLoading] = useState(!isInternal);

  useEffect(() => {
    // Only show loading screen on initial mount for public pages
    if (!isInternal) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    // Enforce dark mode on public pages, default to light mode on admin pages
    if (isInternal) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isInternal]);

  return (
    <div
      className={
        isInternal ? 'min-h-screen bg-background text-foreground' : 'min-h-screen bg-background-dark noise-overlay'
      }
    >
      {!isInternal && <LoadingScreen isLoading={isLoading} />}
      {(!isLoading || isInternal) && children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell>
        <AppContent />
      </AppShell>
    </Router>
  );
}

export default App

