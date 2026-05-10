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
          className="fixed inset-0 pointer-events-none"
          style={{ 
            backgroundColor: layer.bg, 
            zIndex: layer.z, 
            transformOrigin: "top" 
          }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1], 
            delay: index * 0.15 
          }}
        />
      ))}
      
      {/* Brand Logo inside the loader */}
      <motion.div
        className="fixed inset-0 z-[105] pointer-events-none flex items-center justify-center"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeIn" }}
      >
        <span className="text-white text-5xl font-bold tracking-widest font-playfair drop-shadow-lg">
          LegalEagle
        </span>
      </motion.div>

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
