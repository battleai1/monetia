import { motion, PanInfo, useMotionValue, animate } from 'framer-motion';
import { useReelsController } from '@/hooks/useReelsController';
import ProgressStrips from './ProgressStrips';
import { cloneElement, isValidElement, useRef } from 'react';

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

  const y = useMotionValue(0);
  const isAnimating = useRef(false);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (isAnimating.current) return;
    
    const threshold = 50;
    
    if (info.offset.y < -threshold && currentIndex < totalReels - 1) {
      isAnimating.current = true;
      animate(y, -window.innerHeight, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          goToNext();
          y.set(0);
          isAnimating.current = false;
        }
      });
    } else if (info.offset.y > threshold && currentIndex > 0) {
      isAnimating.current = true;
      animate(y, window.innerHeight, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          goToPrev();
          y.set(0);
          isAnimating.current = false;
        }
      });
    } else {
      animate(y, 0, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  };

  const currentChild = children[currentIndex];
  const nextChild = currentIndex < totalReels - 1 ? children[currentIndex + 1] : null;
  const prevChild = currentIndex > 0 ? children[currentIndex - 1] : null;

  const currentWithProps = isValidElement(currentChild) 
    ? cloneElement(currentChild as React.ReactElement<any>, {
        isActive: true,
        onProgress: (progress: number) => updateProgress(currentIndex, progress),
      })
    : currentChild;

  const nextWithProps = isValidElement(nextChild)
    ? cloneElement(nextChild as React.ReactElement<any>, {
        isActive: false,
      })
    : nextChild;

  const prevWithProps = isValidElement(prevChild)
    ? cloneElement(prevChild as React.ReactElement<any>, {
        isActive: false,
      })
    : prevChild;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <ProgressStrips
        total={totalReels}
        current={currentIndex}
        progress={getProgress(currentIndex)}
      />

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="relative w-full h-full"
        data-testid="reels-viewport"
      >
        {/* Previous reel */}
        {prevChild && (
          <div className="absolute inset-0 w-full h-full" style={{ transform: 'translateY(-100%)' }}>
            {prevWithProps}
          </div>
        )}

        {/* Current reel */}
        <div className="absolute inset-0 w-full h-full">
          {currentWithProps}
        </div>

        {/* Next reel */}
        {nextChild && (
          <div className="absolute inset-0 w-full h-full" style={{ transform: 'translateY(100%)' }}>
            {nextWithProps}
          </div>
        )}
      </motion.div>
    </div>
  );
}
