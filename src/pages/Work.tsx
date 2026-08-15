import React from 'react'
import { motion } from 'framer-motion'
import FeaturedWork from '../components/FeaturedWork'
import Footer from '../components/Footer'
import { Container, SectionHeading } from '../components/ui/section'

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const SERVICES = [
  {
    index: '01',
    title: 'AI UGC & avatar ads',
    description: 'Scroll-stopping UGC-style ads powered by AI avatars — dozens of variations, zero shoots.',
  },
  {
    index: '02',
    title: 'AI claymation & 3D',
    description: 'Character-driven claymation and 3D spots that make products impossible to scroll past.',
  },
  {
    index: '03',
    title: 'Motion graphics',
    description: 'Kinetic typography, animated UI, and data-driven creative built to convert in seconds.',
  },
  {
    index: '04',
    title: 'UGC & creator content',
    description: 'Real creators, real locations — cut into high-retention, platform-native short-form.',
  },
  {
    index: '05',
    title: 'Podcast & talking head',
    description: 'Layered talking-head edits with motion overlays, dynamic captions, and clean audio.',
  },
  {
    index: '06',
    title: 'SaaS & product demos',
    description: 'Founder-led demos and walkthroughs that turn features into a story worth watching.',
  },
]

const Work: React.FC = () => {
  return (
    <>
      <main className="pt-36 pb-24">
        {/* Intro */}
        <Container>
          <motion.div variants={reveal} initial="hidden" animate="show">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">
              Work
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.02em] text-[#111] sm:text-6xl md:text-7xl">
              What we make<span className="text-[#f97316]">.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#555]">
              Six ways we produce video — every one of them proven by the work
              below.
            </p>
          </motion.div>

          {/* Services index */}
          <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 border-y border-[#e7e4dc] py-12 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((item, i) => (
              <motion.div
                key={item.index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                viewport={{ once: true }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#f97316]">
                  {item.index}
                </p>
                <h3 className="mt-3 font-display text-2xl tracking-[-0.01em] text-[#111]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#666]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>

        {/* Portfolio */}
        <div className="mt-8">
          <FeaturedWork />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Work
