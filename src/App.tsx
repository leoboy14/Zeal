import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './components/About'
import Contact from './components/Contact'
import LoadingScreen from './components/LoadingScreen'
import CursorGlow from './components/CursorGlow'

// The admin dashboard (and its Supabase/Radix dependencies) loads on demand,
// keeping the public bundle small.
const AdminRoot = lazy(() => import('./pages/admin/AdminRoot'))
// Standalone, unbranded rate card — no header, loader or cursor glow.
const Rates = lazy(() => import('./pages/Rates'))

const PUBLIC_LOADER_MS = 1750

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isInternal = isAdmin || location.pathname === '/rates';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!isInternal && <CursorGlow />}
      {!isInternal && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Work />} />
        <Route path="/work" element={<Navigate to="/services" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/rates"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#f4f2ed]" />}>
              <Rates />
            </Suspense>
          }
        />

        {/* Admin Routes (lazy-loaded chunk) */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <AdminRoot />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isInternal = isAdmin || location.pathname === '/rates';
  const [isLoading, setIsLoading] = useState(() => {
    // Loader plays on every page load, including refreshes.
    return !isInternal
  })

  useEffect(() => {
    if (isInternal) {
      setIsLoading(false)
      return
    }
    if (!isLoading) return

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, PUBLIC_LOADER_MS)
    return () => clearTimeout(timer)
  }, [isInternal, isLoading])

  useEffect(() => {
    // Public pages use the light "cream" branding; admin also runs in light mode.
    document.documentElement.classList.remove('dark');
  }, [isInternal]);

  return (
    <div
      className={
        isInternal ? 'min-h-screen bg-background text-foreground' : 'min-h-screen bg-[#f4f2ed] text-[#111]'
      }
    >
      {!isInternal && <LoadingScreen isLoading={isLoading} />}
      {/* Children mount immediately — the opaque loader covers them, so the
          hero poster, fonts and first video start fetching during the intro. */}
      {children}
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

