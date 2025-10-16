import { useLocation } from 'wouter';
import { salesReels } from '@/lib/content';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';

export default function SalesFlow() {
  const [, setLocation] = useLocation();

  const handleFinalCTA = () => {
    setLocation('/training');
  };

  return (
    <div className="h-viewport w-viewport bg-black">
      <ReelsViewport totalReels={salesReels.length}>
        {salesReels.map((reel) => (
          <ReelCard
            key={reel.id}
            id={reel.id}
            videoUrl={reel.videoUrl}
            posterUrl={reel.posterUrl}
            hook={reel.hook}
            ctaText={reel.ctaText}
            isActive={false}
            mode="sales"
            onCTAClick={reel.isFinal ? handleFinalCTA : undefined}
            author={reel.author}
            authorAvatar={reel.authorAvatar}
            title={reel.title}
            descriptionBrief={reel.descriptionBrief}
            descriptionFull={reel.descriptionFull}
            comments={reel.comments}
            likeCount={reel.likeCount}
            shareCount={reel.shareCount}
          />
        ))}
      </ReelsViewport>
    </div>
  );
}
