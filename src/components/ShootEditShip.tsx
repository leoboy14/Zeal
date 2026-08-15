import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useScroll, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

interface ShipCard {
  id: string
  label: string
  stat: string
  statSub: string
  thumbnail: string
  /** muted clip that autoplays while the card is open */
  video: string
  /** gradient backdrop shown behind the media */
  bg: string
  sample?: boolean
}

const CARDS: ShipCard[] = [
  {
    id: 'ai-ugc',
    label: 'AI UGC',
    stat: '0',
    statSub: 'SHOOTS NEEDED',
    thumbnail: '/thumbnails/greg-weiss-elevator-pitch.webp',
    video: 'https://vz-d016ccde-737.b-cdn.net/9f8e6983-4bef-4014-9132-96b9a34d3414/play_720p.mp4',
    bg: 'linear-gradient(180deg, #1a1a1f 0%, #0d0d10 100%)',
  },
  {
    id: 'short-form',
    label: 'Short-form',
    stat: '9:16',
    statSub: 'FEED-NATIVE',
    thumbnail: '/thumbnails/austin-reed-motion-graphics.webp',
    video: 'https://vz-d016ccde-737.b-cdn.net/b4566447-470a-44e3-b6e7-e39b78f2cb55/play_720p.mp4',
    bg: 'linear-gradient(180deg, #bfe3e0 0%, #6b4a30 100%)',
    sample: true,
  },
  {
    id: 'brand-films',
    label: 'UGC ads',
    stat: '100%',
    statSub: 'REAL PEOPLE',
    thumbnail: '/thumbnails/honda-after-effects.webp',
    video: 'https://vz-d016ccde-737.b-cdn.net/078d1860-053e-46ac-bf0b-236527b7ddd3/play_720p.mp4',
    bg: 'linear-gradient(180deg, #f3cdda 0%, #123a30 100%)',
  },
  {
    id: 'claymation',
    label: 'Claymotion',
    stat: '48h',
    statSub: 'TURNAROUND',
    thumbnail: '/thumbnails/bioblade-plantar-hook.webp',
    video: 'https://vz-d016ccde-737.b-cdn.net/8110e582-b724-41fd-a700-5a2d5b4f9a71/play_720p.mp4',
    bg: 'linear-gradient(180deg, #f0dcc0 0%, #1c2533 100%)',
  },
]

const STATS = [
  { value: '500+', label: 'videos shipped' },
  { value: '10+', label: 'brand partners' },
  { value: '24/7', label: 'support' },
]

// Partner / client wordmarks — swap for real <img> logos when assets land.
const PARTNERS = [
  'Tattuds',
  'Bioblade',
  'Claymotion',
  'Balloon Boutique',
  'Smart Cities Network',
  'ABCTeachy',
  'VRef',
]

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 * i },
  }),
}

