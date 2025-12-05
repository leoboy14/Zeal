// Main application initialization
import { NavigationManager } from './components/NavigationManager';
import { ScrollAnimations } from './components/ScrollAnimations';
import { VideoModal } from './components/VideoModal';
import { ParallaxEffect } from './components/ParallaxEffect';
import { HeaderScrollEffect } from './components/HeaderScrollEffect';
import { ImageLazyLoader } from './components/ImageLazyLoader';
import { VideoCarousel } from './components/VideoCarousel';

export function initApp(): void {
  // Initialize all components
  const navigationManager = new NavigationManager();
  const scrollAnimations = new ScrollAnimations();
  const videoModal = new VideoModal();
  const parallaxEffect = new ParallaxEffect();
  const headerScrollEffect = new HeaderScrollEffect();
  const imageLazyLoader = new ImageLazyLoader();
  const videoCarousel = new VideoCarousel();

  // Initialize components
  navigationManager.init();
  scrollAnimations.init();
  videoModal.init();
  parallaxEffect.init();
  headerScrollEffect.init();
  imageLazyLoader.init();
  videoCarousel.init();
}
