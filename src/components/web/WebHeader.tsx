import React, { useEffect, useState } from 'react'
import { CONTACT_URL } from './content'

export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'packages', label: 'Packages' },
  { id: 'process', label: 'Process' },
]

/** Smooth-scroll to an in-page section (instant when reduced motion is on). */
export const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

export const ZealMark: React.FC<{ className?: string }> = ({ className = 'h-7 w-7' }) => (
  <img src="/web/logo-zeal.png" alt="" aria-hidden className={`${className} object-contain`} />
)

const WebHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-5">
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border py-2 pl-3 pr-2 transition-all duration-300 sm:pl-4 ${
          scrolled
            ? 'border-black/[0.07] bg-white/85 shadow-[0_12px_40px_-18px_rgba(17,17,17,0.3)] backdrop-blur-md'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a
          href="#top"
          onClick={(e) => scrollToSection(e, 'top')}
          className="flex shrink-0 items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60"
          aria-label="Zeal Dev, back to top"
        >
          <ZealMark className="h-7 w-7" />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#111]">
            Zeal <span className="text-[#f97316]">Dev</span>
          </span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => scrollToSection(e, n.id)}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-black/[0.04] hover:text-[#111]"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <a
          href={CONTACT_URL}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#111] py-2 pl-4 pr-2 text-[13px] font-semibold text-white transition hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60"
        >
          Get a quote
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f97316] transition-transform duration-300 group-hover:translate-x-0.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </header>
  )
}

export default WebHeader
