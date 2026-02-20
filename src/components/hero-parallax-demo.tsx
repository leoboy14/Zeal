"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { getParallaxProducts } from "../lib/videoData";

export default function HeroParallaxDemo() {
  const products = getParallaxProducts();
  return <HeroParallax products={products} />;
}
