import React, { useEffect } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import WebHeader, { NAV, ZealMark, scrollToSection } from '../components/web/WebHeader'
import ShowcaseVideo from '../components/web/ShowcaseVideo'
import SiteFrame from '../components/web/SiteFrame'
import { ActivityField } from '../components/web/ActivityField'
import { CLIENTS, ClientLogo } from '../components/Clients'
import {
  CONTACT_URL,
  EMAIL,
  FAQ,
  HUMAN_AI,
  MAIN_SITE_URL,
  MAX_DAYS,
  PACKAGES,
  PROCESS,
  SITES,
} from '../components/web/content'

/**
 * Zeal Dev — landing page for Zeal's website design & development arm.
 * Served at /web on the main domain and at / on web.zealhighlights.com
 * (see App.tsx). Self-contained: own header and footer, no main-site loader.
 */

const EASE = [0.22, 1, 0.36, 1] as const
const TITLE = 'Zeal Dev — Human developers, AI speed'
const DESCRIPTION =
  'Websites that look and feel like your brand, live in days, not months. Designed and built by real developers, sped up by AI.'
const CANONICAL = 'https://web.zealhighlights.com/'

// ---------------------------------------------------------------------------
// Head management while mounted
// ---------------------------------------------------------------------------

function useDocumentMeta() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = TITLE

    const restore: Array<() => void> = []
    const setAttr = (selector: string, attr: string, value: string, create: () => HTMLElement) => {
      let el = document.head.querySelector<HTMLElement>(selector)
      let created = false
      if (!el) {
        el = create()
        document.head.appendChild(el)
        created = true
      }
      const prev = el.getAttribute(attr)
      el.setAttribute(attr, value)
      const node = el
      restore.push(() => {
        if (created) node.remove()
        else if (prev !== null) node.setAttribute(attr, prev)
      })
    }
    const meta = (key: 'name' | 'property', name: string) => () => {
      const m = document.createElement('meta')
      m.setAttribute(key, name)
      return m
    }

    setAttr('meta[name="description"]', 'content', DESCRIPTION, meta('name', 'description'))
    setAttr('meta[property="og:title"]', 'content', TITLE, meta('property', 'og:title'))
    setAttr('meta[property="og:description"]', 'content', DESCRIPTION, meta('property', 'og:description'))
    setAttr('meta[name="twitter:title"]', 'content', TITLE, meta('name', 'twitter:title'))
    setAttr('meta[name="twitter:description"]', 'content', DESCRIPTION, meta('name', 'twitter:description'))
    setAttr('link[rel="canonical"]', 'href', CANONICAL, () => {
      const l = document.createElement('link')
      l.setAttribute('rel', 'canonical')
      return l
    })

    return () => {
      document.title = prevTitle
      restore.reverse().forEach((fn) => fn())
    }
  }, [])
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

const Arrow: React.FC<{ className?: string }> = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ExternalArrow: React.FC = () => (
  <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden>
    <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Text in the Zeal orange gradient. */
const Accent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-gradient-to-r from-[#ea580c] to-[#f97316] bg-clip-text text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">
    {children}
  </span>
)

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-3 py-1 text-[11px] font-semibold text-[#3a3a3a] shadow-[0_4px_14px_-8px_rgba(17,17,17,0.2)]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" aria-hidden />
    {children}
  </span>
)

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">{children}</p>
)

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, ease: EASE, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

const SectionTitle: React.FC<{
  eyebrow: string
  title: React.ReactNode
  lede?: React.ReactNode
  center?: boolean
}> = ({ eyebrow, title, lede, center }) => (
  <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#111] [text-wrap:balance] sm:text-[2.75rem] lg:text-[3.25rem]">
      {title}
    </h2>
    {lede && <p className="mt-5 text-base leading-relaxed text-[#666] sm:text-lg">{lede}</p>}
  </Reveal>
)

