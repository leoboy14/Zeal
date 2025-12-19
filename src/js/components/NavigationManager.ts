import { Component } from '../types';

export class NavigationManager implements Component {
  private navLinks: NodeListOf<HTMLAnchorElement>;

  constructor() {
    this.navLinks = document.querySelectorAll('a[href^="#"]');
  }

  init(): void {
    this.bindEvents();
  }

  private bindEvents(): void {
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });
  }

  private handleNavClick(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLAnchorElement;
    const targetId = target.getAttribute('href');

    if (targetId) {
      this.scrollToSection(targetId);
    }
  }

  private scrollToSection(targetId: string): void {
    const targetElement = document.querySelector(targetId) as HTMLElement;

    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}







