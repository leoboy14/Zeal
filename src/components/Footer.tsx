import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import logo from '../assets/logo_zeal_black.png'
import { Container } from './ui/section'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <footer className="relative z-30 bg-white border-t border-[#e3e0d8]">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-orange to-transparent" />

      {/* Closing CTA — the page shouldn't end on link columns */}
      <div className="border-b border-[#e7e4dc] bg-[#f4f2ed]">
        <Container className="py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">
                04 / Next
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[0.95] text-[#111] sm:text-5xl lg:text-6xl">
                Got footage?
                <br />
                Let&rsquo;s <span className="text-primary-orange">ship it.</span>
              </h2>
            </div>
            <Link
              to="/contact"
              className="group inline-flex shrink-0 items-center gap-3 text-base font-semibold text-[#111]"
            >
              <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-[#111]">
                Start a project
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-orange text-white transition-transform duration-300 group-hover:translate-x-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>
        </Container>
      </div>

      {/* Main Footer Content */}
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">

          {/* Left - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4 md:col-span-5"
          >
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-block transition-transform duration-300 hover:scale-105"
            >
              <img 
                src={logo} 
                alt="Zeal Highlights" 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-[#555] text-sm leading-relaxed max-w-xs">
              Transforming raw footage into polished, engaging videos that align with your brand and goals.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="https://www.facebook.com/zealchristianbookshoppe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black/[0.04] border border-black/10 flex items-center justify-center text-[#555] hover:text-primary-orange hover:border-primary-orange/50 hover:bg-primary-orange/10 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Center - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4 md:col-span-3"
          >
            <h4 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#555] hover:text-primary-orange transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary-orange transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4 md:col-span-4"
          >
            <h4 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">
              Get In Touch
            </h4>
            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:info@zealhighlights.com"
                className="flex items-center gap-3 text-[#555] hover:text-primary-orange transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-black/[0.04] border border-black/10 flex items-center justify-center group-hover:border-primary-orange/50 group-hover:bg-primary-orange/10 transition-all duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm">info@zealhighlights.com</span>
              </a>
              
              {/* WhatsApp */}
              <a
                href="https://wa.me/639757523195"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#555] hover:text-primary-orange transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-black/[0.04] border border-black/10 flex items-center justify-center group-hover:border-primary-orange/50 group-hover:bg-primary-orange/10 transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-sm">+63 975 752 3195</span>
              </a>

              {/* Location */}
              <div className="flex items-center gap-3 text-[#555]">
                <div className="w-10 h-10 rounded-full bg-black/[0.04] border border-black/10 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm">Philippines 🇵🇭</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#e3e0d8]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#777] text-xs">
              © {currentYear} Zeal Highlights. All rights reserved.
            </p>
            <p className="text-[#777] text-xs">
              To God be the Glory!
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
