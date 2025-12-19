import React from 'react'
import { motion } from 'framer-motion'
import { HoverEffect } from './ui/card-hover-effect'

const Services: React.FC = () => {
  const services = [
    {
      title: "Short-Form Content",
      description: "High-retention editing for Reels, Shorts, and TikTok. We optimize for algorithms with dynamic captions and pacing."
    },
    {
      title: "Long-Form Video",
      description: "Compelling storytelling for YouTube and corporate content. We handle pacing, sound design, and color grading."
    },
    {
      title: "Podcast Editing",
      description: "Multi-cam editing for podcasts and talking-head videos. We ensure crystal clear audio and engaging visual cuts."
    },
    {
      title: "Wedding & Events",
      description: "Cinematic highlights that capture the emotion of your special day. Beautiful color grading and emotional storytelling."
    },
    {
      title: "Motion Graphics",
      description: "Custom animations, kinetic typography, and brand-consistent visuals to elevate your production value."
    },
    {
      title: "Custom Solutions",
      description: "Tailored post-production workflows designed around your specific needs and brand guidelines."
    }
  ]

  return (
    <section id="services" className="py-20 px-6 md:px-10 bg-background-dark relative z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bebas tracking-wider text-white mb-2 text-center">
            SERVICES
          </h2>
          <p className="text-text-gray text-center max-w-2xl mx-auto mb-10 font-light">
            Professional edits tailored to your goals.
          </p>

          <HoverEffect items={services} />
        </motion.div>
      </div>
    </section>
  )
}

export default Services
