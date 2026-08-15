import React from 'react'
import { motion } from 'framer-motion'

/**
 * Shared layout primitives for the marketing pages.
 *
 * Every section on the homepage measures its content with the same container
 * and the same vertical rhythm, so left edges line up from the hero headline
 * all the way down to the footer.
 */

/** Single source of truth for horizontal measure + gutters. */
export const CONTAINER = 'mx-auto w-full max-w-7xl px-5 sm:px-8'

export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className={`${CONTAINER} ${className}`} {...rest}>
    {children}
  </div>
)

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

interface SectionHeadingProps {
  /** Small mono label — doubles as a wayfinding index (e.g. "02 / Reels"). */
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  /** Optional right-aligned slot: a count, a link, a badge. */
  meta?: React.ReactNode
  /** Heading level — the page has exactly one h1, in the hero. */
  as?: 'h2' | 'h3'
  className?: string
}

/**
 * The one section-header pattern used across the page: mono eyebrow, display
 * title, hairline rule, optional lede. Keeps every section announcing itself
 * at the same volume.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  meta,
  as: Tag = 'h2',
  className = '',
}) => (
  <motion.div
    variants={reveal}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.6 }}
    className={className}
  >
    {eyebrow && (
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#999]">
        {eyebrow}
      </p>
    )}
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-[#e7e4dc] pb-5">
      <Tag className="font-display text-4xl leading-[0.95] tracking-[-0.02em] text-[#111] sm:text-5xl">
        {title}
      </Tag>
      {meta && <div className="pb-1">{meta}</div>}
    </div>
    {description && (
      <p className="mt-5 max-w-xl text-base leading-relaxed text-[#666]">
        {description}
      </p>
    )}
  </motion.div>
)
