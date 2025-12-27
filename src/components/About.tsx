import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from './Footer'

interface TeamMember {
  name: string
  role: string
  image: string
  scale?: number
}

const teamMembers: TeamMember[] = [
  { name: 'Harhley', role: 'Founder & Creative Director', image: '/team/Harhley Ponce.png' },
  { name: 'Leo', role: 'Managing Partner', image: '/team/Leo.png' },
  { name: 'Jun2', role: 'Head of Video Production', image: '/team/Jun2.png' },
  { name: 'Jing2', role: 'Lead Video Editor', image: '/team/Jing Jing.png' },
  { name: 'Karlo', role: 'Long-form Video Editor', image: '/team/Karlo.png' },
  { name: 'Ate Donna', role: 'Short-Form Content Specialist', image: '/team/Donna Bael Corpuz.png' },
  { name: 'Angela', role: 'Project Manager / Client Success', image: '/team/Angela.png' },
  { name: 'Nicko', role: 'Quality Control & Delivery Specialist', image: '/team/Nicko.png', scale: 1.5 },
]

// Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ 
  end, 
  suffix = '', 
  duration = 2 
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
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

// Stat Card Component
const StatCard: React.FC<{ 
  value: number; 
  suffix?: string; 
  label: string; 
  delay?: number;
  gradient?: string;
}> = ({ value, suffix = '', label, delay = 0, gradient = 'from-primary-orange to-secondary-orange' }) => {
  // Map gradient class to actual colors for inline style (brand colors only)
  const getGradientColors = () => {
    if (gradient.includes('gold')) return '#F7931E, #FFD93D';
    if (gradient.includes('warm')) return '#FFD93D, #FF6B35';
    if (gradient.includes('sunset')) return '#FF6B35, #FFD93D';
    return '#FF6B35, #F7931E'; // default orange
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-primary-orange/30 transition-all duration-500 group overflow-hidden"
    >
      {/* Gradient Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <span 
          className="font-bebas text-3xl md:text-4xl tracking-wider"
          style={{
            background: `linear-gradient(90deg, ${getGradientColors()})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          <AnimatedCounter end={value} suffix={suffix} />
        </span>
        <p className="text-text-gray text-sm mt-2 font-light">{label}</p>
      </div>
    </motion.div>
  )
}

// Value Proposition Card
const ValueCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number 
}> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-primary-orange/30 transition-all duration-500 group"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-orange/20 to-secondary-orange/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h4 className="font-bebas text-xl tracking-wider text-white mb-2">{title}</h4>
      <p className="text-text-gray text-sm font-light leading-relaxed">{description}</p>
    </motion.div>
  )
}

// Team Card Component
const TeamCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-primary-orange/50 transition-all duration-500">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            style={{ transform: member.scale ? `scale(${member.scale})` : undefined }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* Orange Accent */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-orange/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <h3 className="font-bebas text-xl md:text-2xl tracking-wider text-white group-hover:text-primary-orange transition-colors duration-300">
            {member.name}
          </h3>
          <p className="text-text-gray text-xs md:text-sm font-light mt-1 leading-snug">
            {member.role}
          </p>
        </div>
        
        {/* Decorative Border Glow */}
        <div className="absolute inset-0 rounded-2xl border-2 border-primary-orange/0 group-hover:border-primary-orange/30 transition-all duration-500 pointer-events-none" />
      </div>
    </motion.div>
  )
}

const About: React.FC = () => {
  return (
    <>
      <section id="about" className="pt-32 pb-20 px-6 md:px-10 bg-background-dark relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-orange/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary-orange/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-primary-orange font-medium text-sm tracking-widest uppercase"
            >
              Who We Are
            </motion.span>
            <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl tracking-wider text-white mt-4">
              ABOUT{' '}
              <span 
                style={{
                  background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 50%, #FF6B35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                US
              </span>
            </h1>
          </motion.div>

          {/* Bento Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
            {/* Mission Statement - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:row-span-2 relative p-8 md:p-10 rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-white/10 overflow-hidden group"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/10 via-transparent to-secondary-orange/5 opacity-50" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-orange to-secondary-orange flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h2 className="font-bebas text-2xl md:text-3xl tracking-wider text-white mb-4">
                  OUR <span className="text-primary-orange">MISSION</span>
                </h2>
                
                <p className="text-text-gray leading-relaxed text-lg">
                  Zeal Highlights is a Philippines-based video editing agency supporting clients in the US and around the world. We help content creators and businesses transform raw footage into polished, engaging videos that align with their brand and goals.
                </p>
                
                <p className="text-text-gray leading-relaxed mt-4">
                  Our agency operates with a team-based workflow, clear processes, and a strong focus on quality control. Led by experienced editors, we combine{' '}
                  <span className="text-primary-orange font-medium">creative storytelling</span> with{' '}
                  <span className="text-secondary-orange font-medium">efficient production systems</span>.
                </p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <StatCard value={50} suffix="+" label="Projects Completed" delay={0.1} />
            <StatCard value={8} label="Team Members" delay={0.2} gradient="from-gold to-accent-gold" />
            <StatCard value={24} suffix="/7" label="Support Available" delay={0.3} gradient="from-warm to-secondary-orange" />
            <StatCard value={10} suffix="+" label="Countries Served" delay={0.4} gradient="from-sunset to-accent-gold" />
          </div>

          {/* Why Choose Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="font-bebas text-2xl md:text-3xl tracking-wider text-white">
                WHY <span className="text-primary-orange">CHOOSE US</span>
              </h2>
              <p className="text-text-gray mt-3 max-w-xl mx-auto">
                We're not just editors — we're your creative partners dedicated to making your content stand out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <ValueCard
                icon={
                  <svg className="w-6 h-6 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Quality Control"
                description="Every video goes through rigorous review to ensure it meets our high standards before delivery."
                delay={0.1}
              />
              <ValueCard
                icon={
                  <svg className="w-6 h-6 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                title="Fast Turnaround"
                description="We understand deadlines. Our streamlined workflow ensures quick delivery without compromising quality."
                delay={0.2}
              />
              <ValueCard
                icon={
                  <svg className="w-6 h-6 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                title="Dedicated Team"
                description="Work with the same editor who understands your brand, style, and content goals."
                delay={0.3}
              />
              <ValueCard
                icon={
                  <svg className="w-6 h-6 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="24/7 Support"
                description="Timezone differences? No problem. We're available around the clock to support our global clients."
                delay={0.4}
              />
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="font-bebas text-2xl md:text-3xl tracking-wider text-white">
                MEET THE <span className="text-primary-orange">TEAM</span>
              </h2>
              <p className="text-text-gray font-light max-w-2xl mx-auto mt-3">
                Our talented team of creative professionals dedicated to bringing your vision to life.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {teamMembers.map((member, index) => (
                <TeamCard key={member.name} member={member} index={index} />
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/20 via-secondary-orange/10 to-primary-orange/20" />
            <div className="absolute inset-0 backdrop-blur-sm" />
            
            {/* Content */}
            <div className="relative z-10 px-8 py-16 md:py-20 text-center">
              <h2 className="font-bebas text-3xl md:text-4xl lg:text-5xl tracking-wider text-white mb-4">
                READY TO SCALE YOUR{' '}
                <span 
                  style={{
                    background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 50%, #FF6B35 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  CONTENT?
                </span>
              </h2>
              <p className="text-text-gray text-lg max-w-xl mx-auto mb-8">
                Let's discuss your project and see how we can help bring your vision to life.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bebas text-xl tracking-wider text-white bg-gradient-to-r from-primary-orange to-secondary-orange hover:from-secondary-orange hover:to-primary-orange transition-all duration-300 shadow-lg shadow-primary-orange/25 hover:shadow-primary-orange/40"
              >
                LET'S TALK
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </>
  )
}

export default About
