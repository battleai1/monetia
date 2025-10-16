import { useLocation } from 'wouter';
import { lessons } from '@/lib/content';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';

export default function TrainingFlow() {
  const [, setLocation] = useLocation();

  const handleFinalCTA = () => {
    setLocation('/training/final');
  };

  return (
    <div className="h-screen w-full bg-black">
      <ReelsViewport totalReels={lessons.length}>
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
          />
        ))}
      </ReelsViewport>
    </div>
  );
}
