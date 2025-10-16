import { motion, AnimatePresence, PanInfo, useMotionValue } from 'framer-motion';
import { useReelsController } from '@/hooks/useReelsController';
import ProgressStrips from './ProgressStrips';
import { cloneElement, isValidElement, useState } from 'react';

interface ReelsViewportProps {
  children: React.ReactNode[];
  totalReels: number;
  onIndexChange?: (index: number) => void;
}

export default function ReelsViewport({ children, totalReels, onIndexChange }: ReelsViewportProps) {
  const { currentIndex, goToNext, goToPrev, updateProgress, getProgress } = useReelsController({
    totalReels,
    onIndexChange,
  });

  const [direction, setDirection] = useState(0);
  const y = useMotionValue(0);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold && currentIndex < totalReels - 1) {
      setDirection(1);
      goToNext();
    } else if (info.offset.y > threshold && currentIndex > 0) {
      setDirection(-1);
      goToPrev();
    }
  };

  const currentChild = children[currentIndex];
  const childWithProps = isValidElement(currentChild) 
    ? cloneElement(currentChild as React.ReactElement<any>, {
        isActive: true,
        onProgress: (progress: number) => updateProgress(currentIndex, progress),
      })
    : currentChild;

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
    }),
    center: {
      y: 0,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? '-100%' : '100%',
    }),
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <ProgressStrips
        total={totalReels}
        current={currentIndex}
        progress={getProgress(currentIndex)}
      />

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          style={{ y }}
          className="absolute inset-0 w-full h-full"
          data-testid="reels-viewport"
        >
          {childWithProps}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
