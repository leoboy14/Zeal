export interface Project {
  title: string;
  category: string;
  thumbnail: string;
  video: string;
  link: string;
  isVertical: boolean;
}

export const videoProjects: Project[] = [
  // Long Videos - Horizontal/Landscape Format (16:9)
  {
    title: 'TATTUDS',
    category: 'Commercial', // FeaturedWork specific
    thumbnail: '/thumbnails/tattuds-commercial.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/40f8845f-f2b8-405e-8cbe-e9d46ae75d76/play_720p.mp4',
    link: '#work',
    isVertical: false
  },
  {
    title: 'RYAN + LIZA',
    category: 'Same Day Edit',
    thumbnail: '/thumbnails/ryan-liza-sde.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/2c4168a0-f572-4c75-95e8-de3de80d58c9/play_720p.mp4',
    link: '#work',
    isVertical: false
  },
  {
    title: 'AIRBNB',
    category: 'Property Film',
    thumbnail: '/thumbnails/airbnb-property-film.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/790ac539-3142-4838-8034-f39ce81acbfc/play_720p.mp4',
    link: '#work',
    isVertical: false
  },
  {
    title: 'CHRISTIAN + BAO',
    category: 'Wedding Film',
    thumbnail: '/thumbnails/christian-bao.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/2c74bf88-6c42-48dc-8167-5efb38e7b4ac/play_720p.mp4',
    link: '#work',
    isVertical: false
  },
  {
    title: 'MIN JOO + LISA',
    category: 'Highlights',
    thumbnail: '/thumbnails/min-joo-lisa-highlights.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/622c9c68-c5c5-4d70-b387-bd878451058b/play_720p.mp4',
    link: '#work',
    isVertical: false
  },
  {
    title: 'JACOB + CAMILLE',
    category: 'Wedding Film',
    thumbnail: '/thumbnails/jacob-camille-wedding.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/1d89d4c6-c5ae-454b-9128-a7ffd58682e8/play_720p.mp4',
    link: '#work',
    isVertical: false
  },
  // Vertical Videos - Reels/Portrait Format (9:16) - Social Media
  {
    title: 'EVERY EXPERT HAS PURPOSE',
    category: 'Reel',
    thumbnail: '/thumbnails/every-expert-purpose.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/a6cdb0a9-cc05-4c6c-bd05-bedbff139974/play_720p.mp4',
    link: '#work',
    isVertical: true
  },
  {
    title: 'IZAIAH REEL',
    category: 'Reel',
    thumbnail: '/thumbnails/izaiah-reel.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/3bd0eb97-49fb-46f6-902d-a1f53f353ca5/play_720p.mp4',
    link: '#work',
    isVertical: true
  },
  {
    title: 'PROJECT 7',
    category: 'Reel',
    thumbnail: '/thumbnails/project-7.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/850937a6-b84a-4614-b870-fb52f5db6e66/play_720p.mp4',
    link: '#work',
    isVertical: true
  },
  {
    title: 'SALES REP',
    category: 'Reel',
    thumbnail: '/thumbnails/sales-rep-reel.webp',
    video: 'https://vz-c804da6c-2d7.b-cdn.net/481b4cd3-2640-4d64-806c-684c5e2a045f/play_720p.mp4',
    link: '#work',
    isVertical: true
  }
];

// Helper to generate the parallax products list (repeating to fill grid)
export const getParallaxProducts = () => {
    return [
      ...videoProjects.slice(0, 5), // Row 1 (first 5)
      ...videoProjects.slice(5, 10), // Row 2 (next 5)
      // Row 3 (first 5 again, but with slight title variations as per original file)
      { ...videoProjects[0], title: "TATTUDS COMMERCIAL" },
      { ...videoProjects[1], title: "RYAN + LIZA SDE" },
      { ...videoProjects[2], title: "AIRBNB PROPERTY" },
      { ...videoProjects[3], title: "CHRISTIAN + BAO WEDDING" },
      { ...videoProjects[4], title: "MIN JOO + LISA HIGHLIGHTS" },
    ];
};
