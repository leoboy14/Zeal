import React, { useState } from 'react'
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

const FeaturedWork: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Separate landscape films from vertical reels
  const landscapeFilms = videoProjects.filter((p: Project) => !p.isVertical)
  const verticalReels = videoProjects.filter((p: Project) => p.isVertical)

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
            <video
              src={selectedProject.video}
              poster={selectedProject.thumbnail}
              autoPlay
              controls
              preload="auto"
              className="w-full h-full object-contain"
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}

export default FeaturedWork