const PrimaryCta: React.FC<{ label?: string; size?: 'md' | 'lg' }> = ({ label = 'Get a quote', size = 'md' }) => (
  <a
    href={CONTACT_URL}
    className={`group inline-flex items-center gap-3 rounded-full bg-[#111] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(17,17,17,0.6)] transition hover:bg-[#262626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f2ed] ${
      size === 'lg' ? 'py-2.5 pl-7 pr-2.5 text-base' : 'py-2 pl-6 pr-2 text-[15px]'
    }`}
  >
    {label}
    <span
      className={`flex items-center justify-center rounded-full bg-gradient-to-r from-[#ea580c] to-[#fb923c] transition-transform duration-300 group-hover:translate-x-1 ${
        size === 'lg' ? 'h-10 w-10' : 'h-9 w-9'
      }`}
    >
      <Arrow />
    </span>
  </a>
)

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/** Zeal palette for the square-field backdrop: page cream → pale peach → deep orange. */
const FIELD_COLORS = {
  background: '#f4f2ed',
  heat: ['#f5ebe0', '#fbdcc0', '#fcc89c', '#fbb279', '#f99a55'],
} satisfies { background: string; heat: [string, string, string, string, string] }

// Fades into the copy at the top (as in the source) and dissolves gently into the showreel below.
const FIELD_MASK = 'linear-gradient(to bottom, transparent, #000 38%, #000 62%, rgba(0,0,0,0.55) 82%, transparent)'

const heroRise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const pill =
  'group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f2ed]'

const Hero: React.FC = () => (
  <section
    id="top"
    className="relative isolate flex min-h-[640px] scroll-mt-24 flex-col justify-center overflow-hidden px-5 pb-[30vh] pt-32 sm:min-h-[100svh] sm:px-8 sm:pb-[28vh] sm:pt-36"
  >
    {/* soft warm glow behind the headline */}
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-280px] -z-20 h-[620px] w-[900px] max-w-[160vw] -translate-x-1/2 rounded-full bg-[#f97316]/[0.10] blur-[140px]" />

    {/* Square field: a rising skyline of cells behind the lower half of the hero.
        It sits beneath the copy (-z-10), so it only receives the pointer where nothing covers it. */}
    <div
      aria-hidden
      style={{ maskImage: FIELD_MASK, WebkitMaskImage: FIELD_MASK }}
      className="absolute inset-x-0 bottom-0 -z-10 h-[34%] md:h-[38%]"
    >
      <ActivityField {...FIELD_COLORS} className="h-full w-full" cellSize={9} bottomInset={60} />
    </div>

    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
      className="relative mx-auto w-full max-w-6xl text-center"
    >
      <motion.a
        variants={heroRise}
        href={CONTACT_URL}
        className="group mb-8 inline-flex max-w-full items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-[13px] text-[#666] shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] transition-colors hover:text-[#111]"
      >
        <span className="shrink-0 rounded-full bg-[#ffedd5] px-2 py-0.5 text-[11px] font-semibold text-[#ea580c]">
          Now booking
        </span>
        <span className="truncate">New builds start this month</span>
        <Arrow className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </motion.a>

      <motion.h1
        variants={heroRise}
        className="text-[clamp(2.1rem,8.6vw,6.75rem)] font-bold leading-[1] tracking-[-0.045em] text-[#111]"
      >
        <span className="whitespace-nowrap">
          Human developers.
          <span aria-hidden className="web-caret ml-[0.05em] inline-block h-[0.8em] w-[0.055em] translate-y-[0.06em] rounded-[1px] bg-[#f97316] align-baseline" />
        </span>
        <br />
        <span className="text-[#f97316]">AI speed.</span>
      </motion.h1>

      <motion.p
        variants={heroRise}
        className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[#6b6862] [text-wrap:balance] sm:text-lg"
      >
        A website that looks and feels like your brand, live in days, not months. Real designers
        and developers craft every page, and AI takes the busywork off their hands.
      </motion.p>

      <motion.div variants={heroRise} className="mt-9 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
        <a href={CONTACT_URL} className={`${pill} bg-[#111] text-white hover:bg-[#2a2a2a]`}>
          Get a quote
          <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <a
          href="#work"
          onClick={(e) => scrollToSection(e, 'work')}
          className={`${pill} bg-black/[0.06] text-[#111] hover:bg-black/[0.1]`}
        >
          See the work
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden>
            <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>
    </motion.div>
  </section>
)

/** The showreel sits directly under the hero, clear of the square field. */
const Showreel: React.FC = () => (
  <section aria-label="Showreel" className="relative z-10 px-5 sm:px-8">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.6 }}
    >
      <ShowcaseVideo />
    </motion.div>
  </section>
)

