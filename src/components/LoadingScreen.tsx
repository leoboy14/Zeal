import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

/* ---- Kinetic text grid ------------------------------------------------- */

const BRAND = 'ZEAL';
const BRAND_SUFFIX = 'HIGHLIGHTS';
// Service vocabulary fills the grid; the brand lockup is what survives the wipe.
const WORDS = [
  'SHORT-FORM',
  'UGC ADS',
  'MOTION',
  'THUMBNAILS',
  'VFX',
  'PODCASTS',
  'REELS',
  'COLOR GRADE',
  'CLAYMATION',
  'SOUND',
  'CAPTIONS',
  'TRAILERS',
  'GAMING',
  'EDITING',
];
const ROW_COUNT = 5; // odd -> exact geometric center
const REPEAT_COUNT = 5; // odd -> exact geometric center
const ROW_GAP = 10;
const WORD_GAP = 28;
const HORIZONTAL_SHIFT = 90;
const ZOOM_SCALE = 1.14;
const HOME_FACTOR = 0.4; // rows stay staggered at rest, never a flat grid

// Timeline (seconds) — the in-beat runs straight into the wipe, no dead gap.
const MOTION = 0.55;
const HOLD = 0.35;
const T_IN = MOTION; // zoomed + spread, everything visible
const T_WIPE = T_IN + MOTION; // wiped down to the single centered word
// The sequence plays once and rests on the brand lockup — no loop back.
const TOTAL = T_WIPE + HOLD;
const n = (t: number) => t / TOTAL;

const VISIBLE = 'inset(0% 0% 0% 0%)';

const seq = (times: number[]) => ({
  duration: TOTAL,
  times,
  ease: 'easeInOut' as const,
});

const KineticTextGrid: React.FC = () => {
  const centerRow = Math.floor(ROW_COUNT / 2);
  const centerWord = Math.floor(REPEAT_COUNT / 2);
  const rowRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLSpanElement>(null);
  // The brand lockup is rarely the exact middle of its row (neighbouring words
  // differ in width), so measure how far it sits off-centre and land there.
  const [brandOffset, setBrandOffset] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const row = rowRef.current;
      const brand = brandRef.current;
      if (!row || !brand) return;
      setBrandOffset(row.offsetWidth / 2 - (brand.offsetLeft + brand.offsetWidth / 2));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const rows = useMemo(() => Array.from({ length: ROW_COUNT }, (_, i) => i), []);
  const words = useMemo(() => Array.from({ length: REPEAT_COUNT }, (_, i) => i), []);

  return (
    <motion.div
      animate={{ scale: [1, ZOOM_SCALE, 1, 1] }}
      transition={seq([0, n(T_IN), n(T_WIPE), 1])}
      className="flex flex-col items-center justify-center"
      style={{ gap: ROW_GAP, willChange: 'transform' }}
    >
      {rows.map((rowIndex) => {
        const isCenterRow = rowIndex === centerRow;
        const direction = rowIndex % 2 === 0 ? 1 : -1;
        const speed = 0.7 + (Math.abs(rowIndex - centerRow) % 3) * 0.45;
        const driftFull = direction * HORIZONTAL_SHIFT * speed;
        const driftHome = driftFull * HOME_FACTOR;

        const wipeLTR = rowIndex % 2 === 0;
        const hidden = wipeLTR ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';

        // Center row slides so the brand lockup lands dead center and stays
        // there; the other rows just spread and hold, wiped away.
        const xAnim = isCenterRow
          ? {
              values: [driftHome, driftFull, brandOffset, brandOffset],
              times: [0, n(T_IN), n(T_WIPE), 1],
            }
          : {
              values: [driftHome, driftFull, driftFull],
              times: [0, n(T_IN), 1],
            };

        return (
          <motion.div
            key={rowIndex}
            ref={isCenterRow ? rowRef : undefined}
            animate={{ x: xAnim.values }}
            transition={seq(xAnim.times)}
            className="flex items-center justify-center whitespace-nowrap"
            style={{ gap: WORD_GAP, willChange: 'transform' }}
          >
            {words.map((wordIndex) => {
              const isCenterWord = isCenterRow && wordIndex === centerWord;

              // The one word that survives the wipe — the brand mark.
              if (isCenterWord) {
                return (
                  <span
                    key={wordIndex}
                    ref={brandRef}
                    className="inline-block whitespace-nowrap font-black leading-none tracking-tight"
                    style={{ fontSize: 'clamp(24px, 4.4vw, 56px)', clipPath: VISIBLE }}
                  >
                    <span className="text-[#f97316]">{BRAND}</span>{' '}
                    <span className="text-[#111]">{BRAND_SUFFIX}</span>
                  </span>
                );
              }

              const denom = Math.max(1, REPEAT_COUNT - 1);
              const sweepT = wipeLTR ? wordIndex / denom : (REPEAT_COUNT - 1 - wordIndex) / denom;

              const wipeWindow = T_WIPE - T_IN;
              const perWipe = wipeWindow * 0.5;
              const outStart = T_IN + sweepT * (wipeWindow - perWipe);
              const outEnd = outStart + perWipe;

              return (
                <motion.span
                  key={wordIndex}
                  animate={{ clipPath: [VISIBLE, VISIBLE, hidden, hidden] }}
                  transition={seq([0, n(outStart), n(outEnd), 1])}
                  className="inline-block font-black leading-none tracking-tight text-[#111]"
                  style={{
                    fontSize: 'clamp(24px, 4.4vw, 56px)',
                    clipPath: VISIBLE,
                    willChange: 'clip-path',
                  }}
                >
                  {WORDS[(rowIndex * REPEAT_COUNT + wordIndex) % WORDS.length]}
                </motion.span>
              );
            })}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

/* ---- Loader shell ------------------------------------------------------ */

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#f4f2ed]"
        >
          {/* BISECT */}<span>BISECT</span>

          {/* Soft vignette so the outer rows fade instead of hard-cropping */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(244,242,237,0) 38%, rgba(244,242,237,0.92) 78%, #f4f2ed 100%)',
            }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
