import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useSalesReels } from '@/hooks/useVideos';
import ReelsViewport from '@/components/ReelsViewport';
import ReelOverlay from '@/components/ReelOverlay';
import IntroCountdown from '@/components/IntroCountdown';
import { useTelegram } from '@/hooks/useTelegram';
import { VideoPlaybackProvider, useVideoPlayback } from '@/contexts/VideoPlaybackContext';

function SalesFlowContent() {
  const [, setLocation] = useLocation();
  const [showCountdown, setShowCountdown] = useState(true);
  const { forcePlayActive } = useVideoPlayback();
  
  const handleCountdownComplete = async () => {
    setShowCountdown(false);
    
    // Форсируем воспроизведение первого видео после countdown
    setTimeout(async () => {
      console.log('[SalesFlow] Countdown complete, forcing play...');
      try {
        await forcePlayActive();
        console.log('[SalesFlow] Force play successful');
      } catch (error) {
        console.error('[SalesFlow] Force play failed:', error);
      }
    }, 100);
  };

  return (
    <>
      {showCountdown && <IntroCountdown onComplete={handleCountdownComplete} />}
      {/* Контент рендерится всегда, но скрыт под countdown */}
      <div className={showCountdown ? 'hidden' : 'block'}>
        {/* Контент будет добавлен через children в ReelsViewportInner */}
      </div>
    </>
  );
}

export default function SalesFlow() {
  const [, setLocation] = useLocation();
  const { startParam } = useTelegram();
  const { data: salesReels, isLoading } = useSalesReels();
  
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

  if (isLoading || !salesReels) {
    return (
      <div className="h-viewport w-viewport bg-black flex items-center justify-center">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="h-viewport w-viewport bg-black relative">
      <VideoPlaybackProvider reels={salesReels} initialIndex={initialReelIndex}>
        {/* Video элемент всегда в DOM (скрыт countdown) */}
        <div className="absolute inset-0">
          <ReelsViewport 
            totalReels={salesReels.length} 
            initialReelIndex={initialReelIndex}
            reels={salesReels}
          >
            {salesReels.map((reel) => (
              <ReelOverlay
                key={reel.id}
                id={reel.id}
                hook={reel.hook || undefined}
                ctaText={reel.ctaText || undefined}
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
                isActive={false} // ReelsViewport will override this
              />
            ))}
          </ReelsViewport>
        </div>
        
        {/* Countdown поверх видео */}
        <SalesFlowContent />
      </VideoPlaybackProvider>
    </div>
  );
}