/** How the team and AI split the work — the proof behind the headline. */
const HumanAi: React.FC = () => (
  <section aria-labelledby="human-ai-title" className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <SectionTitle
        eyebrow="How we work"
        title={
          <span id="human-ai-title">
            People lead.<br />
            <Accent>AI speeds it up.</Accent>
          </span>
        }
        lede="Every Zeal site is designed and built by real people who get to know your brand. AI is a tool in their hands, never a replacement for them. That’s how you get a site that feels like yours, faster."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
        {HUMAN_AI.map((col, i) => (
          <Reveal key={col.title} delay={i * 0.1} className="h-full">
            <div
              className={`h-full rounded-[22px] border p-6 sm:p-8 ${
                col.human
                  ? 'border-black/[0.07] bg-white shadow-[0_20px_50px_-34px_rgba(17,17,17,0.35)]'
                  : 'border-[#f97316]/25 bg-[#fff7f0]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    col.human ? 'bg-[#111] text-white' : 'bg-gradient-to-br from-[#ea580c] to-[#fdba74] text-white'
                  }`}
                  aria-hidden
                >
                  {col.human ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="12" cy="8" r="3.5" />
                      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
                    </svg>
                  )}
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#111]">{col.title}</h3>
              </div>
              <ul className="mt-6 space-y-3.5">
                {col.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#444]">
                    <span className={`mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full ${col.human ? 'bg-[#111]' : 'bg-[#f97316]'}`} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-8 text-center text-sm text-[#888]">
          The result: a site that’s unmistakably yours, live in 7 to 21 business days depending on the package.
        </p>
      </Reveal>
    </div>
  </section>
)

/** Reuses the main site's client marquee — the wider Zeal team's partners. */
const Trusted: React.FC = () => (
  <section className="border-y border-[#e7e4dc] py-10 sm:py-12" aria-label="Brands Zeal works with">
    <p className="mb-7 px-5 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">
      The wider Zeal team works with brands like
    </p>
    <div
      className="marquee-pause web-marquee relative overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div className="flex w-max animate-marquee">
        {[0, 1].map((track) => (
          <div key={track} className="flex items-center" aria-hidden={track === 1}>
            {CLIENTS.map((client) => (
              <ClientLogo key={`${track}-${client.name}`} client={client} />
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
)

const Work: React.FC = () => (
  <section id="work" className="scroll-mt-24 py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <SectionTitle
        eyebrow="01 / Work"
        title={
          <>
            Five sites. Five industries.{' '}
            <span className="text-[#a9a59d]">Each one</span> <Accent>unmistakably theirs.</Accent>
          </>
        }
        lede="Real, live websites our team designed and built, for five very different audiences. Each frame drifts through the full page (hover to speed it up), then visit the real thing."
      />

      <ol className="mt-16 space-y-20 sm:mt-24 sm:space-y-28 lg:space-y-36">
        {SITES.map((site, i) => {
          const flip = i % 2 === 1
          return (
            <li
              key={site.id}
              id={site.id}
              className="grid scroll-mt-28 grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14"
            >
              <Reveal className={`lg:col-span-8 ${flip ? 'lg:order-2' : ''}`}>
                <SiteFrame site={site} />
              </Reveal>

              <Reveal delay={0.1} className={`lg:col-span-4 ${flip ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs tabular-nums text-[#b0aca4]">
                    {String(i + 1).padStart(2, '0')} / {String(SITES.length).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 bg-[#e3e0d8]" />
                </div>
                <div className="mt-5">
                  <Chip>{site.industry}</Chip>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-[#111] sm:text-[1.75rem]">
                  {site.name}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#666]">{site.description}</p>
                <a
                  href={`https://${site.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[#111]"
                >
                  <span className="border-b border-[#d8d4c9] pb-0.5 transition-colors group-hover:border-[#f97316]">
                    Visit {site.domain}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white transition-all duration-300 group-hover:border-[#f97316] group-hover:bg-[#f97316] group-hover:text-white">
                    <ExternalArrow />
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </div>
  </section>
)

const DayBar: React.FC<{ days: number }> = ({ days }) => (
  <div className="flex gap-[3px]" aria-hidden>
    {Array.from({ length: MAX_DAYS }, (_, d) => (
      <motion.span
        key={d}
        initial={{ scaleY: 0.35, opacity: 0.4 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.2 + d * 0.025 }}
        className={`h-5 flex-1 origin-bottom rounded-[2px] ${
          d < days ? 'bg-gradient-to-t from-[#ea580c] to-[#fdba74]' : 'bg-black/[0.07]'
        }`}
      />
    ))}
  </div>
)

const Packages: React.FC = () => (
  <section id="packages" className="scroll-mt-24 border-t border-[#e7e4dc] bg-[#f8f7f4] py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <SectionTitle
        eyebrow="02 / Packages"
        title={
          <>
            Pick a starting point. <span className="text-[#a9a59d]">We’ll shape it</span>{' '}
            <Accent>around you.</Accent>
          </>
        }
        lede="Clear scope and a clear timeline, measured in days. Our team handles the design decisions and AI handles the busywork, so even a full online store goes live in about a month. Every quote is tailored, so tell us what you need."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-3 lg:gap-6">
        {PACKAGES.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className="h-full">
            <article
              className={`relative flex h-full flex-col rounded-[22px] border bg-white p-6 sm:p-7 ${
                p.featured
                  ? 'border-[#f97316]/35 shadow-[0_30px_60px_-30px_rgba(249,115,22,0.45)]'
                  : 'border-black/[0.07] shadow-[0_20px_50px_-34px_rgba(17,17,17,0.35)]'
              }`}
            >
              {p.featured && (
                <span className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#f97316] to-transparent" aria-hidden />
              )}
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#111]">{p.name}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#b0aca4]">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-3 min-h-[3rem] text-sm leading-relaxed text-[#666]">{p.summary}</p>

              <div className="mt-6 rounded-2xl bg-[#f6f4f0] p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-medium tabular-nums tracking-[-0.03em] text-[#111]">{p.days}</span>
                  <span className="text-sm font-medium text-[#666]">business days</span>
                </div>
                <div className="mt-3">
                  <DayBar days={p.days} />
                </div>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] text-[#333]">
                    <svg viewBox="0 0 16 16" className="mt-[3px] h-4 w-4 shrink-0 text-[#f97316]" fill="none" aria-hidden>
                      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeOpacity="0.35" />
                      <path d="m5 8.2 2 2 4-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={CONTACT_URL}
                className={`group mt-8 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60 ${
                  p.featured
                    ? 'bg-[#111] text-white hover:bg-[#262626]'
                    : 'border border-black/10 bg-white text-[#111] hover:border-black/25'
                }`}
              >
                Get a quote
                <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-8 text-center text-sm text-[#888]">
          Need extra pages or ongoing maintenance? Both are available. Just mention it when you ask for a quote.
        </p>
      </Reveal>
    </div>
  </section>
)

const Process: React.FC = () => (
  <section id="process" className="scroll-mt-24 py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <SectionTitle
        eyebrow="03 / Process"
        title={
          <>
            Three steps, <Accent>no surprises.</Accent>
          </>
        }
        lede="A real person leads your project from first sketch to launch, with AI speeding up the drafting and the build. You approve every stage before we move on, with two revision rounds on the design and two on the build."
      />

      <ol className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {/* connecting line (desktop) */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute left-6 right-[calc(33.333%-1.5rem)] top-6 hidden h-px origin-left bg-gradient-to-r from-[#f97316] via-[#fdba74] to-[#e3e0d8] md:block"
        />
        {PROCESS.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.12 }}
            className="relative list-none"
          >
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-white text-sm font-semibold tabular-nums text-[#111] shadow-[0_8px_20px_-12px_rgba(17,17,17,0.35)]">
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-[#111]">{step.title}</h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[#666]">{step.body}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#888]">
                {step.rounds > 0 ? (
                  <>
                    <span className="flex gap-1" aria-hidden>
                      {Array.from({ length: step.rounds }, (_, r) => (
                        <span key={r} className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
                      ))}
                    </span>
                    {step.rounds} revision rounds
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-4 rounded-full bg-gradient-to-r from-[#ea580c] to-[#fdba74]" aria-hidden />
                    You’re live
                  </>
                )}
              </p>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
)

const Faq: React.FC = () => (
  <section className="border-t border-[#e7e4dc] py-24 sm:py-28" aria-labelledby="faq-title">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
      <Reveal className="lg:col-span-4">
        <Eyebrow>04 / Questions</Eyebrow>
        <h2 id="faq-title" className="mt-4 text-[2rem] font-medium leading-[1.08] tracking-[-0.03em] text-[#111] sm:text-[2.5rem]">
          Good to know.
        </h2>
      </Reveal>
      <div className="lg:col-span-8">
        {FAQ.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.05}>
            <details className="group border-b border-[#e3e0d8] py-5 first:border-t [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-[#111] sm:text-lg">
                {f.q}
                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white transition-colors group-open:border-[#f97316] group-open:bg-[#f97316] group-open:text-white">
                  <span className="absolute h-[1.5px] w-3 rounded bg-current" />
                  <span className="absolute h-3 w-[1.5px] rounded bg-current transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="mt-3 max-w-2xl pr-12 text-[15px] leading-relaxed text-[#666]">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

const FinalCta: React.FC = () => (
  <section className="relative overflow-hidden px-5 pb-24 sm:px-8 sm:pb-32">
    <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-black/[0.06] bg-white px-6 py-16 text-center shadow-[0_40px_80px_-50px_rgba(17,17,17,0.45)] sm:rounded-[36px] sm:px-12 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-[360px] w-[720px] max-w-[180%] -translate-x-1/2 rounded-full bg-[#f97316]/20 blur-[100px]" />
      <div className="relative">
        <ZealMark className="mx-auto h-10 w-10" />
        <h2 className="mx-auto mt-7 max-w-3xl text-[2rem] font-medium leading-[1.08] tracking-[-0.03em] text-[#111] [text-wrap:balance] sm:text-[3rem] lg:text-[3.5rem]">
          Let’s build a site that feels <Accent>like yours.</Accent>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#666] sm:text-lg">
          Tell us about your brand and what the site needs to do. Our team will come back with a package, a timeline and a quote.
        </p>
        <div className="mt-9 flex flex-col items-center gap-5">
          <PrimaryCta label="Get a quote" size="lg" />
          <a href={`mailto:${EMAIL}`} className="text-sm text-[#888] transition-colors hover:text-[#111]">
            or email <span className="border-b border-[#d8d4c9] pb-0.5 font-medium text-[#555]">{EMAIL}</span>
          </a>
        </div>
      </div>
    </Reveal>
  </section>
)

const WebFooter: React.FC = () => (
  <footer className="border-t border-[#e3e0d8] bg-white">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <ZealMark className="h-8 w-8" />
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#111]">
            Zeal <span className="text-[#f97316]">Dev</span>
          </p>
          <p className="text-xs text-[#888]">
            Website design &amp; development by{' '}
            <a href={MAIN_SITE_URL} className="underline decoration-[#d8d4c9] underline-offset-2 hover:text-[#111]">
              Zeal Highlights
            </a>
          </p>
        </div>
      </div>
      <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#555]">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={(e) => scrollToSection(e, n.id)} className="hover:text-[#111]">
            {n.label}
          </a>
        ))}
        <a href={`mailto:${EMAIL}`} className="hover:text-[#111]">
          {EMAIL}
        </a>
      </nav>
    </div>
    <div className="border-t border-[#efece6]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-[#999] sm:flex-row sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Zeal Highlights. All rights reserved.</p>
        <p>To God be the Glory!</p>
      </div>
    </div>
  </footer>
)

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const WebLanding: React.FC = () => {
  useDocumentMeta()

  return (
    <MotionConfig reducedMotion="user">
      {/* Caret blink + marquee, both off under reduced motion, without touching global CSS */}
      <style>{`@keyframes web-caret-blink{0%,45%{opacity:1}50%,95%{opacity:0}100%{opacity:1}}.web-caret{animation:web-caret-blink 1.1s step-end infinite}@media (prefers-reduced-motion: reduce){.web-marquee .animate-marquee,.web-caret{animation:none}}`}</style>
      <div className="relative min-h-screen overflow-x-clip bg-[#f4f2ed] font-['Montserrat',sans-serif] text-[#111] antialiased">
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#111] focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to work
        </a>
        <WebHeader />
        <main>
          <Hero />
          <Showreel />
          <HumanAi />
          <Trusted />
          <Work />
          <Packages />
          <Process />
          <Faq />
          <FinalCta />
        </main>
        <WebFooter />
      </div>
    </MotionConfig>
  )
}

export default WebLanding
