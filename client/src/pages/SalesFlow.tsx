import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useSalesReels } from '@/hooks/useVideos';
import { useVideoPreloader } from '@/hooks/useVideoPreloader';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';
import IntroCountdown from '@/components/IntroCountdown';
import { useTelegram } from '@/hooks/useTelegram';

export default function SalesFlow() {
  const [, setLocation] = useLocation();
  const [showCountdown, setShowCountdown] = useState(true);
  const [forcePlayFirst, setForcePlayFirst] = useState(false);
  const { startParam } = useTelegram();
  const { data: salesReels, isLoading } = useSalesReels();
  
  // Собираем URLs для предзагрузки
  const videoUrls = useMemo(() => {
    if (!salesReels) return [];
    return salesReels.map(reel => reel.videoUrl);
  }, [salesReels]);

  // Предзагрузка видео во время countdown
  const { loadedCount, totalCount, progress } = useVideoPreloader(
    videoUrls,
    showCountdown && videoUrls.length > 0
  );

  // Логируем прогресс предзагрузки
  useEffect(() => {
    if (loadedCount > 0) {
      console.log(`[SalesFlow] Preloaded ${loadedCount}/${totalCount} videos (${progress.toFixed(0)}%)`);
    }
  }, [loadedCount, totalCount, progress]);
  
  // Парсим deep link параметр для получения начального индекса
  const initialReelIndex = useMemo(() => {
    if (startParam && startParam.startsWith('reel_') && salesReels) {
      const reelNumber = parseInt(startParam.replace('reel_', ''), 10);
      const index = reelNumber - 1; // reel_1 → index 0
      if (index >= 0 && index < salesReels.length) {
        console.log('[Deep Link] Opening reel at index:', index, 'from startParam:', startParam);
        return index;
      }
    }
    return 0;
  }, [startParam, salesReels]);

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

  if (isLoading || !salesReels) {
    return (
      <div className="h-viewport w-viewport bg-black flex items-center justify-center">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    );
  }

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
            posterUrl={reel.posterUrl || undefined}
            hook={reel.hook || undefined}
            ctaText={reel.ctaText || undefined}
            isActive={false}
            mode="sales"
            onCTAClick={reel.isFinal ? handleFinalCTA : undefined}
            author={reel.author || ""}
            authorAvatar={reel.authorAvatar || undefined}
            title={reel.title || ""}
            descriptionBrief={reel.descriptionBrief || ""}
            descriptionFull={reel.descriptionFull || ""}
            comments={(reel.comments as any) || []}
            likeCount={reel.likeCount || 0}
            shareCount={reel.shareCount || 0}
            forcePlay={index === 0 ? forcePlayFirst : false}
          />
        ))}
      </ReelsViewport>
      )}
    </div>
  );
}
