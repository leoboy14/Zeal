# Zeal Highlights - Video Editing Portfolio

A modern, responsive portfolio website for video editing professionals built with Vite, TypeScript, and vanilla JavaScript.

## 🚀 Features

- **Modern Build Tool**: Powered by Vite for fast development and optimized production builds
- **TypeScript**: Full TypeScript support for better code quality and developer experience
- **Modular Architecture**: Well-organized, component-based JavaScript structure
- **Responsive Design**: Mobile-first design that works on all devices
- **Interactive Elements**: Smooth animations, parallax effects, and video modals
- **Video Carousel**: Auto-playing featured work carousel with manual controls
- **Performance Optimized**: Lazy loading images, optimized CSS, and efficient bundling
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML

## 🛠️ Tech Stack

- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS with CSS Variables
- **Architecture**: Component-based vanilla JavaScript
- **Icons**: Inline SVG
- **Fonts**: Google Fonts (Montserrat & Bebas Neue)

## 📁 Project Structure

```
src/
├── js/
│   ├── main.ts                 # Entry point
│   ├── app.ts                  # Application initialization
│   ├── components/             # Modular components
│   │   ├── NavigationManager.ts
│   │   ├── ScrollAnimations.ts
│   │   ├── VideoModal.ts
│   │   ├── ParallaxEffect.ts
│   │   ├── HeaderScrollEffect.ts
│   │   ├── ImageLazyLoader.ts
│   │   └── VideoCarousel.ts
│   └── types/                  # TypeScript type definitions
│       └── index.ts
├── styles/
│   ├── main.css               # Main stylesheet with imports
│   ├── base.css               # Reset and base styles
│   ├── components/            # Component-specific styles
│   │   ├── header.css
│   │   ├── hero.css
│   │   ├── work.css
│   │   ├── sidebar.css
│   │   └── animations.css
│   └── utilities.css          # Utilities and responsive styles
├── assets/                    # Static assets (images, etc.)
└── types/                     # TypeScript declarations
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zeal-highlights
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Customization

### Colors

The color scheme is defined using CSS variables in `src/styles/base.css`. You can easily customize the theme by modifying these variables:

```css
:root {
    --primary-orange: #FF6B35;
    --secondary-orange: #F7931E;
    --bg-dark: #0a0a0a;
    --bg-card: #141414;
    /* ... other variables */
}
```

### Content

Update the portfolio content in the HTML file (`index.html`) and modify the work items data in `VideoCarousel.ts` component.

### Adding New Components

1. Create a new component class in `src/js/components/`
2. Implement the `Component` interface with `init()` and optional `destroy()` methods
3. Import and initialize the component in `src/js/app.ts`

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: > 1200px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px

## 🎬 Features

### Video Carousel
- Auto-playing featured work carousel
- Manual navigation controls
- Keyboard navigation (arrow keys, spacebar)
- Touch/swipe support on mobile

### Interactive Elements
- Smooth scrolling navigation
- Parallax hero background
- Animated work cards with hover effects
- Video modals with ripple click effects
- Scroll-triggered animations

### Performance Features
- Lazy loading for images
- Optimized CSS with code splitting
- Efficient bundling with Vite
- Minimal JavaScript footprint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern video editing portfolios
- Icons from various design systems
- Images from Unsplash
- Fonts from Google Fonts








