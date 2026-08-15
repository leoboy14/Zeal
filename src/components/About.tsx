import React, { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import Footer from './Footer'
import { teamPortraitStorageUrl } from '../lib/storageUrls'
import { Container, SectionHeading } from './ui/section'

interface TeamMember {
  name: string
  role: string
  /** Filename in Supabase Storage bucket (`VITE_SUPABASE_TEAM_BUCKET`), same as in `public/team/`. */
  image: string
  scale?: number
  /** Zoom anchor as % from top — raise for tight top-cropped sources so hair stays in frame. */
  originY?: number
}

const teamMembers: TeamMember[] = [
  { name: 'Harhley', role: 'Founder & Creative Director', image: 'Harhley Ponce.png', scale: 1.69 },
  { name: 'Dian', role: 'Financial Chief Officer', image: 'Dian.png', scale: 1.28, originY: 18 },
  { name: 'Leonhel', role: 'Managing Partner', image: 'Leo.png', scale: 1.12 },
  { name: 'Alvin', role: 'Business Development Partner', image: 'Alvin.jpg', scale: 1.43, originY: 18 },
  { name: 'Jun', role: 'Head of Video Production', image: 'Jun2.png', scale: 1.61, originY: 18 },
  { name: 'Jing', role: 'Lead Video Editor', image: 'Jing Jing.png', scale: 1.54, originY: 10 },
  { name: 'Angela', role: 'Project Manager / Client Success', image: 'Angela.png', scale: 1.29, originY: 12 },
  { name: 'Nicko', role: 'Quality Control & Delivery Specialist', image: 'Nicko.png', scale: 2.04 },
  { name: 'Karlo', role: 'Long-Form Video Editor', image: 'Karlo.png', scale: 1.12 },
  { name: 'Catleya', role: 'Long-Form Video Editor', image: 'Catleya.png', scale: 1.18 },
  { name: 'Christian', role: 'Long-Form Video Editor', image: 'Christian.png', scale: 1.14 },
  { name: 'Donna', role: 'Short-Form Video Editor', image: 'Donna Bael Corpuz.png', scale: 1.36, originY: 8 },
  { name: 'April', role: 'Short-Form Video Editor', image: 'april.png', scale: 1.19 },
  { name: 'Jared', role: 'Short-Form Video Editor', image: 'Jared.png', scale: 1.12, originY: 12 },
]

// Animated Counter
const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end,
  suffix = '',
  duration = 1.6,
}) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const STATS = [
  { value: 500, suffix: '+', label: 'videos edited' },
  { value: 14, suffix: '', label: 'team members' },
  { value: 10, suffix: '+', label: 'partners' },
  { value: 24, suffix: '/7', label: 'support' },
]

const PRINCIPLES = [
  {
    index: '01',
    title: 'Quality control',
    description:
      'Every video passes a dedicated review before it reaches you. Nothing ships on a first draft.',
  },
  {
    index: '02',
    title: 'Fast turnaround',
    description:
      'A team-based workflow with clear hand-offs keeps delivery quick without cutting corners.',
  },
  {
    index: '03',
    title: 'Dedicated editors',
    description:
      'You work with the same editors who learn your brand, your pacing, and your audience.',
  },
  {
    index: '04',
    title: 'Always on',
    description:
      'Philippines-based, serving the US and beyond — timezone gaps become an advantage, not a delay.',
  },
]

// Team spotlight — one portrait at a time, avatar rail to switch
const TeamSpotlight: React.FC = () => {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const member = teamMembers[active]

  // Slow auto-advance keeps the section alive; any interaction hands over control
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setActive((a) => (a + 1) % teamMembers.length), 3500)
    return () => clearInterval(t)
  }, [paused])

  return (
    <div
      className="mt-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col items-center">
        {/* Portrait stage */}
        <div className="relative aspect-[3/4] w-64 overflow-hidden rounded-2xl bg-[#eceae3] sm:w-72 md:w-80">
          <AnimatePresence initial={false}>
            <motion.img
              key={member.name}
              src={teamPortraitStorageUrl(member.image)}
              alt={member.name}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: member.scale ?? 1.12 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover object-center"
              style={{ transformOrigin: `50% ${member.originY ?? 28}%` }}
            />
          </AnimatePresence>
          {/* index badge */}
          <span className="absolute right-3 top-3 rounded-full bg-black/35 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white backdrop-blur-sm">
            {String(active + 1).padStart(2, '0')} / {teamMembers.length}
          </span>
        </div>

        {/* Identity */}
        <div className="mt-6 h-16 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display text-3xl tracking-[-0.01em] text-[#111]">
                {member.name}
              </h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#999]">
                {member.role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Avatar rail */}
        <div className="mt-6 flex max-w-full flex-wrap items-center justify-center gap-2.5 px-4">
          {teamMembers.map((m, i) => (
            <button
              key={m.name}
              type="button"
              aria-label={m.name}
              onClick={() => { setActive(i); setPaused(true) }}
              className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full transition-all duration-300 ${
                i === active
                  ? 'scale-110 ring-2 ring-[#f97316] ring-offset-2 ring-offset-[#f4f1ea]'
                  : 'opacity-55 grayscale hover:opacity-100 hover:grayscale-0'
              }`}
            >
              <img
                src={teamPortraitStorageUrl(m.image)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover object-center"
                style={{ transform: `scale(${m.scale ?? 1.12})`, transformOrigin: `50% ${m.originY ?? 35}%` }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const About: React.FC = () => {
  return (
    <>
      <main id="about" className="pt-36 pb-24">
        {/* Intro */}
        <Container>
          <motion.div variants={reveal} initial="hidden" animate="show">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">
              About
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.02em] text-[#111] sm:text-6xl md:text-7xl">
              A studio built for the speed of{' '}
              <span className="text-[#f97316]">AI</span>.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#555]">
              Zeal Highlights is a Philippines-based video production agency
              serving clients in the US and around the world. We turn raw
              footage — or no footage at all — into polished, on-brand video:
              AI avatar ads, motion graphics, creator content, and product
              stories.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-16 grid grid-cols-2 gap-y-10 border-y border-[#e7e4dc] py-10 sm:grid-cols-4"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <span className="font-display text-4xl tracking-[-0.02em] text-[#111] sm:text-5xl">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#999]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </Container>

        {/* How we work */}
        <Container className="mt-28">
          <SectionHeading
            eyebrow="01 / How we work"
            title="Systems over heroics"
            description="Clear processes, team-based editing, and a hard quality gate — creative storytelling delivered with production discipline."
          />
          <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((item, i) => (
              <motion.div
                key={item.index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
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

        {/* Team */}
        <Container className="mt-28">
          <SectionHeading
            eyebrow="02 / Team"
            title="The people behind it"
            meta={
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#999]">
                {teamMembers.length} people
              </span>
            }
          />
          <TeamSpotlight />
        </Container>

      </main>

      <Footer />
    </>
  )
}

export default About
