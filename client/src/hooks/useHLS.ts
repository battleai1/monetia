// Custom hook для HLS.js - использует глобальный менеджер

import { useEffect, useRef } from 'react';
import { hlsManager } from '@/lib/hlsManager';

export function useHLS(videoUrl: string, isActive: boolean, videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Активируем это видео в глобальном менеджере
      hlsManager.setActiveVideo(video, videoUrl, videoId);
    } else {
      // Деактивируем это видео
      hlsManager.deactivateVideo(videoId);
      
      // Останавливаем воспроизведение
      video.pause();
      video.currentTime = 0;
    }

    // Cleanup при unmount
    return () => {
      hlsManager.deactivateVideo(videoId);
    };
  }, [isActive, videoUrl, videoId]);

  return videoRef;
}
