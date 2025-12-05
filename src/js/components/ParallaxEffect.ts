import { Component } from '../types';

export class ParallaxEffect implements Component {
  private hero: HTMLElement | null;
  private heroContent: HTMLElement | null;
  private strips: NodeListOf<HTMLElement>;

  constructor() {
    this.hero = document.querySelector('.hero');
    this.heroContent = document.querySelector('.hero-content');
    this.strips = document.querySelectorAll('.strip');
  }

  init(): void {
    if (!this.hero || !this.heroContent) return;
    this.bindEvents();
  }

  private bindEvents(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleScroll(): void {
    if (!this.hero || !this.heroContent) return;

    const scrolled = window.pageYOffset;
    const heroHeight = this.hero.offsetHeight;

    if (scrolled < heroHeight) {
      const parallaxValue = scrolled * 0.5;
      this.heroContent.style.transform = `translateY(${parallaxValue * 0.3}px)`;
      this.heroContent.style.opacity = Math.max(1 - (scrolled / heroHeight), 0).toString();

      this.strips.forEach((strip, index) => {
        const speed = 0.1 + (index * 0.05);
        strip.style.transform = `translateY(${parallaxValue * speed}px)`;
      });
    }
  }
}






