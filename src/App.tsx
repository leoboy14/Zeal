import React from 'react'
import Header from './components/Header'
import HeroParallaxDemo from './components/hero-parallax-demo'
import FeaturedWork from './components/FeaturedWork'

function App() {
  return (
    <div className="min-h-screen bg-background-dark">
      <Header />
      <HeroParallaxDemo />
      <FeaturedWork />
    </div>
  )
}

export default App
