// Type definitions for Zeal Highlights

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
}

export interface Skill {
  name: string;
  icon: string;
  color: string;
}

export interface Client {
  name: string;
  logo: string;
}

export interface NavigationLink {
  href: string;
  text: string;
}

export interface Component {
  init(): void;
  destroy?(): void;
}

export interface ScrollPosition {
  x: number;
  y: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}








