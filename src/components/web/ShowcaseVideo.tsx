import React, { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const SRC = '/web/showcase.mp4'
const POSTER = '/web/showcase-poster.webp'

/**
 * The 37s Zeal Dev showreel in a rounded device frame.
 *
 * Sound is ON by default: on mount it tries to play unmuted. If the browser's
 * autoplay policy refuses, it falls back to muted autoplay and unmutes on the
 * visitor's first real interaction (pointerdown / keydown / touchend — scroll
 * doesn't count as user activation). Once the visitor mutes it themselves it
 * is never auto-unmuted again. The <video> has no `muted` attribute in JSX;
 * muting is managed through the ref so an unmuted attempt is really possible.
 *
 * Controls live in a caption bar below the frame so nothing sits on top of
 * the footage. Pauses when scrolled out of view and resumes when back (unless
 * the visitor paused it). With reduced motion it neither autoplays nor tilts —
 * the poster shows until the visitor presses play.
 */
const ACTIVATION_EVENTS = ['pointerdown', 'keydown', 'touchend'] as const

const ShowcaseVideo: React.FC = () => {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  // true once the visitor paused on purpose — scrolling back shouldn't resume
  const userPaused = useRef(false)
  // true once the visitor muted on purpose — never auto-unmute after that
  const userMuted = useRef(false)
  const inView = useRef(false)
  // removes the pending "unmute on first interaction" listeners, if any
  const clearActivation = useRef<() => void>(() => {})

  // Gentle 3D settle as the frame scrolls up into place.
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'center center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])

  const unmute = () => {
    const v = videoRef.current
    if (!v) return
    clearActivation.current()
    v.muted = false
    setMuted(false)
    if (inView.current && v.paused && !userPaused.current) v.play().catch(() => {})
  }

  // Arm one-time listeners that restore sound on the visitor's first interaction.
  const armActivation = () => {
    clearActivation.current()
    const onActivate = (e: Event) => {
      // Presses on the player's own controls are handled by their click handlers.
      if (e.target instanceof Node && wrapRef.current?.contains(e.target)) return
      if (!userMuted.current) unmute()
      else clearActivation.current()
    }
    ACTIVATION_EVENTS.forEach((t) => window.addEventListener(t, onActivate, { passive: true }))
    clearActivation.current = () => {
      ACTIVATION_EVENTS.forEach((t) => window.removeEventListener(t, onActivate))
      clearActivation.current = () => {}
    }
  }

  /**
   * Every automatic start goes through here: try with sound, and if the
   * autoplay policy refuses, play muted and wait for the first interaction.
   * A play() interrupted by our own pause (AbortError) is not a refusal.
   */
  const autoStart = () => {
    const v = videoRef.current
    if (!v) return
    if (userMuted.current || v.muted) {
      v.play().catch(() => {})
      return
    }
    v.play().catch((err: DOMException) => {
      if (err?.name !== 'NotAllowedError' || !inView.current) return
      v.muted = true
      setMuted(true)
      v.play().catch(() => {})
      armActivation()
    })
  }

  useEffect(() => () => clearActivation.current(), [])

  // Start (with sound when allowed) whenever the frame is on screen; pause off-screen.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        if (!entry.isIntersecting) {
          if (!v.paused) v.pause()
        } else if (!userPaused.current && (!reduce || v.currentTime > 0)) {
          autoStart()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(v)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      userPaused.current = false
      // a deliberate press is user activation — bring sound back if the policy muted it
      if (v.muted && !userMuted.current) unmute()
      v.play().catch(() => {})
    } else {
      userPaused.current = true
      v.pause()
    }
  }

  /** Clicking the footage itself: first click restores policy-muted sound, then play/pause. */
  const onVideoClick = () => {
    const v = videoRef.current
    if (v && v.muted && !userMuted.current && !v.paused) {
      unmute()
      return
    }
    togglePlay()
  }

  const toggleSound = () => {
    const v = videoRef.current
    if (!v) return
    if (v.muted) {
      userMuted.current = false
      userPaused.current = false
      unmute()
      v.play().catch(() => {})
    } else {
      userMuted.current = true
      clearActivation.current()
      v.muted = true
      setMuted(true)
    }
  }

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-5xl [perspective:1600px]">
      {/* warm glow pooled under the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[10%] bottom-2 top-1/3 rounded-full bg-[#f97316]/25 blur-[90px]"
      />
      <motion.div
        style={reduce ? undefined : { rotateX, scale, transformOrigin: '50% 100%' }}
        className="relative rounded-[22px] border border-black/[0.07] bg-white/80 p-1.5 shadow-[0_40px_80px_-30px_rgba(17,17,17,0.35),0_10px_24px_-12px_rgba(17,17,17,0.15)] backdrop-blur sm:rounded-[30px] sm:p-2.5"
      >
        <div className="relative overflow-hidden rounded-[16px] bg-[#e9e6df] sm:rounded-[22px]">
          <video
            ref={videoRef}
            src={SRC}
            poster={POSTER}
            loop
            playsInline
            preload={reduce ? 'none' : 'auto'}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            onClick={onVideoClick}
            aria-label="Zeal Dev showreel: five websites across civic, education, ministry, construction and creative industries"
            className="block aspect-video w-full cursor-pointer object-cover"
          />
        </div>

        {/* Caption bar — controls sit under the footage, never on it */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2.5 pb-1 pt-2.5 sm:px-3 sm:pb-1.5 sm:pt-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              {playing && !reduce && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f97316] opacity-60" />
              )}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${playing ? 'bg-[#f97316]' : 'bg-[#c9c5bc]'}`} />
            </span>
            <p className="truncate text-xs font-medium text-[#6b6862] sm:text-[13px]">
              Five sites, five industries <span className="text-[#b0aca4]">· 0:37</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? 'Pause showreel' : 'Play showreel'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#111] transition hover:border-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60"
            >
              {playing ? (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                  <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
                  <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden>
                  <path d="M4 2.8v10.4a.8.8 0 0 0 1.2.7l8.4-5.2a.8.8 0 0 0 0-1.4L5.2 2.1a.8.8 0 0 0-1.2.7Z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={muted}
              aria-label={muted ? 'Unmute showreel' : 'Mute showreel'}
              className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60 sm:text-[13px] ${
                muted
                  ? 'bg-[#111] text-white hover:bg-[#2a2a2a]'
                  : 'border border-[#f97316]/40 bg-[#fff4ec] text-[#c2410c] hover:bg-[#ffeadb]'
              }`}
            >
              {muted ? (
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 8v4h3l4 3.5v-11L6 8H3Z" fill="currentColor" stroke="none" />
                  <path d="M13.5 7.5a3.5 3.5 0 0 1 0 5M15.5 5a7 7 0 0 1 0 10" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                  <path d="M3 8v4h3l4 3.5v-11L6 8H3Z" fill="currentColor" stroke="none" />
                  <path d="m13.5 8 4 4m0-4-4 4" />
                </svg>
              )}
              {muted ? (userMuted.current ? 'Unmute' : 'Tap for sound') : 'Mute'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ShowcaseVideo
