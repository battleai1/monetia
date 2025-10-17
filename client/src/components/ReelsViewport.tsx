import { motion, PanInfo, useMotionValue, animate } from 'framer-motion';
import { useReelsController } from '@/hooks/useReelsController';
import ProgressStrips from './ProgressStrips';
import { cloneElement, isValidElement, useRef, useEffect, useState } from 'react';
import { useViewportHeight } from '@/hooks/useViewportHeight';

interface ReelsViewportProps {
  children: React.ReactNode[];
  totalReels: number;
  initialReelIndex?: number;
  onIndexChange?: (index: number) => void;
}

export default function ReelsViewport({ children, totalReels, initialReelIndex, onIndexChange }: ReelsViewportProps) {
  const { currentIndex, goToNext, goToPrev, updateProgress, getProgress } = useReelsController({
    totalReels,
    initialIndex: initialReelIndex,
    onIndexChange,
  });

  const y = useMotionValue(0);
  const animationRef = useRef<any>(null);
  const viewportHeight = useViewportHeight();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Компенсируем смещение при смене индекса
  useEffect(() => {
    const currentY = y.get();
    if (currentY <= -viewportHeight || currentY >= viewportHeight) {
      // Сброс после рендера через микротаску
      Promise.resolve().then(() => {
        y.set(0);
      });
    }
  }, [currentIndex, y, viewportHeight]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    // Отменяем предыдущую анимацию если есть
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    const currentY = y.get();
    const threshold = viewportHeight * 0.3; // 30% от высоты экрана
    
    if (currentY < -threshold && currentIndex < totalReels - 1) {
      // Свайп вверх - переход на следующее видео
      animationRef.current = animate(y, -viewportHeight, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          goToNext();
          animationRef.current = null;
        }
      });
    } else if (currentY > threshold && currentIndex > 0) {
      // Свайп вниз - переход на предыдущее видео
      animationRef.current = animate(y, viewportHeight, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          goToPrev();
          animationRef.current = null;
        }
      });
    } else {
      // Не достигли порога - возврат обратно (от текущей позиции к 0)
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

  const handleVideoEnded = () => {
    if (currentIndex < totalReels - 1) {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      animationRef.current = animate(y, -viewportHeight, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          goToNext();
          animationRef.current = null;
        }
      });
    }
  };

  return (
    <div className="relative w-full h-viewport bg-black overflow-hidden">
      <ProgressStrips
        total={totalReels}
        current={currentIndex}
        progress={getProgress(currentIndex)}
      />

      <motion.div
        drag={isCommentsOpen ? false : "y"}
        dragConstraints={{ top: -viewportHeight * 1.2, bottom: viewportHeight * 1.2 }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="relative w-full h-full"
        data-testid="reels-viewport"
      >
        {/* Рендерим ВСЕ видео сразу - React НЕ будет их размонтировать! */}
        {children.map((child, index) => {
          if (!isValidElement(child)) return null;
          
          const isActive = index === currentIndex;
          const position = (index - currentIndex) * 100; // -100%, 0%, +100%
          
          const childWithProps = cloneElement(child as React.ReactElement<any>, {
            isActive,
            onProgress: isActive ? (progress: number) => updateProgress(index, progress) : undefined,
            onVideoEnded: isActive ? handleVideoEnded : undefined,
            onCommentsOpenChange: isActive ? setIsCommentsOpen : undefined,
          });

          return (
            <div
              key={(child as React.ReactElement<any>).key}
              className="absolute inset-0 w-full h-full"
              style={{ transform: `translateY(${position}%)` }}
            >
              {childWithProps}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
