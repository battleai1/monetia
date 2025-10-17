import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { salesReels } from '@/lib/content';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';
import IntroCountdown from '@/components/IntroCountdown';

export default function SalesFlow() {
  const [, setLocation] = useLocation();
  const [showCountdown, setShowCountdown] = useState(true);
  const [forcePlayFirst, setForcePlayFirst] = useState(false);

  const handleFinalCTA = () => {
    setLocation('/training');
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    // Принудительно запускаем первое видео после countdown
    setTimeout(() => {
      setForcePlayFirst(true);
    }, 100);
  };

  useEffect(() => {
    if (forcePlayFirst) {
      // Сбрасываем флаг после применения
      const timer = setTimeout(() => setForcePlayFirst(false), 500);
      return () => clearTimeout(timer);
    }
  }, [forcePlayFirst]);

  return (
    <div className="h-viewport w-viewport bg-black">
      {showCountdown && <IntroCountdown onComplete={handleCountdownComplete} />}
      
      {!showCountdown && (
        <ReelsViewport totalReels={salesReels.length}>
        {salesReels.map((reel, index) => (
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
            forcePlay={index === 0 ? forcePlayFirst : false}
          />
        ))}
      </ReelsViewport>
      )}
    </div>
  );
}
