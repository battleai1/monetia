import { motion, PanInfo, useMotionValue, animate } from 'framer-motion';
import { useReelsController } from '@/hooks/useReelsController';
import ProgressStrips from './ProgressStrips';
import { isValidElement, useRef, useEffect, useState } from 'react';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useVideoPlayback } from '@/contexts/VideoPlaybackContext';
import VideoPlayerShell from './VideoPlayerShell';

interface ReelsViewportProps {
  children: React.ReactNode[];
  totalReels: number;
  initialReelIndex?: number;
  onIndexChange?: (index: number) => void;
  reels: any[];
}

function ReelsViewportInner({ children, totalReels, initialReelIndex, onIndexChange, reels }: ReelsViewportProps) {
  const { currentIndex, goToNext, goToPrev, updateProgress, getProgress } = useReelsController({
    totalReels,
    initialIndex: initialReelIndex,
    onIndexChange,
  });

  const y = useMotionValue(0);
  const animationRef = useRef<any>(null);
  const viewportHeight = useViewportHeight();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  
  const { setIndex, onEnded, onProgress } = useVideoPlayback();

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

  // Синхронизация индекса с VideoPlayback контроллером
  useEffect(() => {
    console.log('[ReelsViewport] Syncing index with controller:', currentIndex);
    setIndex(currentIndex);
  }, [currentIndex, setIndex]);

  // Подписываемся на прогресс и конец видео
  useEffect(() => {
    onProgress((progress: number) => {
      updateProgress(currentIndex, progress);
    });

    onEnded(() => {
      handleVideoEnded();
    });
  }, [currentIndex, onProgress, onEnded]);

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

      {/* Единственный video элемент для всех reels */}
      <VideoPlayerShell posterUrl={reels[currentIndex]?.posterUrl} />

      <motion.div
        drag={isCommentsOpen ? false : "y"}
        dragConstraints={{ top: -viewportHeight * 1.2, bottom: viewportHeight * 1.2 }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="relative w-full h-full"
        data-testid="reels-viewport"
      >
        {/* Рендерим оверлеи для всех видео */}
        {children.map((child, index) => {
          if (!isValidElement(child)) return null;
          
          const isActive = index === currentIndex;
          const position = (index - currentIndex) * 100; // -100%, 0%, +100%
          
          return (
            <div
              key={(child as React.ReactElement<any>).key}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: `translateY(${position}%)` }}
            >
              <div className="relative w-full h-full pointer-events-auto">
                {/* Клонируем child как оверлей, передаём isActive */}
                {isValidElement(child) && (
                  <child.type 
                    {...child.props} 
                    isActive={isActive}
                    onCommentsOpenChange={isActive ? setIsCommentsOpen : undefined}
                  />
                )}
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function ReelsViewport({ children, totalReels, initialReelIndex, onIndexChange, reels }: ReelsViewportProps) {
  return (
    <ReelsViewportInner
      children={children}
      totalReels={totalReels}
      initialReelIndex={initialReelIndex}
      onIndexChange={onIndexChange}
      reels={reels}
    />
  );
}