const ShootEditShip: React.FC = () => {
  const [active, setActive] = useState(0) // AI UGC open by default
  const [fullscreen, setFullscreen] = useState<number | null>(null)

  // The hero pins briefly while scroll steps through the four cards;
  // hover / focus / click still override at any moment.
  const pinRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p <= 0 || p >= 1) return
    setActive(Math.min(CARDS.length - 1, Math.floor(p * CARDS.length)))
  })

  // Reminder text cloud: trails beside the pointer anywhere in the hero —
  // visitors learn the cards are clickable before they even reach them.
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const cloudX = useSpring(cursorX, { stiffness: 250, damping: 25 })
  const cloudY = useSpring(cursorY, { stiffness: 250, damping: 25 })
  const [cloudOn, setCloudOn] = useState(false)
  const cloudTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep the reminder clear of the floating navbar at the top of the viewport
  const CLOUD_TOP_LIMIT = 150

  const flashCloud = (e: React.MouseEvent) => {
    if (e.clientY < CLOUD_TOP_LIMIT) return
    // jump (not spring) to the entry point so the cloud doesn't fly in from a corner
    cursorX.jump(e.clientX + 18)
    cursorY.jump(e.clientY + 20)
    setCloudOn(true)
    if (cloudTimer.current) clearTimeout(cloudTimer.current)
    cloudTimer.current = setTimeout(() => setCloudOn(false), 3000)
  }

  // Close the lightbox on Escape
  useEffect(() => {
    if (fullscreen === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen])

  return (
    <div ref={pinRef} className="relative" style={{ height: 'calc(100vh + 1200px)' }}>
    <section
      onMouseMove={(e) => {
        if (e.clientY < CLOUD_TOP_LIMIT) { setCloudOn(false); return }
        if (!cloudOn && cloudTimer.current === null) flashCloud(e)
        cursorX.set(e.clientX + 18); cursorY.set(e.clientY + 20)
      }}
      onMouseEnter={flashCloud}
      onMouseLeave={() => { if (cloudTimer.current) clearTimeout(cloudTimer.current); setCloudOn(false) }}
      className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-[#f4f2ed] text-[#111]"
    >
      {/* Atmosphere: warm glow + film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 -top-48 h-[640px] w-[640px] rounded-full bg-[#f97316]/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-[#1a2533]/[0.06] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 sm:px-8 pt-24 sm:pt-28 pb-8 sm:pb-10">
        <div className="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Left — copy */}
          <div className="max-w-xl">
            <h1 className="font-montserrat font-extrabold leading-[0.92] tracking-[-0.03em] text-[#111]">
              <span className="block">
                <motion.span
                  className="-ml-[0.06em] block text-6xl sm:text-7xl lg:text-[7rem] will-change-transform"
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                >
                  Editing
                </motion.span>
              </span>
              <span className="block py-1">
                <motion.span
                  className="block text-xl sm:text-2xl lg:text-3xl font-medium tracking-[-0.01em] text-[#8a8a82] will-change-transform"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
                >
                  at the speed of
                </motion.span>
              </span>
              <span className="block">
                <motion.span
                  className="-ml-[0.06em] block text-6xl sm:text-7xl lg:text-[7rem] text-[#f97316] will-change-transform"
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.36 }}
                >
                  AI.
                </motion.span>
              </span>
            </h1>

            <motion.p
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-5 max-w-md text-lg leading-relaxed text-[#666] sm:text-xl"
            >
              From raw to ready,{' '}
              <span className="font-semibold text-[#111]">10&times; faster</span>.
            </motion.p>

            {/* Single understated CTA — the one orange touch */}
            <motion.div
              custom={2}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-8"
            >
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 text-base font-semibold text-[#111]"
                >
                  <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-[#111]">
                    Start a project
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f97316] text-white transition-transform duration-300 group-hover:translate-x-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 text-base font-medium text-[#666] transition-colors hover:text-[#111]"
                >
                  <span className="border-b border-[#d8d4c9] pb-0.5 transition-colors group-hover:border-[#111]">
                    See the work
                  </span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={3}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-8 flex items-center gap-6 sm:gap-8"
            >
              {STATS.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <span className="h-8 w-px bg-[#dcd9d0]" />}
                  <div>
                    <div className="font-montserrat font-extrabold text-2xl sm:text-3xl tracking-tight text-[#111]">
                      {s.value}
                    </div>
                    <div className="mt-0.5 text-xs sm:text-sm text-[#888]">
                      {s.label}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* Right — expanding accordion (active card locked to 9:16) */}
          <motion.div
            className="flex h-[clamp(320px,42vh,420px)] justify-center gap-3 lg:h-[clamp(360px,46vh,480px)]"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
          >
            {CARDS.map((card, i) => {
              const isActive = active === i
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => (isActive ? setFullscreen(i) : setActive(i))}
                  transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                  layoutId={fullscreen === null ? `hero-card-${i}` : undefined}
                  className={`group relative h-full overflow-hidden rounded-[26px] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60 ${
                    isActive ? 'flex-none' : 'flex-1 min-w-[44px] max-w-[64px]'
                  }`}
                  style={
                    isActive
                      ? { background: card.bg, aspectRatio: '9 / 16' }
                      : { background: card.bg }
                  }
                  aria-label={isActive ? `Play ${card.label} reel fullscreen` : `Show ${card.label}`}
                >
                  {/* Thumbnail (always present as instant poster) */}
                  <img
                    src={card.thumbnail}
                    alt={card.label}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                    style={{ opacity: isActive ? 0 : 0.55 }}
                  />
                  {/* Video plays only while the card is open */}
                  {isActive && (
                    <video
                      key={card.video}
                      src={card.video}
                      poster={card.thumbnail}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}

                  {/* Dark base so labels/stats always read */}
                  <div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a120e] to-transparent transition-all duration-500"
                    style={{ height: isActive ? '55%' : '100%' }}
                  />

                  {/* Collapsed: vertical label */}
                  {!isActive && (
                    <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-white [writing-mode:vertical-rl] rotate-180 drop-shadow">
                      {card.label}
                    </span>
                  )}

                  {/* Expanded: label only */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                      className="absolute inset-x-0 bottom-0 p-6"
                    >
                      <span className="font-montserrat font-bold text-2xl sm:text-3xl text-white">
                        {card.label}
                      </span>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </div>

        {/* Partner logos */}
        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-6 border-t border-[#e7e4dc] pt-5 sm:mt-8"
        >
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">
            Trusted by brands &amp; founders shipping every week
          </p>
          <div
            className="marquee-pause relative overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
            }}
          >
            <div className="flex w-max animate-marquee">
              {[0, 1].map((track) => (
                <div key={track} className="flex items-center" aria-hidden={track === 1}>
                  {PARTNERS.map((name) => (
                    <span
                      key={`${track}-${name}`}
                      className="shrink-0 whitespace-nowrap px-8 sm:px-10 font-montserrat text-lg sm:text-xl font-bold tracking-tight text-[#9a978d] transition-colors duration-300 hover:text-[#111]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen video lightbox */}
      {createPortal(
      <AnimatePresence>
        {fullscreen !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setFullscreen(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setFullscreen(null)}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
            <motion.div
              layoutId={`hero-card-${fullscreen}`}
              transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              onClick={(e) => e.stopPropagation()}
              className="aspect-[9/16] h-[88vh] max-w-[95vw] overflow-hidden rounded-2xl bg-black shadow-2xl"
            >
              <video
                key={CARDS[fullscreen].video}
                src={CARDS[fullscreen].video}
                poster={CARDS[fullscreen].thumbnail}
                controls
                autoPlay
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      , document.body)}
      {/* Reminder cloud — follows the pointer across the hero (desktop only) */}
      <AnimatePresence>
        {cloudOn && fullscreen === null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none fixed left-0 top-0 z-[90] hidden lg:block"
            style={{ x: cloudX, y: cloudY }}
          >
            <span className="flex items-center gap-2 rounded-full bg-[#111]/90 py-2 pl-3 pr-4 text-white shadow-lg ring-1 ring-white/15 backdrop-blur-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M8 5v14l11-7-11-7z" fill="#f97316" />
              </svg>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Click to watch fullscreen</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
    </div>
  )
}

export default ShootEditShip
