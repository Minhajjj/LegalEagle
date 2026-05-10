"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  // Define the layered panels. The top-most layer (highest z-index) slides away first.
  const layers = [
    { bg: "#1a3a52", z: 104 }, // Primary Dark Blue
    { bg: "#2563eb", z: 103 }, // Secondary Blue
    { bg: "#94a3b8", z: 102 }, // Slate
    { bg: "#e2e8f0", z: 101 }, // Light Slate
  ];

  return (
    <>
      {/* The Layered Sliding Panels */}
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: layer.bg, 
            zIndex: layer.z,
          }}
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1], 
            delay: index * 0.15 
          }}
        >
          {/* Put the logo text ONLY inside the top-most dark layer so it never loses contrast */}
          {index === 0 && (
            <motion.div 
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <span className="text-white text-6xl font-extrabold tracking-[0.2em] font-playfair drop-shadow-2xl uppercase">
                LegalEagle
              </span>
              <span className="text-white/80 text-sm tracking-[0.4em] uppercase mt-4 font-semibold drop-shadow-md">
                AI Legal Forensics
              </span>
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* The actual page content, fades in after the layers start sliding */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
