"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";



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
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-500, 0]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[200vh] sm:h-[220vh] py-10 md:py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
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
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 md:space-x-20 mb-10 md:mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-10 md:mb-20 space-x-10 md:space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 md:space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto h-screen flex flex-col justify-center px-4 w-full left-0 top-0 z-50 pointer-events-none">
      <h1 className="text-4xl md:text-7xl font-bold text-white font-bebas tracking-wider leading-none">
        BRINGING <span className="text-primary-orange">STORIES</span> <br />
        TO LIFE THROUGH <span className="text-primary-orange">EDITING</span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-6 text-neutral-200 font-montserrat font-light leading-relaxed">
        Dynamic cuts, compelling narratives, and high-impact visuals.
        We transform raw footage into polished masterpieces that captivate audiences.
      </p>
    </div>
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
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-48 w-[16rem] sm:h-72 sm:w-[24rem] md:h-96 md:w-[30rem] relative shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl h-full w-full relative overflow-hidden"
      >
        {product.video ? (
          <video
            src={product.video}
            className="object-cover object-center absolute h-full w-full inset-0 transition-opacity duration-300"
            muted
            loop
            playsInline
            autoPlay={false}
            ref={(el) => {
              if (el) {
                if (isHovered) {
                  el.play().catch(() => { });
                } else {
                  el.pause();
                  el.currentTime = 0;
                }
              }
            }}
          />
        ) : null}
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className={`object-cover object-left-top absolute h-full w-full inset-0 transition-opacity duration-300 ${isHovered && product.video ? "opacity-0" : "opacity-100"
            }`}
          alt={product.title}
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/800x600/1a1a1a/ffffff?text=' + encodeURIComponent(product.title);
          }}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white text-sm md:text-base">
        {product.title}
      </h2>
    </motion.div>
  );
};
