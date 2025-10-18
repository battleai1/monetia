import { motion, PanInfo, useMotionValue, animate } from 'framer-motion';
import { useReelsController } from '@/hooks/useReelsController';
import ProgressStrips from './ProgressStrips';
import { cloneElement, isValidElement, useRef, useEffect, useState } from 'react';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { videoController } from '@/lib/video-controller';

interface ReelsViewportProps {
  children: React.ReactNode[];
  totalReels: number;
  initialReelIndex?: number;
  onIndexChange?: (index: number) => void;
}

// Определение окружения (с защитой от cross-origin)
let inIframe = false;
try {
  inIframe = typeof window !== 'undefined' && window.top !== window.self;
} catch (e) {
  // Cross-origin access blocked
}
const isReplit = typeof window !== 'undefined' && (/replit/i.test(location.hostname) || /replit/i.test(document.referrer));
const isTelegram = typeof window !== 'undefined' && (/Telegram/i.test(navigator.userAgent) || !!(window as any).Telegram?.WebApp);

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
  const cardsRef = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastActivatedIndexRef = useRef<number>(-1);

  // Telegram WebApp initialization
  useEffect(() => {
    try {
      (window as any).Telegram?.WebApp?.ready?.();
      (window as any).Telegram?.WebApp?.expand?.();
      console.log('[ReelsViewport] Telegram WebApp initialized');
    } catch (e) {}
  }, []);

  // IntersectionObserver для автоактивации видео при 60%+ видимости
  useEffect(() => {
    console.log('[ReelsViewport] Creating IntersectionObserver...');
    const io = new IntersectionObserver(
      (entries) => {
        console.log(`[ReelsViewport] IO callback - ${entries.length} entries`);
        let best: { id: string; ratio: number; index: number } | null = null;
        for (const e of entries) {
          const el = e.target as HTMLElement;
          const id = el.dataset['videoId'];
          const indexStr = el.dataset['index'];
          console.log(`[ReelsViewport] Entry: id=${id} index=${indexStr} ratio=${e.intersectionRatio.toFixed(2)} intersecting=${e.isIntersecting}`);
          if (!id || !indexStr) continue;
          const index = parseInt(indexStr, 10);
          if (e.isIntersecting) {
            if (!best || e.intersectionRatio > best.ratio) {
              best = { id, ratio: e.intersectionRatio, index };
            }
          }
        }
        if (best && best.ratio >= 0.6) {
          console.log(`[ReelsViewport] Activating ${best.id} at index ${best.index} (${Math.round(best.ratio * 100)}% visible)`);
          videoController.activate(best.id);
          // Синхронизируем currentIndex с видимым роликом (только если изменился)
          if (lastActivatedIndexRef.current !== best.index) {
            console.log(`[ReelsViewport] Index changed from ${lastActivatedIndexRef.current} to ${best.index}`);
            lastActivatedIndexRef.current = best.index;
            onIndexChange?.(best.index);
          }
        }
      },
      { 
        root: null, // viewport по умолчанию
        threshold: [0, 0.2, 0.6, 0.8, 1]
      }
    );
    observerRef.current = io;
    console.log('[ReelsViewport] IntersectionObserver created');

    // Не стопаем видео в TG и Replit iframe (ложные visibility events)
    if (!isTelegram && !(inIframe && isReplit)) {
      const onVis = () => {
        if (document.visibilityState !== 'visible') {
          console.log('[ReelsViewport] Page hidden, pausing all videos');
          videoController.pauseAll();
        }
      };
      const onPageHide = () => {
        console.log('[ReelsViewport] Page hiding, pausing all videos');
        videoController.pauseAll();
      };
      document.addEventListener('visibilitychange', onVis);
      window.addEventListener('pagehide', onPageHide);
      return () => {
        io.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('pagehide', onPageHide);
      };
    } else {
      // Dev: форс-активация первого ролика в iframe
      if (inIframe && isReplit && children.length > 0) {
        setTimeout(() => {
          const firstChild = children[0] as React.ReactElement<any>;
          const firstId = firstChild?.props?.id;
          if (firstId) {
            console.log('[ReelsViewport] Force-activating first reel in Replit iframe:', firstId);
            videoController.activate(firstId);
          }
        }, 400);
      }
      return () => {
        io.disconnect();
      };
    }
  }, []); // Создаём только один раз

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

      <div
        className="relative w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: 'y mandatory' }}
        data-testid="reels-viewport"
      >
        {/* КРИТИЧНО: ФИЛЬТРУЕМ массив ДО map чтобы РЕАЛЬНО размонтировать компоненты */}
        {children
          .slice(Math.max(0, currentIndex - 1), currentIndex + 2)
          .map((child, filteredIndex) => {
            if (!isValidElement(child)) return null;
            
            // Вычисляем оригинальный индекс
            const originalIndex = Math.max(0, currentIndex - 1) + filteredIndex;
            const isActive = originalIndex === currentIndex;
            const position = (originalIndex - currentIndex) * 100;
            
            // СТАБИЛЬНЫЙ KEY из props.id
            const childProps = (child as React.ReactElement<any>).props;
            const stableKey = childProps.id;
            
            const childWithProps = cloneElement(child as React.ReactElement<any>, {
              isActive,
              onProgress: isActive ? (progress: number) => updateProgress(originalIndex, progress) : undefined,
              onVideoEnded: isActive ? handleVideoEnded : undefined,
              onCommentsOpenChange: isActive ? setIsCommentsOpen : undefined,
            });

            return (
              <div
                key={stableKey}
                ref={(el) => {
                  if (el) {
                    console.log(`[ReelsViewport] Observing ${stableKey} at index ${originalIndex}`);
                    cardsRef.current.set(stableKey, el);
                    // Observe новую карту сразу
                    observerRef.current?.observe(el);
                  } else {
                    // Unobserve удаленную карту
                    const oldEl = cardsRef.current.get(stableKey);
                    if (oldEl) observerRef.current?.unobserve(oldEl);
                    cardsRef.current.delete(stableKey);
                  }
                }}
                data-video-id={stableKey}
                data-index={originalIndex}
                className="w-full h-full snap-start snap-always shrink-0"
              >
                {childWithProps}
              </div>
            );
          })}
      </div>
    </div>
  );
}
