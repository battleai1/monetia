import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean = true) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isCleaningUpRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHLS = videoUrl.includes('.m3u8');
    
    console.log('[HLS] useEffect triggered - isActive:', isActive, 'hlsRef exists:', !!hlsRef.current, 'videoUrl:', videoUrl.substring(videoUrl.length - 20));
    
    // КРИТИЧНО: Инициализируем HLS ТОЛЬКО для активного видео!
    if (isHLS && isActive) {
      if (Hls.isSupported()) {
        // Ждем пока завершится предыдущий cleanup
        if (isCleaningUpRef.current) {
          console.log('[HLS] Cleanup in progress, waiting...');
          return;
        }
        
        // Только создаем новый HLS если его еще нет
        if (!hlsRef.current) {
          console.log('[HLS] Creating NEW HLS instance for:', videoUrl);
          
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });
          
          hlsRef.current = hls;
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('[HLS] Manifest parsed successfully');
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error('[HLS] Fatal error:', data);
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log('[HLS] Network error, trying to recover...');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log('[HLS] Media error, trying to recover...');
                  hls.recoverMediaError();
                  break;
                default:
                  console.error('[HLS] Cannot recover from error');
                  hls.destroy();
                  hlsRef.current = null;
                  break;
              }
            }
          });
        } else {
          console.log('[HLS] HLS instance already exists, reusing');
        }
        
        return () => {
          // Уничтожаем HLS при размонтировании или когда видео становится неактивным
          console.log('[HLS] CLEANUP called - destroying HLS');
          isCleaningUpRef.current = true;
          
          if (hlsRef.current) {
            const hlsToDestroy = hlsRef.current;
            hlsRef.current = null; // Сразу обнуляем чтобы новый useEffect не видел старый
            
            // Останавливаем видео и уничтожаем HLS
            try {
              hlsToDestroy.destroy();
              console.log('[HLS] CLEANUP complete');
            } catch (e) {
              console.error('[HLS] Error during cleanup:', e);
            }
          }
          
          isCleaningUpRef.current = false;
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('[HLS] Using native HLS support (Safari)');
        video.src = videoUrl;
      } else {
        console.error('[HLS] HLS is not supported in this browser');
      }
    } else if (!isHLS) {
      video.src = videoUrl;
    } else {
      console.log('[HLS] Skipping HLS init - isActive is false');
    }
  }, [videoUrl, isActive]);

  return videoRef;
}
