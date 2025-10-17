import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { salesReels } from '@/lib/content';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';
import IntroCountdown from '@/components/IntroCountdown';
import { useTelegram } from '@/hooks/useTelegram';

export default function SalesFlow() {
  const [, setLocation] = useLocation();
  const [showCountdown, setShowCountdown] = useState(true);
  const [forcePlayFirst, setForcePlayFirst] = useState(false);
  const { startParam } = useTelegram();
  
  // Парсим deep link параметр для получения начального индекса
  const initialReelIndex = useMemo(() => {
    if (startParam && startParam.startsWith('reel_')) {
      const reelNumber = parseInt(startParam.replace('reel_', ''), 10);
      const index = reelNumber - 1; // reel_1 → index 0
      if (index >= 0 && index < salesReels.length) {
        console.log('[Deep Link] Opening reel at index:', index, 'from startParam:', startParam);
        return index;
      }
    }
    return 0;
  }, [startParam]);

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
        <ReelsViewport totalReels={salesReels.length} initialReelIndex={initialReelIndex}>
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
