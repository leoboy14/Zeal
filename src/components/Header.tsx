import React, { useState, useEffect } from 'react'
import logo from '../assets/logo_zeal_black.png'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="fixed top-4 sm:top-6 inset-x-0 w-[95%] max-w-4xl mx-auto z-[100] px-2 sm:px-4">
      <div
        className={`w-full rounded-full border border-black/5 bg-white/80 backdrop-blur-md shadow-2xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between transition-all duration-300 relative ${scrolled ? 'bg-white/90 border-black/10' : ''
          }`}
      >
        {/* Logo — left */}
        <Link to="/" className="logo flex-shrink-0">
          <div className="logo-icon">
            <img
              src={logo}
              alt="Zeal Highlights Logo"
              className="h-6 sm:h-8 w-auto"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium tracking-wider transition-colors font-bebas ${isActive('/') ? 'text-[#f97316]' : 'text-[#111] hover:text-[#f97316]'}`}
          >
            WORK
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium tracking-wider transition-colors font-bebas ${isActive('/about') ? 'text-[#f97316]' : 'text-[#111] hover:text-[#f97316]'}`}
          >
            ABOUT
          </Link>
          <Link
            to="/services"
            className={`text-sm font-medium tracking-wider transition-colors font-bebas ${isActive('/services') ? 'text-[#f97316]' : 'text-[#111] hover:text-[#f97316]'}`}
          >
            SERVICES
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium tracking-wider transition-colors font-bebas ${isActive('/contact') ? 'text-[#f97316]' : 'text-[#111] hover:text-[#f97316]'}`}
          >
            CONTACT
          </Link>
        </nav>

        {/* Right side — CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden md:block px-5 py-1.5 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-full text-white text-xs font-bold tracking-widest transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary-orange/30 font-bebas"
          >
            LET'S TALK
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#111] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-4 mx-4 p-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-black/10 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`text-lg font-bebas tracking-wider text-left p-2 rounded-lg hover:bg-black/5 transition-all ${isActive('/') ? 'text-[#f97316]' : 'text-[#111] hover:text-[#f97316]'}`}
              >
                WORK
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={`text-lg font-bebas tracking-wider text-left p-2 rounded-lg hover:bg-black/5 transition-all ${isActive('/about') ? 'text-[#f97316]' : 'text-[#111] hover:text-[#f97316]'}`}
              >
                ABOUT
              </Link>
              <Link
                to="/services"
                onClick={closeMobileMenu}
                className={`text-lg font-bebas tracking-wider text-left p-2 rounded-lg hover:bg-black/5 transition-all ${isActive('/services') ? 'text-[#f97316]' : 'text-[#111] hover:text-[#f97316]'}`}
              >
                SERVICES
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className={`text-lg font-bebas tracking-wider text-left p-2 rounded-lg hover:bg-black/5 transition-all ${isActive('/contact') ? 'text-[#f97316]' : 'text-[#111] hover:text-[#f97316]'}`}
              >
                CONTACT
              </Link>
              <div className="pt-2 border-t border-black/10">
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="w-full py-4 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-xl text-white text-lg font-bold tracking-widest font-bebas text-center block"
                >
                  LET'S TALK
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
