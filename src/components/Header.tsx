import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false)
    if (location.pathname !== path) {
       navigate(path)
    } else {
       window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="fixed top-6 inset-x-0 w-[95%] max-w-4xl mx-auto z-[100] px-4">
      <div
        className={`w-full rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 relative ${scrolled ? 'bg-black/80 border-white/20' : ''
          }`}
      >
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleNavigation('/')}
            className={`text-sm font-medium tracking-wider transition-colors font-bebas ${isActive('/') ? 'text-primary-orange' : 'text-text-white hover:text-primary-orange'}`}
          >
            WORK
          </button>
          <button
            onClick={() => handleNavigation('/about')}
            className={`text-sm font-medium tracking-wider transition-colors font-bebas ${isActive('/about') ? 'text-primary-orange' : 'text-text-white hover:text-primary-orange'}`}
          >
            ABOUT
          </button>
          <button
            onClick={() => handleNavigation('/services')}
            className={`text-sm font-medium tracking-wider transition-colors font-bebas ${isActive('/services') ? 'text-primary-orange' : 'text-text-white hover:text-primary-orange'}`}
          >
            SERVICES
          </button>
          <button
            onClick={() => handleNavigation('/contact')}
            className={`text-sm font-medium tracking-wider transition-colors font-bebas ${isActive('/contact') ? 'text-primary-orange' : 'text-text-white hover:text-primary-orange'}`}
          >
            CONTACT
          </button>
        </nav>

        <div className="hidden md:block">
          <button
            onClick={() => handleNavigation('/contact')}
            className="px-5 py-1.5 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-full text-white text-xs font-bold tracking-widest transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary-orange/30 font-bebas block"
          >
            LET'S TALK
          </button>
        </div>

        {/* Logo */}
        <div className="logo flex-shrink-0 md:ml-0 ml-auto md:mr-0 mr-2 cursor-pointer" onClick={() => handleNavigation('/')}>
          <div className="logo-icon">
            <img
              src={logo}
              alt="Zeal Highlights Logo"
              className="h-8 w-auto"
            />
          </div>
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
            className="absolute top-full left-0 right-0 mt-4 mx-4 p-4 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigation('/')}
                className={`text-lg font-bebas tracking-wider text-left p-2 rounded-lg hover:bg-white/5 transition-all ${isActive('/') ? 'text-primary-orange' : 'text-white hover:text-primary-orange'}`}
              >
                WORK
              </button>
              <button
                onClick={() => handleNavigation('/about')}
                className={`text-lg font-bebas tracking-wider text-left p-2 rounded-lg hover:bg-white/5 transition-all ${isActive('/about') ? 'text-primary-orange' : 'text-white hover:text-primary-orange'}`}
              >
                ABOUT
              </button>
              <button
                onClick={() => handleNavigation('/services')}
                className={`text-lg font-bebas tracking-wider text-left p-2 rounded-lg hover:bg-white/5 transition-all ${isActive('/services') ? 'text-primary-orange' : 'text-white hover:text-primary-orange'}`}
              >
                SERVICES
              </button>
              <button
                onClick={() => handleNavigation('/contact')}
                className={`text-lg font-bebas tracking-wider text-left p-2 rounded-lg hover:bg-white/5 transition-all ${isActive('/contact') ? 'text-primary-orange' : 'text-white hover:text-primary-orange'}`}
              >
                CONTACT
              </button>
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="w-full py-4 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-xl text-white text-lg font-bold tracking-widest font-bebas text-center block"
                >
                  LET'S TALK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
