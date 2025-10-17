import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean, videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isHLSUrl = videoUrl.includes('.m3u8');

  // Создаём/уничтожаем HLS в зависимости от isActive
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // АКТИВАЦИЯ: Создаём HLS если его нет
      if (isHLSUrl) {
        if (Hls.isSupported()) {
          if (!hlsRef.current) {
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
          }
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = videoUrl;
        }
      } else {
        video.src = videoUrl;
      }
    } else {
      // ДЕАКТИВАЦИЯ: АГРЕССИВНО останавливаем ВСЁ
      
      // 1. Останавливаем воспроизведение
      video.pause();
      video.currentTime = 0;
      
      // 2. Уничтожаем HLS ПЕРЕД detach
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      // 3. Полностью очищаем video element
      video.removeAttribute('src');
      video.src = '';
      video.load();
      
      // 4. Убеждаемся что видео точно остановлено
      video.pause();
    }

    // Cleanup при unmount компонента
    return () => {
      if (hlsRef.current) {
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [isActive, videoUrl, isHLSUrl]);

  return videoRef;
}
