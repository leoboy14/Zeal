import { Component, WorkItem } from '../types';

export class VideoCarousel implements Component {
  private carouselContainer: HTMLElement | null = null;
  private workItems: WorkItem[];
  private currentIndex: number = 0;
  private autoPlayInterval: number | null = null;
  private isPlaying: boolean = true;

  constructor() {
    this.workItems = [
      {
        id: '1',
        title: 'NIKE - UNLEASH YOUR BEST',
        category: 'Commercial',
        thumbnail: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop'
      },
      {
        id: '2',
        title: 'THE WEEKND - LIVE EXPERIENCE',
        category: 'Music Video',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop'
      },
      {
        id: '3',
        title: 'RED BULL - CLIFF DIVING WORLD SERIES',
        category: 'Action Sports',
        thumbnail: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop'
      },
      {
        id: '4',
        title: 'TRAVEL ALASKA - THE LAST FRONTIER',
        category: 'Documentary',
        thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop'
      },
      {
        id: '5',
        title: 'AUDI - E-TRON GT REVEAL',
        category: 'Automotive',
        thumbnail: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop'
      },
      {
        id: '6',
        title: 'SPOTIFY - WRAPPED CAMPAIGN',
        category: 'Social Media',
        thumbnail: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=400&fit=crop'
      }
    ];
  }

  init(): void {
    this.createCarousel();
    this.bindEvents();
    this.startAutoPlay();
  }

