import React from 'react'
import { motion } from 'framer-motion'

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 px-6 md:px-10 bg-background-card relative z-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bebas tracking-wider text-white mb-8">
            ABOUT
          </h2>
          
          <div className="space-y-6 text-text-gray text-lg font-light leading-relaxed">
            <p>
              <span className="text-white font-medium">Zeal Highlights</span> is a Philippines-based video editing agency supporting clients in the US and around the world. We help content creators and businesses transform raw footage into polished, engaging videos that align with their brand and goals.
            </p>
            
            <p>
              Our agency operates with a team-based workflow, clear processes, and a strong focus on quality control. Led by experienced editors, we combine creative storytelling with efficient production systems—allowing our clients to scale content without worrying about deadlines or output quality.
            </p>

            <p>
              We work behind the scenes so our clients can focus on growth, strategy, and impact.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
