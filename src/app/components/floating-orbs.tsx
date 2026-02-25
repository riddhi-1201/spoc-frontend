import { motion } from 'motion/react';

export function FloatingOrbs() {
  return (
    <>
      {/* Gradient Orb 1 - Teal */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl"
      />

      {/* Gradient Orb 2 - Purple */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 120, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-40 right-20 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
      />

      {/* Gradient Orb 3 - Navy */}
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-full blur-3xl"
      />

      {/* Gradient Orb 4 - Emerald */}
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 90, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-40 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl"
      />
    </>
  );
}
