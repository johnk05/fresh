"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MangoDrop({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"dropping" | "splashing" | "finished">("dropping");

  useEffect(() => {
    const splashTimer = setTimeout(() => setPhase("splashing"), 1500);
    const finishTimer = setTimeout(() => {
      setPhase("finished");
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background mango-gradient-bg">
      <AnimatePresence>
        {phase === "dropping" && (
          <motion.div
            initial={{ y: -500, rotate: -20, scale: 0.5 }}
            animate={{ 
              y: 0, 
              rotate: 0, 
              scale: 1,
              transition: { 
                y: { type: "spring", stiffness: 100, damping: 10 },
                rotate: { duration: 1.5 },
                scale: { duration: 1.5 }
              } 
            }}
            exit={{ scale: 2, opacity: 0 }}
            className="relative"
          >
            <MangoIcon className="w-48 h-48 drop-shadow-2xl" />
            <motion.div 
              className="absolute -top-12 -right-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
            >
              <LeafIcon className="w-16 h-16 text-secondary rotate-45" />
            </motion.div>
          </motion.div>
        )}

        {phase === "splashing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <motion.h1 
              className="text-7xl font-headline font-bold text-primary mb-4"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              Fresh
            </motion.h1>
            <motion.p
              className="text-xl font-body text-accent font-medium text-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
            >
              കേരളത്തിന്റെ കൊല്ലവും, നിങ്ങളുടെ വീട്ടുമുറ്റവും
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MangoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 90C70 90 85 70 85 45C85 20 70 10 50 10C30 10 15 25 15 50C15 75 30 90 50 90Z" fill="#FDB714" />
      <path d="M50 10C55 10 60 5 60 0" stroke="#2D5016" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 30C50 30 70 35 75 55" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="currentColor">
      <path d="M20 0C20 0 40 10 40 25C40 40 20 40 20 40C20 40 0 40 0 25C0 10 20 0 20 0Z" />
    </svg>
  );
}