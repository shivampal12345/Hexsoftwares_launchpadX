'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Drifting Blob 1 - Teal */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -100, 60, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] aspect-square rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl"
      />

      {/* Drifting Blob 2 - Amber/Gold */}
      <motion.div
        animate={{
          x: [0, -60, 80, 0],
          y: [0, 80, -90, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] aspect-square rounded-full bg-accent/10 dark:bg-accent/5 blur-3xl"
      />

      {/* Drifting Blob 3 - Light Teal / Mint */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[40%] right-[20%] w-[35vw] aspect-square rounded-full bg-secondary/5 dark:bg-secondary/3 blur-3xl"
      />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--foreground) 1px, transparent 1px),
            linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
