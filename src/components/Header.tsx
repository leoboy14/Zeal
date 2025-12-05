import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-6 inset-x-0 max-w-4xl mx-auto z-50 px-4">
      <div
        className={`w-full rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-black/80 border-white/20' : ''
          }`}
      >
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection('work')}
            className="text-text-white text-sm font-medium tracking-wider hover:text-primary-orange transition-colors font-bebas"
          >
            WORK
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-text-white text-sm font-medium tracking-wider hover:text-primary-orange transition-colors font-bebas"
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="text-text-white text-sm font-medium tracking-wider hover:text-primary-orange transition-colors font-bebas"
          >
            SERVICES
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-text-white text-sm font-medium tracking-wider hover:text-primary-orange transition-colors font-bebas"
          >
            CONTACT
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden md:block">
          <button
            onClick={() => scrollToSection('contact')}
            className="px-5 py-1.5 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-full text-white text-xs font-bold tracking-widest transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary-orange/30 font-bebas"
          >
            LET'S TALK
          </button>
        </div>

        {/* Logo */}
        <div className="logo flex-shrink-0 md:ml-0 ml-auto">
          <div className="logo-icon">
            <img
              src={logo}
              alt="Zeal Highlights Logo"
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
