import { motion, PanInfo, useMotionValue, animate } from 'framer-motion';
import { useReelsController } from '@/hooks/useReelsController';
import ProgressStrips from './ProgressStrips';
import { cloneElement, isValidElement, useRef, useEffect } from 'react';
import { useViewportHeight } from '@/hooks/useViewportHeight';

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
  const animationRef = useRef<any>(null);
  const viewportHeight = useViewportHeight();

  // Сбрасываем позицию при смене индекса
  useEffect(() => {
    y.set(0);
  }, [currentIndex, y]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    // Отменяем предыдущую анимацию если есть
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    const threshold = viewportHeight * 0.3; // 30% от высоты экрана
    
    if (info.offset.y < -threshold && currentIndex < totalReels - 1) {
      // Свайп вверх - переход на следующее видео
      goToNext();
      animationRef.current = animate(y, -viewportHeight, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          y.set(0);
          animationRef.current = null;
        }
      });
    } else if (info.offset.y > threshold && currentIndex > 0) {
      // Свайп вниз - переход на предыдущее видео
      goToPrev();
      animationRef.current = animate(y, viewportHeight, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          y.set(0);
          animationRef.current = null;
        }
      });
    } else {
      // Не достигли порога - возврат обратно
      animationRef.current = animate(y, 0, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          animationRef.current = null;
        }
      });
    }
  };

  const currentChild = children[currentIndex];
  const nextChild = currentIndex < totalReels - 1 ? children[currentIndex + 1] : null;
  const prevChild = currentIndex > 0 ? children[currentIndex - 1] : null;

  const handleVideoEnded = () => {
    if (currentIndex < totalReels - 1) {
      goToNext();
      if (animationRef.current) {
        animationRef.current.stop();
      }
      animationRef.current = animate(y, -viewportHeight, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          y.set(0);
          animationRef.current = null;
        }
      });
    }
  };

  const currentWithProps = isValidElement(currentChild) 
    ? cloneElement(currentChild as React.ReactElement<any>, {
        isActive: true,
        onProgress: (progress: number) => updateProgress(currentIndex, progress),
        onVideoEnded: handleVideoEnded,
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
    <div className="relative w-full h-viewport bg-black overflow-hidden">
      <ProgressStrips
        total={totalReels}
        current={currentIndex}
        progress={getProgress(currentIndex)}
      />

      <motion.div
        drag="y"
        dragConstraints={{ top: -viewportHeight, bottom: viewportHeight }}
        dragElastic={0.05}
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
