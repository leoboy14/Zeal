import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface Project {
  title: string
  category: string
  thumbnail: string
  video: string
  link: string
}

const projects: Project[] = [
  {
    title: 'THE DREAM WEDDING',
    category: 'Wedding Films',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    link: '#'
  },
  {
    title: 'LUXURY VILLA TOUR',
    category: 'Real Estate',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-9ad4dc7553e3?w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    link: '#'
  },
  {
    title: 'TRAVEL VLOG: ICELAND',
    category: 'YouTube Content',
    thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    link: '#'
  },
  {
    title: 'FITNESS BRAND REVEAL',
    category: 'Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    link: '#'
  },
  {
    title: 'MUSIC VIDEO - INDIE VIBES',
    category: 'Music Video',
    thumbnail: 'https://images.unsplash.com/photo-1514525253440-b393452e3383?w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    link: '#'
  },
  {
    title: 'TECH UNBOXING',
    category: 'Social Media',
    thumbnail: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    link: '#'
  }
]

const FeaturedWork: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <section id="work" className="py-8 md:py-16 px-6 md:px-10 bg-background-card rounded-t-3xl -mt-8 relative z-20">
      {/* Section Header */}
      <div className="max-w-screen-2xl mx-auto mb-10">
        <h2 className="text-3xl md:text-4xl font-bebas tracking-wider mb-2">
          FEATURED WORK
        </h2>
        <p className="text-text-gray text-sm font-light">
          Dynamic cuts, compelling narratives, and high-impact visuals.
        </p>
      </div>

      {/* Work Grid */}
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onClick={() => setSelectedProject(project)}
            className="group bg-background-dark rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Media Container */}
            <div className="relative aspect-video overflow-hidden">
              {/* Video */}
              <video
                src={project.video}
                poster={project.thumbnail}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Play Overlay */}
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-orange to-secondary-orange flex items-center justify-center shadow-lg shadow-primary-orange/40 transition-transform group-hover:scale-110">
                  <span className="text-white text-sm ml-1">▶</span>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="text-white font-bebas text-base tracking-wide mb-1">
                {project.title}
              </h3>
              <span className="text-text-light-gray text-xs uppercase tracking-widest">
                {project.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default FeaturedWork
