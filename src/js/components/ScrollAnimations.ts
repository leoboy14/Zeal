import { Component } from '../types';

export class ScrollAnimations implements Component {
  private observer: IntersectionObserver | null = null;
  private sidebarSections: NodeListOf<HTMLElement>;

  constructor() {
    this.sidebarSections = document.querySelectorAll('.page-section');
  }

  init(): void {
    this.setupObserver();
    this.addAnimationStyles();
  }

  private setupObserver(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          this.observer?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Initial setup for sections
    this.sidebarSections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      this.observer.observe(section);
    });
  }

  private addAnimationStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}






