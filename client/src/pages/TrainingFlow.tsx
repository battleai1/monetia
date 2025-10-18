import { useLocation } from 'wouter';
import { useMemo, useState, useEffect } from 'react';
import { useLessons } from '@/hooks/useVideos';
import { useVideoPreloader } from '@/hooks/useVideoPreloader';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';
import { useTelegram } from '@/hooks/useTelegram';

export default function TrainingFlow() {
  const [, setLocation] = useLocation();
  const { startParam } = useTelegram();
  const { data: lessons, isLoading } = useLessons();
  const [showPreloader, setShowPreloader] = useState(true);
  
  // КРИТИЧНО: устанавливаем CSS переменную для h-viewport на мобильных
  useEffect(() => {
    const updateViewportHeight = () => {
      document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
    };
    
    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  // Собираем URLs для предзагрузки
  const videoUrls = useMemo(() => {
    if (!lessons) return [];
    return lessons.map(lesson => lesson.videoUrl);
  }, [lessons]);

  // Предзагрузка видео (всегда активна, независимо от UI)
  const { loadedCount, totalCount, progress } = useVideoPreloader(
    videoUrls,
    videoUrls.length > 0
  );

  // Логируем прогресс предзагрузки
  useEffect(() => {
    if (loadedCount > 0) {
      console.log(`[TrainingFlow] Preloaded ${loadedCount}/${totalCount} videos (${progress.toFixed(0)}%)`);
    }
  }, [loadedCount, totalCount, progress]);

  // Скрываем UI прелоадера когда первое видео готово (но предзагрузка продолжается)
  useEffect(() => {
    if (loadedCount >= 1 && showPreloader) {
      console.log('[TrainingFlow] First video ready, hiding UI preloader (background preloading continues)');
      setTimeout(() => {
        setShowPreloader(false);
      }, 300);
    }
  }, [loadedCount, showPreloader]);
  
  // Парсим deep link параметр для получения начального индекса
  const initialReelIndex = useMemo(() => {
    if (startParam && startParam.startsWith('reel_') && lessons) {
      const reelNumber = parseInt(startParam.replace('reel_', ''), 10);
      const index = reelNumber - 1; // reel_1 → index 0
      if (index >= 0 && index < lessons.length) {
        console.log('[Deep Link] Opening lesson at index:', index, 'from startParam:', startParam);
        return index;
      }
    }
    return 0;
  }, [startParam, lessons]);

  const handleFinalCTA = () => {
    setLocation('/training/final');
  };

  if (isLoading || !lessons || showPreloader) {
    return (
      <div className="h-viewport w-viewport bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-lg">Загрузка...</div>
        {totalCount > 0 && (
          <div className="text-white/60 text-sm">
            {loadedCount} / {totalCount} видео
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-viewport w-viewport bg-black">
      <ReelsViewport totalReels={lessons.length} initialReelIndex={initialReelIndex}>
        {lessons.map((lesson) => (
          <ReelCard
            key={lesson.id}
            id={lesson.id}
            videoUrl={lesson.videoUrl}
            posterUrl={lesson.posterUrl || undefined}
            lessonTitle={lesson.lessonTitle || undefined}
            lessonBrief={lesson.captionBrief || undefined}
            lessonFull={lesson.captionFull || undefined}
            ctaText={lesson.nextCtaText || undefined}
            isActive={false}
            mode="training"
            onCTAClick={lesson.isFinal ? handleFinalCTA : undefined}
            author={lesson.author || undefined}
            authorAvatar={lesson.authorAvatar || undefined}
            likeCount={lesson.likeCount || 0}
            shareCount={lesson.shareCount || 0}
          />
        ))}
      </ReelsViewport>
    </div>
  );
}
