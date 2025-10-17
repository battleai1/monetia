import { useState } from 'react';
import { useLocation } from 'wouter';
import { salesReels } from '@/lib/content';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';
import IntroCountdown from '@/components/IntroCountdown';

export default function SalesFlow() {
  const [, setLocation] = useLocation();
  const [showCountdown, setShowCountdown] = useState(true);

  const handleFinalCTA = () => {
    setLocation('/training');
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
  };

  return (
    <div className="h-viewport w-viewport bg-black">
      {showCountdown && <IntroCountdown onComplete={handleCountdownComplete} />}
      
      {!showCountdown && (
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
      )}
    </div>
  );
}
