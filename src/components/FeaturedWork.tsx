import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface Project {
  title: string
  category: string
  thumbnail: string
  video: string
  link: string
  isVertical: boolean
}

const projects: Project[] = [
  // Long Videos - Horizontal/Landscape Format (16:9)
  {
    title: 'TATTUDS',
    category: 'Commercial',
    thumbnail: '/thumbnails/tattuds-commercial.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/tattuds-commercial.mp4',
    link: '#',
    isVertical: false
  },
  {
    title: 'RYAN + LIZA',
    category: 'Same Day Edit',
    thumbnail: '/thumbnails/ryan-liza-sde.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/ryan-liza-sde.mp4',
    link: '#',
    isVertical: false
  },
  {
    title: 'AIRBNB',
    category: 'Property Film',
    thumbnail: '/thumbnails/airbnb-property-film.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/airbnb-property-film.mp4',
    link: '#',
    isVertical: false
  },
  {
    title: 'CHRISTIAN + BAO',
    category: 'Wedding Film',
    thumbnail: '/thumbnails/christian-bao.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/christian-bao.mp4',
    link: '#',
    isVertical: false
  },
  {
    title: 'MIN JOO + LISA',
    category: 'Highlights',
    thumbnail: '/thumbnails/min-joo-lisa-highlights.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/min-joo-lisa-highlights.mp4',
    link: '#',
    isVertical: false
  },
  {
    title: 'JACOB + CAMILLE',
    category: 'Wedding Film',
    thumbnail: '/thumbnails/jacob-camille-wedding.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/jacob-camille-wedding.mp4',
    link: '#',
    isVertical: false
  },
  // Vertical Videos - Reels/Portrait Format (9:16) - Social Media
  {
    title: 'EVERY EXPERT HAS PURPOSE',
    category: 'Reel',
    thumbnail: '/thumbnails/every-expert-purpose.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/every-expert-purpose.mp4',
    link: '#',
    isVertical: true
  },
  {
    title: 'IZAIAH REEL',
    category: 'Reel',
    thumbnail: '/thumbnails/izaiah-reel.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/izaiah-reel.mp4',
    link: '#',
    isVertical: true
  },
  {
    title: 'PROJECT 7',
    category: 'Reel',
    thumbnail: '/thumbnails/project-7.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/project-7.mp4',
    link: '#',
    isVertical: true
  },
  {
    title: 'SALES REP',
    category: 'Reel',
    thumbnail: '/thumbnails/sales-rep-reel.webp',
    video: 'https://ydqeqenhdvbviizowwub.supabase.co/storage/v1/object/public/videos/sales-rep-reel.mp4',
    link: '#',
    isVertical: true
  }
]

const FeaturedWork: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Separate landscape films from vertical reels
  const landscapeFilms = projects.filter(p => !p.isVertical)
  const verticalReels = projects.filter(p => p.isVertical)

  const renderVideoCard = (project: Project, isVertical: boolean = false) => {
    const cardId = `${project.title}-${project.category}`
    return (
      <motion.div
        key={cardId}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        onHoverStart={() => setHoveredId(cardId)}
        onHoverEnd={() => setHoveredId(null)}
        onClick={() => setSelectedProject(project)}
        className="group bg-background-dark rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      >
        {/* Media Container */}
        <div className={`relative overflow-hidden ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
          {/* Video with Lazy Loading */}
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.1, margin: "200px" }}
          >
            <video
              src={project.video}
              poster={project.thumbnail}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>

          {/* Play Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${hoveredId === cardId ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`rounded-full bg-gradient-to-r from-primary-orange to-secondary-orange flex items-center justify-center shadow-lg shadow-primary-orange/40 transition-transform group-hover:scale-110 ${isVertical ? 'w-10 h-10' : 'w-12 h-12'}`}>
              <span className={`text-white ml-0.5 ${isVertical ? 'text-xs' : 'text-sm'}`}>▶</span>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className={`${isVertical ? 'p-3' : 'p-4'}`}>
          <h3 className={`text-white font-bebas tracking-wide mb-1 ${isVertical ? 'text-sm' : 'text-base'}`}>
            {project.title}
          </h3>
          <span className={`text-text-light-gray uppercase tracking-widest ${isVertical ? 'text-[10px]' : 'text-xs'}`}>
            {project.category}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <section id="work" className="py-8 md:py-16 px-6 md:px-10 bg-background-card rounded-t-3xl -mt-8 relative z-20">
      {/* Films Section Header */}
      <div className="max-w-screen-2xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bebas tracking-wider mb-2">
          FEATURED FILMS
        </h2>
        <p className="text-text-gray text-sm font-light">
          Cinematic storytelling with dynamic cuts and compelling narratives.
        </p>
      </div>

      {/* Landscape Films Grid - 3 columns */}
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {landscapeFilms.map((project) => renderVideoCard(project, false))}
      </div>

      {/* Reels Section Header */}
      <div className="max-w-screen-2xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl md:text-3xl font-bebas tracking-wider">
            REELS
          </h2>
          <span className="px-3 py-1 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-full text-xs font-medium tracking-wide">
            VERTICAL
          </span>
        </div>
        <p className="text-text-gray text-sm font-light">
          Short-form content optimized for social media platforms.
        </p>
      </div>

      {/* Vertical Reels Grid - 4 columns on desktop, horizontal scroll on mobile */}
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {verticalReels.map((project) => renderVideoCard(project, true))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div className={`relative bg-black rounded-lg overflow-hidden shadow-2xl ${selectedProject.isVertical ? 'w-auto h-[85vh] aspect-[9/16]' : 'w-full max-w-5xl aspect-video'}`} onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>
            <video
              src={selectedProject.video}
              poster={selectedProject.thumbnail}
              autoPlay
              controls
              preload="auto"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default FeaturedWork
