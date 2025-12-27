import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Footer from './Footer'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  })

  const projectTypes = [
    'Short-Form Content',
    'Long-Form Video',
    'Podcast Editing',
    'Wedding & Events',
    'Motion Graphics',
    'Other'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Create mailto link with form data
    const subject = encodeURIComponent(`${formData.projectType || 'Project'} Inquiry from ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.projectType}\n\nMessage:\n${formData.message}`
    )
    window.location.href = `mailto:Ponceharhley15@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <>
      <section className="min-h-screen pt-32 pb-20 px-6 md:px-10 bg-background-dark relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-orange/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary-orange/15 rounded-full blur-[128px]" />
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-200px)]">
            
            {/* Left Side - Typography & Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 lg:pr-8"
            >
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-primary-orange font-medium text-sm tracking-widest uppercase"
                >
                  Get In Touch
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-bebas text-4xl md:text-5xl lg:text-5xl xl:text-6xl tracking-wider text-white mt-4 leading-[1]"
                >
                  LET'S CREATE
                  <br />
                  <span 
                    className="text-primary-orange"
                    style={{
                      background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 50%, #FF6B35 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    SOMETHING
                  </span>
                  <br />
                  LEGENDARY
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-text-gray text-base md:text-lg max-w-md leading-relaxed"
              >
                Ready to transform your content? Let's discuss your project and bring your vision to life.
              </motion.p>

              {/* Contact Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-4 pt-4"
              >
                {/* Email */}
                <a
                  href="mailto:Ponceharhley15@gmail.com"
                  className="flex items-center gap-4 text-text-gray hover:text-white transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-orange/20 to-secondary-orange/10 border border-white/10 flex items-center justify-center group-hover:border-primary-orange/50 transition-all duration-300">
                    <svg className="w-5 h-5 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-text-gray/60 uppercase tracking-wider">Email</span>
                    <p className="text-white font-medium">Ponceharhley15@gmail.com</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/639757523195"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-text-gray hover:text-white transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-white/10 flex items-center justify-center group-hover:border-green-500/50 transition-all duration-300">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-text-gray/60 uppercase tracking-wider">WhatsApp</span>
                    <p className="text-white font-medium">+63 975 752 3195</p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 text-text-gray">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-text-gray/60 uppercase tracking-wider">Location</span>
                    <p className="text-white font-medium">Philippines 🇵🇭 • Serving clients globally</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <form 
                onSubmit={handleSubmit}
                className="relative p-8 md:p-10 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl"
              >
                {/* Form Gradient Border Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-orange/20 via-transparent to-secondary-orange/10 opacity-50 pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="font-bebas text-2xl tracking-wider text-white">Send Us A Message</h2>
                    <p className="text-text-gray text-sm mt-2">We'll get back to you within 24 hours</p>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm text-text-gray font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-gray/50 focus:outline-none focus:border-primary-orange/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm text-text-gray font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-gray/50 focus:outline-none focus:border-primary-orange/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>

                  {/* Project Type Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="projectType" className="text-sm text-text-gray font-medium">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-orange/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239a9a9a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5rem'
                      }}
                    >
                      <option value="" className="bg-background-dark">Select a project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type} className="bg-background-dark">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm text-text-gray font-medium">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell us about your project..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-gray/50 focus:outline-none focus:border-primary-orange/50 focus:bg-white/10 transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider text-white bg-gradient-to-r from-primary-orange to-secondary-orange hover:from-secondary-orange hover:to-primary-orange transition-all duration-300 shadow-lg shadow-primary-orange/25"
                  >
                    SEND MESSAGE
                  </motion.button>

                  <p className="text-center text-text-gray/60 text-xs mt-4">
                    By submitting, you agree to our privacy policy
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  )
}

export default Contact
