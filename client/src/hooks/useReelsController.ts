import { useState, useCallback, useEffect, useRef } from 'react';
import { useTelegram } from './useTelegram';

interface UseReelsControllerProps {
  totalReels: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
}

export const useReelsController = ({
  totalReels,
  initialIndex = 0,
  onIndexChange,
}: UseReelsControllerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [watchProgress, setWatchProgress] = useState<Record<number, number>>({});
  const { triggerHaptic } = useTelegram();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goToNext = useCallback(() => {
    if (currentIndex < totalReels - 1) {
      setCurrentIndex((prev) => prev + 1);
      triggerHaptic('light');
    }
  }, [currentIndex, totalReels, triggerHaptic]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      triggerHaptic('light');
    }
  }, [currentIndex, triggerHaptic]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < totalReels) {
      setCurrentIndex(index);
      triggerHaptic('light');
    }
  }, [totalReels, triggerHaptic]);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const updateProgress = useCallback((index: number, progress: number) => {
    setWatchProgress((prev) => ({ ...prev, [index]: progress }));
  }, []);

  const getProgress = useCallback((index: number) => {
    return watchProgress[index] || 0;
  }, [watchProgress]);

  return {
    currentIndex,
    goToNext,
    goToPrev,
    goToIndex,
    updateProgress,
    getProgress,
    videoRefs,
  };
};
