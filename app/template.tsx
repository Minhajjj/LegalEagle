"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* The sliding window overlay */}
      <motion.div
        className="fixed inset-0 z-[100] bg-[#1a3a52] pointer-events-none flex items-center justify-center"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "bottom" }}
      >
        <motion.div 
          className="text-white text-4xl font-bold tracking-widest font-playfair"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          LegalEagle
        </motion.div>
      </motion.div>

      {/* The page content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
