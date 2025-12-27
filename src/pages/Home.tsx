import React from 'react'
import HeroParallaxDemo from '../components/hero-parallax-demo'
import FeaturedWork from '../components/FeaturedWork'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <main>
      <HeroParallaxDemo />
      <FeaturedWork />
      <Footer />
    </main>
  )
}

export default Home

