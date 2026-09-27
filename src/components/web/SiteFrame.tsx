import React, { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { siteFull, siteHero, type Site } from './content'

/** Auto-scroll speed through the full-page capture, in CSS px per second. */
const SCROLL_SPEED = 70
const HOVER_RATE = 3

/**
 * A browser-chrome frame showing a site's real full-page capture.
 *
 * The 16:9 hero plate paints first; the tall full-page capture fades in over
 * it once decoded, then drifts slowly down the page while the frame is in
 * view (and faster on hover), easing back up at the end. With reduced motion
 * the capture never moves on its own — the viewport becomes a normal
 * scrollable box instead.
 */
const SiteFrame: React.FC<{ site: Site }> = ({ site }) => {
  const reduce = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const animRef = useRef<Animation | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [hover, setHover] = useState(false)
  const [animVersion, setAnimVersion] = useState(0)
  const inView = useInView(viewportRef, { amount: 0.55 })

  // A capture served from cache can finish before the handler is attached.
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  // Build (and rebuild on resize) the scroll animation once the capture is in.
  useEffect(() => {
    const img = imgRef.current
    const vp = viewportRef.current
    if (!loaded || reduce || !img || !vp || typeof img.animate !== 'function') return

    const build = () => {
      const prev = animRef.current
      const progress =
        prev && prev.effect ? (prev.effect.getComputedTiming().progress ?? 0) : 0
      prev?.cancel()
      const dist = img.offsetHeight - vp.clientHeight
      if (dist <= 4) {
        animRef.current = null
        return
      }
      const duration = Math.max(6000, (dist / SCROLL_SPEED) * 1000)
      const anim = img.animate(
        [{ transform: 'translateY(0px)' }, { transform: `translateY(${-dist}px)` }],
        {
          duration,
          delay: 700,
          endDelay: 1600,
          direction: 'alternate',
          iterations: Infinity,
          easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
        },
      )
      anim.pause()
      if (progress) anim.currentTime = 700 + progress * duration
      animRef.current = anim
      setAnimVersion((v) => v + 1)
    }

    build()
    let lastW = vp.clientWidth
    const ro = new ResizeObserver(() => {
      if (vp.clientWidth === lastW) return
      lastW = vp.clientWidth
      build()
    })
    ro.observe(vp)
    return () => {
      ro.disconnect()
      animRef.current?.cancel()
      animRef.current = null
    }
  }, [loaded, reduce])

  // Play while visible or hovered; hovering speeds it up.
  useEffect(() => {
    const anim = animRef.current
    if (!anim) return
    if (inView || hover) {
      anim.updatePlaybackRate(hover ? HOVER_RATE : 1)
      anim.play()
    } else {
      anim.pause()
    }
  }, [inView, hover, animVersion])

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* soft warm glow under the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] -bottom-6 top-[20%] rounded-[40px] bg-[#f97316]/20 opacity-0 blur-[60px] transition-opacity duration-700 group-hover:opacity-100"
      />
      <div className="relative overflow-hidden rounded-[18px] border border-black/[0.08] bg-white shadow-[0_30px_60px_-24px_rgba(17,17,17,0.22),0_8px_20px_-10px_rgba(17,17,17,0.12)] sm:rounded-[22px]">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#fbfaf8] px-3.5 py-2.5 sm:px-4 sm:py-3">
          <div className="flex shrink-0 gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex min-w-0 max-w-[60%] items-center justify-center gap-1.5 rounded-full bg-black/[0.045] px-3 py-1 sm:max-w-[320px] sm:flex-1">
            <svg aria-hidden viewBox="0 0 16 16" className="h-2.5 w-2.5 shrink-0 text-[#9a9690]" fill="currentColor">
              <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Z" />
            </svg>
            <span className="truncate text-[11px] font-medium text-[#6b6862]">{site.domain}</span>
          </div>
          <span className="w-[42px] shrink-0" aria-hidden />
        </div>

        {/* Viewport */}
        <div
          ref={viewportRef}
          className={`relative aspect-[16/9] bg-[#f1efea] ${
            reduce ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'
          }`}
          tabIndex={reduce ? 0 : undefined}
          aria-label={reduce ? `${site.name} homepage, scrollable` : undefined}
        >
          <img
            src={siteHero(site.id)}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <img
            ref={imgRef}
            src={siteFull(site.id)}
            alt={`Full homepage of ${site.name} (${site.domain}), designed and built by Zeal Dev`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`relative block h-auto w-full will-change-transform transition-opacity duration-700 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export default SiteFrame
