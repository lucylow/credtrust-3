import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Trophy, Sparkles } from 'lucide-react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

interface ConfettiCelebrationProps {
  trigger: boolean;
  duration?: number;
  intensity?: number;
  onComplete?: () => void;
}

export default function ConfettiCelebration({
  trigger,
  duration = 3000,
  intensity = 40,
  onComplete,
}: ConfettiCelebrationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--success))',
    '#f59e0b',
    '#ec4899',
    '#8b5cf6',
  ];

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);

      const newConfetti: ConfettiPiece[] = [];
      for (let i = 0; i < intensity; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 360,
        });
      }

      setConfetti(newConfetti);

      const timer = setTimeout(() => {
        setIsActive(false);
        setConfetti([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, isActive, intensity, duration, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Large celebration icons */}
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="absolute left-1/4 top-1/3 text-primary"
          >
            <PartyPopper className="h-16 w-16 animate-pulse" />
          </motion.div>

          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
            className="absolute right-1/4 top-1/4 text-secondary"
          >
            <Trophy className="h-20 w-20 animate-pulse" />
          </motion.div>

          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-success"
          >
            <Sparkles className="h-24 w-24 animate-pulse" />
          </motion.div>

          {/* Confetti pieces */}
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2.5 + Math.random(),
                delay: piece.delay,
                ease: 'easeIn',
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{ backgroundColor: piece.color }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
