import { Component } from '../types';

export class HeaderScrollEffect implements Component {
  private header: HTMLElement | null;

  constructor() {
    this.header = document.querySelector('.header');
  }

  init(): void {
    if (!this.header) return;
    this.bindEvents();
  }

  private bindEvents(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleScroll(): void {
    if (!this.header) return;

    if (window.scrollY > 50) {
      this.header.style.background = 'rgba(10, 10, 10, 0.95)';
      this.header.style.backdropFilter = 'blur(10px)';
    } else {
      this.header.style.background = 'linear-gradient(to bottom, rgba(10, 10, 10, 0.9), transparent)';
      this.header.style.backdropFilter = 'none';
    }
  }
}






