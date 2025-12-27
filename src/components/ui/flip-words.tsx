"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface WordConfig {
  text: string;
  color?: string;
  gradient?: string;
}

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: (string | WordConfig)[];
  duration?: number;
  className?: string;
}) => {
  const normalizedWords: WordConfig[] = words.map((word) =>
    typeof word === "string" ? { text: word } : word
  );
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const currentWord = normalizedWords[currentIndex];

  const startAnimation = useCallback(() => {
    const nextIndex = (currentIndex + 1) % normalizedWords.length;
    setCurrentIndex(nextIndex);
    setIsAnimating(true);
  }, [currentIndex, normalizedWords.length]);

  useEffect(() => {
    if (!isAnimating) {
      const timeout = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, duration, startAnimation]);

  // Build style for the word - solid color or gradient
  const getWordStyle = (): React.CSSProperties => {
    if (currentWord.gradient) {
      return {
        background: currentWord.gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };
    }
    if (currentWord.color) {
      return { color: currentWord.color };
    }
    return {};
  };

  // Check if we're using gradient (don't break into letters for gradients)
  const hasGradient = !!currentWord.gradient;

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.span
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: "blur(8px)",
          scale: 2,
          position: "absolute",
        }}
        className={cn(
          "z-10 inline-block relative text-left px-2",
          className
        )}
        key={currentWord.text}
      >
        {hasGradient ? (
          // For gradient words, render as a single element to preserve the gradient
          <motion.span
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            style={getWordStyle()}
            className="inline-block"
          >
            {currentWord.text}
          </motion.span>
        ) : (
          // For non-gradient words, animate each letter individually
          currentWord.text.split(" ").map((word, wordIndex) => (
            <motion.span
              key={word + wordIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: wordIndex * 0.3,
                duration: 0.3,
              }}
              className="inline-block whitespace-nowrap"
              style={getWordStyle()}
            >
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={word + letterIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: wordIndex * 0.3 + letterIndex * 0.05,
                    duration: 0.2,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          ))
        )}
      </motion.span>
    </AnimatePresence>
  );
};
