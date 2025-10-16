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

  // При изменении индекса - анимируем к новой позиции (БЕЗ СБРОСА!)
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    const targetY = -currentIndex * viewportHeight;
    
    animationRef.current = animate(y, targetY, {
      type: "spring",
      stiffness: 400,
      damping: 40,
      restSpeed: 0.01,
      restDelta: 0.01,
      onComplete: () => {
        animationRef.current = null;
      }
    });
  }, [currentIndex, viewportHeight, y]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const currentY = y.get();
    const targetY = -currentIndex * viewportHeight;
    const offset = currentY - targetY;
    const threshold = viewportHeight * 0.3; // 30% от высоты экрана
    
    if (offset < -threshold && currentIndex < totalReels - 1) {
      // Свайп вверх - переход на следующее видео
      goToNext();
    } else if (offset > threshold && currentIndex > 0) {
      // Свайп вниз - переход на предыдущее видео
      goToPrev();
    } else {
      // Не достигли порога - возврат обратно к текущей позиции
      if (animationRef.current) {
        animationRef.current.stop();
      }
      
      animationRef.current = animate(y, targetY, {
        type: "spring",
        stiffness: 400,
        damping: 40,
        restSpeed: 0.01,
        restDelta: 0.01,
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
        dragConstraints={{ top: -viewportHeight * 2, bottom: viewportHeight * 2 }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="relative w-full h-full"
        data-testid="reels-viewport"
      >
        {/* Previous reel - статичная позиция -100% */}
        {prevChild && (
          <div 
            key={`reel-${currentIndex - 1}`} 
            className="absolute inset-0 w-full h-full" 
            style={{ transform: 'translateY(-100%)' }}
          >
            {prevWithProps}
          </div>
        )}

        {/* Current reel - статичная позиция 0 */}
        <div 
          key={`reel-${currentIndex}`} 
          className="absolute inset-0 w-full h-full"
        >
          {currentWithProps}
        </div>

        {/* Next reel - статичная позиция 100% */}
        {nextChild && (
          <div 
            key={`reel-${currentIndex + 1}`} 
            className="absolute inset-0 w-full h-full" 
            style={{ transform: 'translateY(100%)' }}
          >
            {nextWithProps}
          </div>
        )}
      </motion.div>
    </div>
  );
}
