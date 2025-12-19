"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
export const products = [
  // Row 1 - Long Videos
  {
    title: "Ryan + Liza",
    link: "#work",
    thumbnail: "",
    video: "/videos/long/Ryan + Liza (SDE).mp4",
  },
  {
    title: "Christian + Bao",
    link: "#work",
    thumbnail: "",
    video: "/videos/long/Christian+Bao.mp4",
  },
  {
    title: "Min Joo + Lisa",
    link: "#work",
    thumbnail: "",
    video: "/videos/long/2.) Min Joo+Lisa 2 (Highlights).mp4",
  },
  {
    title: "Jacob + Camille",
    link: "#work",
    thumbnail: "",
    video: "/videos/long/Jacob+Camille (Instagram).mp4",
  },
  {
    title: "Tattuds",
    link: "#work",
    thumbnail: "",
    video: "/videos/long/1.) Tattuds (Mobile Tattoo).mp4",
  },
  // Row 2 - Vertical Videos + Repeat
  {
    title: "Every Expert Has Purpose",
    link: "#work",
    thumbnail: "",
    video: "/videos/vertical/Every Expert Has Purpose_1.mp4",
  },
  {
    title: "Izaiah Reel",
    link: "#work",
    thumbnail: "",
    video: "/videos/vertical/Izaiah Reel 5 Insecure on Your Body.mp4",
  },
  {
    title: "Project 7",
    link: "#work",
    thumbnail: "",
    video: "/videos/vertical/Project 7.mov",
  },
  {
    title: "Sales Rep",
    link: "#work",
    thumbnail: "",
    video: "/videos/vertical/v2 - 18 - Sales Rep Copy 01 (1).mp4",
  },
  {
    title: "Ryan + Liza SDE",
    link: "#work",
    thumbnail: "",
    video: "/videos/long/Ryan + Liza (SDE).mp4",
  },
  // Row 3 - Mix of all videos
  {
    title: "Christian + Bao Wedding",
    link: "#work",
    thumbnail: "",
    video: "/videos/long/Christian+Bao.mp4",
  },
  {
    title: "Min Joo + Lisa Highlights",
    link: "#work",
    thumbnail: "",
    video: "/videos/long/2.) Min Joo+Lisa 2 (Highlights).mp4",
  },
  {
    title: "Jacob + Camille Wedding",
    link: "#work",
    thumbnail: "",
    video: "/videos/long/Jacob+Camille (Instagram).mp4",
  },
  {
    title: "Expert Purpose",
    link: "#work",
    thumbnail: "",
    video: "/videos/vertical/Every Expert Has Purpose_1.mp4",
  },
  {
    title: "Izaiah Insecure",
    link: "#work",
    thumbnail: "",
    video: "/videos/vertical/Izaiah Reel 5 Insecure on Your Body.mp4",
  },
];
