import { useLocation } from 'wouter';
import { useMemo } from 'react';
import { useLessons } from '@/hooks/useVideos';
import ReelsViewport from '@/components/ReelsViewport';
import ReelOverlay from '@/components/ReelOverlay';
import { useTelegram } from '@/hooks/useTelegram';
import { VideoPlaybackProvider } from '@/contexts/VideoPlaybackContext';

export default function TrainingFlow() {
  const [, setLocation] = useLocation();
  const { startParam } = useTelegram();
  const { data: lessons, isLoading } = useLessons();
  
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

  if (isLoading || !lessons) {
    return (
      <div className="h-viewport w-viewport bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="h-viewport w-viewport bg-black">
      <VideoPlaybackProvider reels={lessons} initialIndex={initialReelIndex}>
        <ReelsViewport 
          totalReels={lessons.length} 
          initialReelIndex={initialReelIndex}
          reels={lessons}
        >
          {lessons.map((lesson) => (
            <ReelOverlay
              key={lesson.id}
              id={lesson.id}
              lessonTitle={lesson.lessonTitle || undefined}
              lessonBrief={lesson.captionBrief || undefined}
              lessonFull={lesson.captionFull || undefined}
              ctaText={lesson.ctaText || undefined}
              mode="training"
              onCTAClick={lesson.isFinal ? handleFinalCTA : undefined}
              isActive={false} // ReelsViewport will override this
            />
          ))}
        </ReelsViewport>
      </VideoPlaybackProvider>
    </div>
  );
}
