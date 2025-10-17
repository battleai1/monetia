import { useLocation } from 'wouter';
import { useMemo } from 'react';
import { lessons } from '@/lib/content';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';
import { useTelegram } from '@/hooks/useTelegram';

export default function TrainingFlow() {
  const [, setLocation] = useLocation();
  const { startParam } = useTelegram();
  
  // Парсим deep link параметр для получения начального индекса
  const initialReelIndex = useMemo(() => {
    if (startParam && startParam.startsWith('reel_')) {
      const reelNumber = parseInt(startParam.replace('reel_', ''), 10);
      const index = reelNumber - 1; // reel_1 → index 0
      if (index >= 0 && index < lessons.length) {
        console.log('[Deep Link] Opening lesson at index:', index, 'from startParam:', startParam);
        return index;
      }
    }
    return 0;
  }, [startParam]);

  const handleFinalCTA = () => {
    setLocation('/training/final');
  };

  return (
    <div className="h-viewport w-viewport bg-black">
      <ReelsViewport totalReels={lessons.length} initialReelIndex={initialReelIndex}>
        {lessons.map((lesson) => (
          <ReelCard
            key={lesson.id}
            id={lesson.id}
            videoUrl={lesson.videoUrl}
            posterUrl={lesson.posterUrl}
            lessonTitle={lesson.lessonTitle}
            lessonBrief={lesson.captionBrief}
            lessonFull={lesson.captionFull}
            ctaText={lesson.nextCtaText}
            isActive={false}
            mode="training"
            onCTAClick={lesson.isFinal ? handleFinalCTA : undefined}
            author={lesson.author}
            authorAvatar={lesson.authorAvatar}
            likeCount={lesson.likeCount}
            shareCount={lesson.shareCount}
          />
        ))}
      </ReelsViewport>
    </div>
  );
}