  private createCarousel(): void {
    // Create carousel container
    this.carouselContainer = document.createElement('div');
    this.carouselContainer.className = 'video-carousel';

    // Create carousel HTML
    this.carouselContainer.innerHTML = `
      <div class="carousel-header">
        <h3 class="carousel-title">FEATURED WORK</h3>
        <div class="carousel-controls">
          <button class="carousel-prev" aria-label="Previous video">‹</button>
          <button class="carousel-play-pause" aria-label="Pause autoplay">⏸</button>
          <button class="carousel-next" aria-label="Next video">›</button>
        </div>
      </div>
      <div class="carousel-viewport">
        <div class="carousel-track">
          ${this.workItems.map((item, index) => `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
              <div class="carousel-video">
                <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
                <div class="carousel-overlay">
                  <div class="carousel-play-btn">
                    <span class="play-icon">▶</span>
                  </div>
                  <div class="carousel-info">
                    <h4 class="carousel-video-title">${item.title}</h4>
                    <span class="carousel-video-category">${item.category}</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="carousel-indicators">
        ${this.workItems.map((_, index) => `
          <button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>
        `).join('')}
      </div>
    `;

    // Insert after hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection && heroSection.parentNode) {
      heroSection.parentNode.insertBefore(this.carouselContainer, heroSection.nextSibling);
    }

    this.addCarouselStyles();
  }

  private bindEvents(): void {
    if (!this.carouselContainer) return;

    // Navigation buttons
    const prevBtn = this.carouselContainer.querySelector('.carousel-prev') as HTMLButtonElement;
    const nextBtn = this.carouselContainer.querySelector('.carousel-next') as HTMLButtonElement;
    const playPauseBtn = this.carouselContainer.querySelector('.carousel-play-pause') as HTMLButtonElement;

    prevBtn?.addEventListener('click', () => this.prevSlide());
    nextBtn?.addEventListener('click', () => this.nextSlide());
    playPauseBtn?.addEventListener('click', () => this.togglePlayPause());

    // Indicators
    const indicators = this.carouselContainer.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
      indicator.addEventListener('click', (e) => {
        const slideIndex = parseInt((e.target as HTMLElement).dataset.slide || '0');
        this.goToSlide(slideIndex);
      });
    });

    // Video play buttons
    const playButtons = this.carouselContainer.querySelectorAll('.carousel-play-btn');
    playButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const slide = (e.target as HTMLElement).closest('.carousel-slide') as HTMLElement;
        const index = parseInt(slide.dataset.index || '0');
        const item = this.workItems[index];
        this.showVideoModal(item.title);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        this.togglePlayPause();
      }
    });
  }

  private nextSlide(): void {
    this.goToSlide((this.currentIndex + 1) % this.workItems.length);
  }

  private prevSlide(): void {
    this.goToSlide(this.currentIndex === 0 ? this.workItems.length - 1 : this.currentIndex - 1);
  }

  private goToSlide(index: number): void {
    if (!this.carouselContainer) return;

    // Update active slide
    const slides = this.carouselContainer.querySelectorAll('.carousel-slide');
    const indicators = this.carouselContainer.querySelectorAll('.indicator');

    slides[this.currentIndex].classList.remove('active');
    indicators[this.currentIndex].classList.remove('active');

    this.currentIndex = index;

    slides[this.currentIndex].classList.add('active');
    indicators[this.currentIndex].classList.add('active');
  }

  private togglePlayPause(): void {
    if (!this.carouselContainer) return;

    const playPauseBtn = this.carouselContainer.querySelector('.carousel-play-pause') as HTMLButtonElement;

    if (this.isPlaying) {
      this.stopAutoPlay();
      playPauseBtn.textContent = '▶';
      playPauseBtn.setAttribute('aria-label', 'Resume autoplay');
    } else {
      this.startAutoPlay();
      playPauseBtn.textContent = '⏸';
      playPauseBtn.setAttribute('aria-label', 'Pause autoplay');
    }
  }

  private startAutoPlay(): void {
    this.isPlaying = true;
    this.autoPlayInterval = window.setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  private stopAutoPlay(): void {
    this.isPlaying = false;
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private showVideoModal(title: string): void {
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

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Close modal on click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || (e.target as HTMLElement).classList.contains('modal-close')) {
        this.closeModal(modal);
      }
    });

    // Close on escape key
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  private closeModal(modal: HTMLElement): void {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }

  private addCarouselStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .video-carousel {
        margin: 2rem auto;
        max-width: 800px;
        padding: 0 1rem;
      }

      .carousel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .carousel-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        letter-spacing: 0.1em;
        color: var(--text-white);
      }

      .carousel-controls {
        display: flex;
        gap: 0.5rem;
      }

      .carousel-prev, .carousel-next, .carousel-play-pause {
        width: 40px;
        height: 40px;
        background: var(--bg-card);
        border: none;
        border-radius: 50%;
        color: var(--text-white);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }

      .carousel-prev:hover, .carousel-next:hover, .carousel-play-pause:hover {
        background: var(--primary-orange);
        transform: scale(1.1);
      }

      .carousel-viewport {
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      }

      .carousel-track {
        display: flex;
        transition: transform 0.5s ease;
      }

      .carousel-slide {
        min-width: 100%;
        opacity: 0.3;
        transition: opacity 0.5s ease;
      }

      .carousel-slide.active {
        opacity: 1;
      }

      .carousel-video {
        position: relative;
        aspect-ratio: 16/9;
        overflow: hidden;
      }

      .carousel-video img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .carousel-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .carousel-video:hover .carousel-overlay {
        opacity: 1;
      }

      .carousel-play-btn {
        width: 60px;
        height: 60px;
        background: var(--gradient-orange);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
      }

      .carousel-play-btn:hover {
        transform: scale(1.1);
      }

      .carousel-play-btn .play-icon {
        font-size: 1.5rem;
        color: white;
      }

      .carousel-info {
        text-align: center;
        color: white;
      }

      .carousel-video-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.2rem;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
      }

      .carousel-video-category {
        font-size: 0.8rem;
        color: var(--text-gray);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .carousel-indicators {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
      }

      .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        background: var(--text-light-gray);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .indicator.active {
        background: var(--primary-orange);
        transform: scale(1.2);
      }

      .indicator:hover {
        background: var(--text-gray);
      }

      @media (max-width: 768px) {
        .video-carousel {
          margin: 1rem auto;
          padding: 0 0.5rem;
        }

        .carousel-title {
          font-size: 1.2rem;
        }

        .carousel-prev, .carousel-next, .carousel-play-pause {
          width: 35px;
          height: 35px;
          font-size: 1rem;
        }

        .carousel-play-btn {
          width: 50px;
          height: 50px;
        }

        .carousel-play-btn .play-icon {
          font-size: 1.2rem;
        }

        .carousel-video-title {
          font-size: 1rem;
        }

        .carousel-video-category {
          font-size: 0.7rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  destroy(): void {
    this.stopAutoPlay();
    if (this.carouselContainer) {
      this.carouselContainer.remove();
    }
  }
}








