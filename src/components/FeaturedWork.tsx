import React, { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

interface Project {
  title: string
  category: string
  thumbnail: string
  video: string
  link: string
  isVertical: boolean
}

import { videoProjects } from '../lib/videoData'
import { Container, SectionHeading } from './ui/section'

const FeaturedWork: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [railProgress, setRailProgress] = useState(4)

  const onRailScroll = () => {
    const el = railRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setRailProgress(max > 0 ? Math.max(4, (el.scrollLeft / max) * 100) : 4)
  }

  /** Drag-to-scroll: snap is disabled during the drag so it doesn't fight the pointer. */
  const onRailPointerDown = (e: React.PointerEvent) => {
    const el = railRef.current
    if (!el || e.pointerType !== 'mouse') return
    const startX = e.clientX
    const startScroll = el.scrollLeft
    let dragged = false
    el.style.scrollSnapType = 'none'
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      if (Math.abs(dx) > 4) dragged = true
      el.scrollLeft = startScroll - dx
    }
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      el.style.scrollSnapType = ''
      // swallow the click that follows a real drag so cards don't open
      if (dragged) {
        const block = (ce: Event) => { ce.stopPropagation(); ce.preventDefault() }
        el.addEventListener('click', block, { capture: true, once: true })
        setTimeout(() => el.removeEventListener('click', block, { capture: true } as EventListenerOptions), 0)
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // Separate landscape films from vertical reels
  const landscapeFilms = videoProjects.filter((p: Project) => !p.isVertical)
  const verticalReels = videoProjects.filter((p: Project) => p.isVertical)

  // One continuous strip: verticals carry the rhythm, landscape films breathe at wide intervals
  const railProjects = React.useMemo(() => {
    // Hand-tuned order: the same face (Greg appears in three pieces) and the
    // same category never sit within one glance of each other; wide films
    // land at positions 4 and 10 as breathing room.
    const order = [
      'MODERN RESUME LENS',   // AI UGC (Greg avatar)
      'BIOBLADE',             // Claymation
      'AUSTIN REED',          // Talking Head
      'GAINIUM',              // SaaS Demo — wide
      'HONDA',                // UGC
      'GREG WEISS PITCH',     // AI UGC (Greg avatar)
      'ONEDASH HEALTHCARE',   // Ad
      'VREF',                 // Talking Head
      'MISSING COMPONENTS',   // Ad
      'GREG WEISS',           // AI Avatar Course — wide (Greg avatar)
      'FINANCE NEWS',         // Talking Head
    ]
    const byTitle = new Map(videoProjects.map((p) => [p.title, p]))
    const rail = order.map((t) => byTitle.get(t)).filter(Boolean) as Project[]
    // Anything new that isn't in the hand-tuned list still shows up at the end
    videoProjects.forEach((p) => { if (!rail.includes(p)) rail.push(p) })
    return rail
  }, [])

  return (
    <section
      id="work"
      className="relative z-20 border-t border-[#e7e4dc] bg-[#f4f2ed] py-20 md:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="01 / The reel"
          title="Built for the feed — and beyond"
          description="Shorts, ads, and long-form in one continuous strip. Drag through it."
          meta={
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#999]">
              {videoProjects.length} pieces
            </span>
          }
        />
      </Container>

      {/* Vertical reels — draggable rail, staggered baseline, snap-scroll */}
      <div className="relative mt-12">
        <div
          ref={railRef}
          onScroll={onRailScroll}
          onPointerDown={onRailPointerDown}
          className="rail-scroll flex cursor-grab select-none gap-5 overflow-x-auto pb-4 active:cursor-grabbing md:gap-7"
          style={{
            scrollSnapType: 'x mandatory',
            paddingLeft: 'max(1.25rem, calc((100vw - 80rem) / 2 + 2rem))',
            paddingRight: 'max(1.25rem, calc((100vw - 80rem) / 2 + 2rem))',
          }}
        >
          {railProjects.map((project, i) => (
            <motion.div
              key={`${project.title}-${project.category}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.06 }}
              viewport={{ once: true }}
              onClick={() => setSelectedProject(project)}
              className={`group shrink-0 cursor-pointer ${i % 2 === 1 && project.isVertical ? 'md:mt-12' : ''}`}
              style={{ scrollSnapAlign: 'center' }}
            >
              {/* ghost index */}
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#c9c5ba] transition-colors duration-300 group-hover:text-[#f97316]">
                {String(i + 1).padStart(2, '0')}
              </p>
              <div
                className={`relative mt-3 overflow-hidden rounded-2xl bg-[#111] ${
                  project.isVertical
                    ? 'w-[210px] sm:w-[240px] md:w-[260px]'
                    : 'w-[663px] sm:w-[759px] md:w-[821px]'
                }`}
              >
                <div className="relative h-[373px] overflow-hidden sm:h-[427px] md:h-[462px]">
                  <video
                    src={project.video}
                    poster={project.thumbnail}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* bottom scrim + info live on the media itself */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pt-16 pb-4 px-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                      {project.category}
                    </span>
                    <h3 className="mt-1 font-display text-base leading-snug text-white">
                      {project.title}
                    </h3>
                  </div>
                  {/* hover ring */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition group-hover:ring-[#f97316]/60" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* scroll progress hairline */}
        <Container className="mt-6">
          <div className="flex items-center gap-6">
            <div className="relative h-px flex-1 bg-[#e0ddd3]">
              <div
                className="absolute inset-y-[-1px] left-0 bg-[#f97316] transition-[width] duration-150"
                style={{ width: `${railProgress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#999]">
              drag to explore
            </span>
          </div>
        </Container>
      </div>

      {/* Lightbox Modal */}
      {selectedProject && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 md:p-8"
          onClick={() => setSelectedProject(null)}
        >
          <div className={`relative bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center ${selectedProject.isVertical ? 'w-auto h-[90vh] aspect-[9/16]' : 'w-full max-w-6xl aspect-video'}`} onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>
            <div
              className={`relative w-full ${
                selectedProject.isVertical ? 'aspect-[9/16]' : 'aspect-video'
              } bg-black/50 rounded-lg overflow-hidden flex items-center justify-center`}
            >
              {(() => {
                const match = selectedProject.video.match(/b-cdn\.net\/([^/]+)\//)
                const videoId = match ? match[1] : null

                if (videoId) {
                  return (
                    <iframe
                      src={`https://iframe.mediadelivery.net/embed/728256/${videoId}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`}
                      loading="lazy"
                      className="w-full h-full border-0 absolute top-0 left-0"
                      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                      allowFullScreen={true}
                    ></iframe>
                  )
                }

                return (
                  <video
                    src={selectedProject.video}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                )
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}

export default FeaturedWork
