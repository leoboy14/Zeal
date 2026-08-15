import React from 'react'
import ShootEditShip from '../components/ShootEditShip'
import HeroParallaxDemo from '../components/hero-parallax-demo'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <main>
      <ShootEditShip />
      <HeroParallaxDemo />
      <Footer />
    </main>
  )
}

export default Home

