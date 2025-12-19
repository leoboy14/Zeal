import { Component } from '../types';

export class VideoModal implements Component {
  private workCards: NodeListOf<HTMLElement>;
  private heroCta: HTMLElement | null;
  private currentModal: HTMLElement | null = null;
  private modalStyles: HTMLStyleElement | null = null;

  constructor() {
    this.workCards = document.querySelectorAll('.work-card');
    this.heroCta = document.querySelector('.hero-cta');
  }

  init(): void {
    this.bindEvents();
  }

  private bindEvents(): void {
    // Bind work card clicks
    this.workCards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('.work-title')?.textContent || 'Video';
        this.showModal(title);
      });

      // Ripple effect on play button
      const playButton = card.querySelector('.play-button') as HTMLElement;
      if (playButton) {
        playButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.createRipple(playButton, e as MouseEvent);
        });
      }
    });

    // Bind hero CTA click
    if (this.heroCta) {
      this.heroCta.addEventListener('click', () => {
        this.createRipple(this.heroCta!, new MouseEvent('click'));
        this.showModal('Showreel');
      });
    }
  }

  private createRipple(element: HTMLElement, event: MouseEvent): void {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  private showModal(title: string): void {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.classList.add('video-modal');
    modal.innerHTML = `
      <div class="video-modal-content">
        <button class="modal-close">&times;</button>
        <div class="video-placeholder">
          <div class="video-icon">▶</div>
          <h3>${title}</h3>
          <p>Video would play here</p>
        </div>
      </div>
    `;

    this.addModalStyles();
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    this.currentModal = modal;

    // Close modal on click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || (e.target as HTMLElement).classList.contains('modal-close')) {
        this.closeModal();
      }
    });

    // Close on escape key
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  private closeModal(): void {
    if (this.currentModal) {
      this.currentModal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        this.currentModal?.remove();
        this.currentModal = null;
        document.body.style.overflow = '';
      }, 300);
    }
  }

  private addModalStyles(): void {
    if (this.modalStyles) return; // Already added

    this.modalStyles = document.createElement('style');
    this.modalStyles.textContent = `
      .video-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      }
      .video-modal-content {
        position: relative;
        width: 90%;
        max-width: 900px;
        aspect-ratio: 16/9;
        background: #141414;
        border-radius: 12px;
        overflow: hidden;
      }
      .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        transition: background 0.3s ease;
        z-index: 10;
      }
      .modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .video-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
      }
      .video-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .video-placeholder h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        letter-spacing: 0.1em;
        margin-bottom: 0.5rem;
      }
      .video-placeholder p {
        color: #666;
        font-size: 0.9rem;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        to { opacity: 0; }
      }
      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(this.modalStyles);
  }
}







