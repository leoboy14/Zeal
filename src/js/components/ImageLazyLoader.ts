import { Component } from '../types';

export class ImageLazyLoader implements Component {
  private images: NodeListOf<HTMLImageElement>;
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
  }

  init(): void {
    if (this.images.length === 0) return;
    this.setupObserver();
  }

  private setupObserver(): void {
    const observerOptions: IntersectionObserverInit = {
      rootMargin: '50px 0px',
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target as HTMLImageElement);
          this.observer?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.images.forEach(img => {
      this.observer.observe(img);
    });
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.classList.add('loaded');

      // Add loading animation
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';

      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}







