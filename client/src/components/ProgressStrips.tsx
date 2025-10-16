import { useEffect, useState } from 'react';

interface ProgressStripsProps {
  total: number;
  current: number;
  progress: number;
}

export default function ProgressStrips({ total, current, progress }: ProgressStripsProps) {
  const [isMobileTelegram, setIsMobileTelegram] = useState(false);

  useEffect(() => {
    // Проверяем, что мы в Telegram WebApp на мобильном устройстве
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp;
    
    setIsMobileTelegram(isMobile && !!isTelegram);
  }, []);

  return (
    <div 
      className="absolute top-0 left-0 right-0 z-50 px-4 pt-2 pb-2"
      style={{
        paddingTop: isMobileTelegram ? '104px' : undefined,
      }}
    >
      <div className="flex gap-1 mb-2">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden"
            data-testid={`progress-strip-${index}`}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{
                width: index < current ? '100%' : index === current ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>
      <div className="text-white/70 text-xs text-right" data-testid="progress-counter">
        {current + 1}/{total}
      </div>
    </div>
  );
}
