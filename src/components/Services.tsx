import React from 'react'
import { motion } from 'framer-motion'

const Services: React.FC = () => {
  const servicesList = [
    "Short-form video editing for Reels, Shorts, and TikTok",
    "Long-form YouTube and content-based videos",
    "Podcast and talking-head video editing",
    "Wedding highlights and event video editing, capturing key moments with cinematic storytelling",
    "Motion graphics, captions, and brand-consistent visuals",
    "Custom post-production solutions based on your workflow"
  ]

  return (
    <section id="services" className="py-20 px-6 md:px-10 bg-background-dark relative z-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bebas tracking-wider text-white mb-8">
            SERVICES
          </h2>
          
          <p className="text-text-gray text-lg mb-8 leading-relaxed font-light">
            We provide professional video editing services designed to support both content-driven brands and special events. Our agency delivers consistent, high-quality edits tailored to your goals, audience, and timeline.
          </p>

          <div className="bg-background-card p-8 rounded-2xl border border-white/5 mb-8">
            <h3 className="text-xl font-bebas tracking-wide text-primary-orange mb-6">
              OUR SERVICES INCLUDE:
            </h3>
            <ul className="space-y-4">
              {servicesList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-orange mt-1">✦</span>
                  <span className="text-white font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-text-gray text-lg leading-relaxed font-light">
            Whether you need ongoing content support or polished edits for once-in-a-lifetime events, <span className="text-white font-medium">Zeal Highlights</span> delivers reliable, detail-focused video editing you can trust.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
