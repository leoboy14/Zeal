import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroParallaxDemo from './components/hero-parallax-demo'
import FeaturedWork from './components/FeaturedWork'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time / wait for assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background-dark">
      <LoadingScreen isLoading={isLoading} />
      <Header />
      <HeroParallaxDemo />
      <FeaturedWork />
    </div>
  )
}

export default App
