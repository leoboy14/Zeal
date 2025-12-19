import React from 'react'
import { motion } from 'framer-motion'
import { TextGenerateEffect } from './ui/text-generate-effect'

const About: React.FC = () => {
  const aboutText = `Zeal Highlights is a Philippines-based video editing agency supporting clients in the US and around the world. We help content creators and businesses transform raw footage into polished, engaging videos that align with their brand and goals. Our agency operates with a team-based workflow, clear processes, and a strong focus on quality control. Led by experienced editors, we combine creative storytelling with efficient production systems.`

  return (
    <section id="about" className="py-20 px-6 md:px-10 bg-background-card relative z-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bebas tracking-wider text-white mb-10 text-center">
            ABOUT US
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div>
                <TextGenerateEffect words={aboutText} />
                <p className="mt-8 text-text-gray font-light leading-relaxed">
                   We work behind the scenes so our clients can focus on <span className="text-primary-orange font-medium">growth, strategy, and impact.</span>
                </p>
             </div>
             
             <div className="relative h-64 md:h-full min-h-[300px] w-full bg-black/50 rounded-2xl border border-white/5 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Placeholder for an agency image or abstract graphic */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/20 font-bebas text-4xl tracking-widest">ZEAL HIGHLIGHTS</span>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
