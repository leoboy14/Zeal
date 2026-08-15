"use client";
import React from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import { Container } from "@/components/ui/section";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
    video?: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  // Pull the deck up only a little: a large negative offset used to launch the
  // cards straight over the section heading.
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-120, 0]),
    springConfig
  );
  return (
    <section
      ref={ref}
      className="h-[150vh] sm:h-[160vh] overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="relative z-10"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-4 md:space-x-8 mb-6 md:mb-8">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-6 md:mb-8 space-x-4 md:space-x-8">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-4 md:space-x-8">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export const Header = () => {
  // Gradients stay inside the site's orange family (see --primary-orange /
  // --secondary-orange) so the accent reads the same as the hero's "AI."
  const heroWords = [
    { text: "stories", gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" },
    { text: "moments", gradient: "linear-gradient(135deg, #ea6a0c 0%, #f97316 100%)" },
    { text: "memories", gradient: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)" },
    { text: "visions", gradient: "linear-gradient(135deg, #f97316 0%, #f5a524 100%)" },
  ];
  
  return (
    <Container className="relative z-50 flex min-h-[40vh] flex-col justify-end pb-10 pt-20 md:min-h-[44vh] md:pb-14 md:pt-24 pointer-events-none">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">
        01 / The reel
      </p>
      <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[0.95] text-[#111] sm:text-5xl lg:text-6xl">
        Bringing <FlipWords words={heroWords} duration={2500} /> <br />
        to life through <span className="text-primary-orange">editing</span>
      </h2>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-[#666] md:text-lg">
        Dynamic cuts, compelling narratives, and high-impact visuals — raw footage
        turned into work that holds attention.
      </p>
      <Link
        to="/services"
        className="group pointer-events-auto mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#111]"
      >
        <span className="border-b border-[#d8d4c9] pb-0.5 transition-colors group-hover:border-[#f97316]">
          Browse all work
        </span>
        <span aria-hidden className="text-[#f97316] transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </Link>
    </Container>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    video?: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-32 w-[12rem] xs:h-48 xs:w-[16rem] sm:h-72 sm:w-[24rem] md:h-96 md:w-[30rem] relative shrink-0 rounded-2xl overflow-hidden"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl h-full w-full relative overflow-hidden rounded-2xl"
      >
        {product.video ? (
          <video
            src={product.video}
            poster={product.thumbnail}
            className="object-cover object-center absolute h-full w-full inset-0"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : (
          <img
            src={product.thumbnail}
            height="600"
            width="600"
            className="object-cover object-left-top absolute h-full w-full inset-0"
            alt={product.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/800x600/1a1a1a/ffffff?text=' + encodeURIComponent(product.title);
            }}
          />
        )}
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-60 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none transition-opacity duration-300"></div>
      {/* Decorative hover label — not a heading, so it stays out of the outline */}
      <p className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white text-sm md:text-base font-medium transition-opacity duration-300">
        {product.title}
      </p>
    </motion.div>
  );
};
