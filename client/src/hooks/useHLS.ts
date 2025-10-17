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
      console.log('[useHLS] ACTIVATE', videoId);
      // АКТИВАЦИЯ: Создаём HLS если его нет
      if (isHLSUrl) {
        if (Hls.isSupported()) {
          if (!hlsRef.current) {
            console.log('[useHLS] CREATE HLS', videoId);
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
      console.log('[useHLS] DEACTIVATE', videoId);
      // ДЕАКТИВАЦИЯ: ПОЛНОСТЬЮ останавливаем и очищаем видео
      video.pause();
      
      if (hlsRef.current) {
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      // Полностью очищаем src и перезагружаем элемент
      video.removeAttribute('src');
      video.load();
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
