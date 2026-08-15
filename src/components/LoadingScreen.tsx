import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo_zeal_black.png';

interface LoadingScreenProps {
  isLoading: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f4f2ed]"
        >
          {/* Logo rises out of a masked line */}
          <div className="overflow-hidden px-2 pb-1">
            <motion.img
              src={Logo}
              alt="Zeal Highlights"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="w-36 object-contain md:w-44"
            />
          </div>

          {/* Progress hairline */}
          <div className="mt-8 h-px w-40 overflow-hidden bg-[#e0ddd3] md:w-48">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.25 }}
              className="h-full w-full bg-[#f97316]"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#999]"
          >
            Editing at the speed of AI
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
