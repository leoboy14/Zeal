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

const LOADER_SEEN_KEY = 'zeal_public_loader_seen'

function isBrowserReload(): boolean {
  if (typeof performance === 'undefined') return false
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return nav?.type === 'reload'
}

function hasSeenPublicLoader(): boolean {
  try {
    return sessionStorage.getItem(LOADER_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markPublicLoaderSeen(): void {
  try {
    sessionStorage.setItem(LOADER_SEEN_KEY, '1')
  } catch {
    /* private / quota */
  }
}

const PUBLIC_LOADER_MS = 1000

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
  const [isLoading, setIsLoading] = useState(() => {
    if (isInternal) return false
    if (isBrowserReload()) return false
    if (hasSeenPublicLoader()) return false
    return true
  })

  useEffect(() => {
    if (isInternal) {
      setIsLoading(false)
      return
    }
    if (!isLoading) return

    const timer = setTimeout(() => {
      setIsLoading(false)
      markPublicLoaderSeen()
    }, PUBLIC_LOADER_MS)
    return () => clearTimeout(timer)
  }, [isInternal, isLoading])

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

