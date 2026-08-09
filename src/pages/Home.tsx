import React from 'react'
import ShootEditShip from '../components/ShootEditShip'
import HeroParallaxDemo from '../components/hero-parallax-demo'
import FeaturedWork from '../components/FeaturedWork'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <main>
      <ShootEditShip />
      <HeroParallaxDemo />
      <FeaturedWork />
      <Footer />
    </main>
  )
}

export default Home

