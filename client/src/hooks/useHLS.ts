// Custom hook для HLS.js с поддержкой активации/деактивации

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean, videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isHLSUrl = videoUrl.includes('.m3u8');

  // СОЗДАЁМ HLS СТРОГО ОДИН РАЗ при монтировании компонента
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHLSUrl) {
      if (video && !isHLSUrl) {
        video.src = videoUrl;
      }
      return;
    }

    // Создаём HLS ТОЛЬКО если его ещё нет
    if (!hlsRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        
        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                hlsRef.current = null;
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      }
    }

    // Cleanup ТОЛЬКО при unmount компонента
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [videoUrl, isHLSUrl]); // isActive НЕ в deps!

  // ОТДЕЛЬНЫЙ эффект для управления воспроизведением на основе isActive
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      // Останавливаем видео когда неактивно
      video.pause();
      video.currentTime = 0;
    }
    // НЕ вызываем play здесь - это делает ReelCard
  }, [isActive]);

  return videoRef;
}
