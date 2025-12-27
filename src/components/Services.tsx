import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from './Footer'

// Service icons as SVG components for visual appeal
const icons = {
  shortForm: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="url(#shortFormGrad)"/>
      <defs>
        <linearGradient id="shortFormGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B35"/>
          <stop offset="1" stopColor="#FFD93D"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  longForm: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm9.5 3v6l4-3-4-3z" fill="url(#longFormGrad)"/>
      <defs>
        <linearGradient id="longFormGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7931E"/>
          <stop offset="1" stopColor="#FF6B35"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  podcast: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zm-1 14.93A7.002 7.002 0 015 9h2a5 5 0 0010 0h2a7.002 7.002 0 01-6 6.93V20h4v2H7v-2h4v-4.07z" fill="url(#podcastGrad)"/>
      <defs>
        <linearGradient id="podcastGrad" x1="5" y1="1" x2="19" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD93D"/>
          <stop offset="1" stopColor="#F7931E"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  wedding: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#weddingGrad)"/>
      <defs>
        <linearGradient id="weddingGrad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B35"/>
          <stop offset="0.5" stopColor="#F7931E"/>
          <stop offset="1" stopColor="#FFD93D"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  motion: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#motionGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="motionGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD93D"/>
          <stop offset="1" stopColor="#FF6B35"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  custom: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="url(#customGrad)"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="url(#customGrad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="customGrad" x1="9" y1="9" x2="15" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B35"/>
          <stop offset="1" stopColor="#FFD93D"/>
        </linearGradient>
        <linearGradient id="customGrad2" x1="1" y1="1" x2="23" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7931E"/>
          <stop offset="1" stopColor="#FFD93D"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

interface Service {
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
}

const Services: React.FC = () => {
  const services: Service[] = [
    {
      title: "Short-Form Content",
      description: "High-retention editing for Reels, Shorts, and TikTok. We optimize for algorithms with dynamic captions and pacing.",
      icon: icons.shortForm,
      features: ["Algorithm Optimization", "Dynamic Captions", "Trend Integration"]
    },
    {
      title: "Long-Form Video",
      description: "Compelling storytelling for YouTube and corporate content. We handle pacing, sound design, and color grading.",
      icon: icons.longForm,
      features: ["Story Structure", "Sound Design", "Color Grading"]
    },
    {
      title: "Podcast Editing",
      description: "Multi-cam editing for podcasts and talking-head videos. We ensure crystal clear audio and engaging visual cuts.",
      icon: icons.podcast,
      features: ["Multi-Cam Editing", "Audio Mastering", "Visual Cuts"]
    },
    {
      title: "Wedding & Events",
      description: "Cinematic highlights that capture the emotion of your special day. Beautiful color grading and emotional storytelling.",
      icon: icons.wedding,
      features: ["Cinematic Style", "Emotional Pacing", "4K Delivery"]
    },
    {
      title: "Motion Graphics",
      description: "Custom animations, kinetic typography, and brand-consistent visuals to elevate your production value.",
      icon: icons.motion,
      features: ["Custom Animation", "Kinetic Typography", "Brand Assets"]
    },
    {
      title: "Custom Solutions",
      description: "Tailored post-production workflows designed around your specific needs and brand guidelines.",
      icon: icons.custom,
      features: ["Flexible Workflow", "Brand Guidelines", "Dedicated Support"]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <>
      <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient orbs */}
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-radial from-primary-orange/20 via-transparent to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-radial from-accent-gold/15 via-transparent to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-secondary-orange/10 via-transparent to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-primary-orange border border-primary-orange/30 rounded-full bg-primary-orange/5"
            >
              WHAT WE DO
            </motion.span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bebas tracking-wider mb-6">
              <span className="text-white">OUR </span>
              <span className="relative inline-block">
                <span 
                  style={{
                    background: 'linear-gradient(to right, #FF6B35, #F7931E, #FFD93D)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  SERVICES
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-orange via-secondary-orange to-accent-gold rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-text-gray text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed"
            >
              Professional video editing services tailored to elevate your content 
              and captivate your audience.
            </motion.p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-orange via-secondary-orange to-accent-gold rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500 group-hover:duration-200" />
                
                {/* Card */}
                <div className="relative h-full p-8 bg-background-card/80 backdrop-blur-xl rounded-2xl border border-white/5 group-hover:border-primary-orange/30 transition-all duration-300">
                  {/* Icon container with gradient background */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-primary-orange/20 to-accent-gold/10 rounded-xl blur-xl" />
                    <div className="relative w-16 h-16 flex items-center justify-center bg-background-dark/50 rounded-xl border border-white/10 group-hover:border-primary-orange/30 transition-colors duration-300">
                      {service.icon}
                    </div>
                  </div>

                  {/* Title with hover color */}
                  <h3 className="text-xl font-bebas tracking-wide text-white mb-3 group-hover:text-primary-orange transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-text-gray text-sm leading-relaxed mb-6 font-light">
                    {service.description}
                  </p>

                  {/* Features pills */}
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 text-xs text-text-gray bg-white/5 rounded-full border border-white/10 group-hover:border-primary-orange/20 group-hover:text-primary-orange/80 transition-all duration-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-2xl">
                    <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-primary-orange/50 to-transparent transform rotate-45 translate-x-8 -translate-y-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <div className="relative inline-block p-8 md:p-12 rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/10 via-secondary-orange/5 to-accent-gold/10 rounded-3xl" />
              <div className="absolute inset-0 border border-white/5 rounded-3xl" />
              
              <h3 className="relative text-2xl md:text-3xl font-bebas tracking-wide text-white mb-4">
                READY TO ELEVATE YOUR CONTENT?
              </h3>
              <p className="relative text-text-gray mb-8 max-w-xl mx-auto font-light">
                Let's discuss your project and bring your vision to life with professional editing.
              </p>
              <Link
                to="/contact"
                className="relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-orange to-secondary-orange text-white font-bebas tracking-wider rounded-full overflow-hidden group transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,107,53,0.4)]"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Services
