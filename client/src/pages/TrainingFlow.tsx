import { useLocation } from 'wouter';
import { useMemo } from 'react';
import { useLessons } from '@/hooks/useVideos';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';
import { useTelegram } from '@/hooks/useTelegram';

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
      <div className="h-viewport w-viewport bg-black flex items-center justify-center">
        <div className="text-white text-lg">Загрузка...</div>
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
