import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import Dashboard from './components/Dashboard'
import LoadingScreen from './components/LoadingScreen'
import CursorGlow from './components/CursorGlow'

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!isDashboard && <CursorGlow />}
      {!isDashboard && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time / wait for assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background-dark noise-overlay">
        <LoadingScreen isLoading={isLoading} />
        {!isLoading && <AppContent />}
      </div>
    </Router>
  )
}

export default App

