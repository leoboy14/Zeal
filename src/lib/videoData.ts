export interface Project {
  title: string;
  category: string;
  thumbnail: string;
  video: string;
  link: string;
  isVertical: boolean;
}

const CDN = 'https://vz-d016ccde-737.b-cdn.net';

export const videoProjects: Project[] = [
  // Horizontal/Landscape Format (16:9)
  {
    title: 'GREG WEISS',
    category: 'AI Avatar Course',
    thumbnail: '/thumbnails/greg-weiss-ai-avatar-course.webp',
    video: `${CDN}/0022388c-ff21-47a2-b3d6-9176f6f46887/play_720p.mp4`,
    link: '/services',
    isVertical: false
  },
  {
    title: 'GAINIUM',
    category: 'SaaS Demo',
    thumbnail: '/thumbnails/gainium-paper-trading.webp',
    video: `${CDN}/04dec0e1-8333-4e77-8cef-201acad12316/play_720p.mp4`,
    link: '/services',
    isVertical: false
  },
  // Vertical Videos - Reels/Portrait Format (9:16)
  {
    title: 'MODERN RESUME LENS',
    category: 'AI UGC',
    thumbnail: '/thumbnails/modern-resume-lens.webp',
    video: `${CDN}/3b29b69c-9e93-45f7-a91a-fed265db88ca/play_720p.mp4`,
    link: '/services',
    isVertical: true
  },
  {
    title: 'GREG WEISS PITCH',
    category: 'AI UGC',
    thumbnail: '/thumbnails/greg-weiss-elevator-pitch.webp',
    video: `${CDN}/9f8e6983-4bef-4014-9132-96b9a34d3414/play_720p.mp4`,
    link: '/services',
    isVertical: true
  },
  {
    title: 'BIOBLADE',
    category: 'Claymation',
    thumbnail: '/thumbnails/bioblade-plantar-hook.webp',
    video: `${CDN}/8110e582-b724-41fd-a700-5a2d5b4f9a71/play_720p.mp4`,
    link: '/services',
    isVertical: true
  },
  {
    title: 'AUSTIN REED',
    category: 'Talking Head',
    thumbnail: '/thumbnails/austin-reed-motion-graphics.webp',
    video: `${CDN}/b4566447-470a-44e3-b6e7-e39b78f2cb55/play_720p.mp4`,
    link: '/services',
    isVertical: true
  },
  {
    title: 'HONDA',
    category: 'UGC',
    thumbnail: '/thumbnails/honda-after-effects.webp',
    video: `${CDN}/078d1860-053e-46ac-bf0b-236527b7ddd3/play_720p.mp4`,
    link: '/services',
    isVertical: true
  },
  {
    title: 'VREF',
    category: 'Talking Head',
    thumbnail: '/thumbnails/vref-motion-graphics.webp',
    video: `${CDN}/d3fafa35-6ec1-40c1-8034-da095ccfc91c/play_720p.mp4`,
    link: '/services',
    isVertical: true
  },
  {
    title: 'FINANCE NEWS',
    category: 'Talking Head',
    thumbnail: '/thumbnails/finance-news-podcast.webp',
    video: `${CDN}/f33a523e-4874-48c7-bfcd-0f5506293be7/play_720p.mp4`,
    link: '/services',
    isVertical: true
  },
  {
    title: 'ONEDASH HEALTHCARE',
    category: 'Ad',
    thumbnail: '/thumbnails/onedash-healthcare-cover-ad.webp',
    video: `${CDN}/11c8d4c1-9bc6-4d2e-b38b-6924826cccce/play_720p.mp4`,
    link: '/services',
    isVertical: true
  },
  {
    title: 'MISSING COMPONENTS',
    category: 'Ad',
    thumbnail: '/thumbnails/pov-6am-missing-components-ad.webp',
    video: `${CDN}/06774772-db43-4e55-a073-97460dc7a48c/play_720p.mp4`,
    link: '/services',
    isVertical: true
  }
];

// Helper to generate the parallax products list (repeating to fill grid)
export const getParallaxProducts = () => {
    return [
      ...videoProjects.slice(0, 5), // Row 1 (first 5)
      ...videoProjects.slice(5, 10), // Row 2 (next 5)
      // Row 3 (first 5 again, with slight title variations)
      { ...videoProjects[0], title: "GREG WEISS AI AVATAR" },
      { ...videoProjects[1], title: "GAINIUM PAPER TRADING" },
      { ...videoProjects[2], title: "MODERN RESUME LENS AI" },
      { ...videoProjects[3], title: "BIOBLADE PLANTAR HOOK" },
      { ...videoProjects[4], title: "AUSTIN REED MOTION" },
    ];
};
