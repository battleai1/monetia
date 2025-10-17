import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const urlRef = useRef<string>('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHLS = videoUrl.includes('.m3u8');
    
    // КРИТИЧЕСКИ ВАЖНО: НЕ создаём HLS для неактивных видео!
    if (!isActive) {
      console.log('[HLS] 🚫 INACTIVE - skipping HLS for:', videoUrl.substring(0, 50));
      return;
    }

    // Если URL изменился - уничтожаем старый HLS
    if (urlRef.current !== videoUrl && hlsRef.current) {
      console.log('[HLS] 🔄 URL changed, destroying old HLS');
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    if (isHLS) {
      if (Hls.isSupported()) {
        // Создаём HLS ТОЛЬКО если активно И ещё нет instance
        if (!hlsRef.current) {
          console.log('[HLS] ✅ Creating HLS for ACTIVE video:', videoUrl.substring(0, 50));
          urlRef.current = videoUrl;
          
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });
          
          hlsRef.current = hls;
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('[HLS] ✅ Ready');
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error('[HLS] ❌ Fatal:', data.type);
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

    // Cleanup при unmount
    return () => {
      if (hlsRef.current) {
        console.log('[HLS] 🗑️ Cleanup');
        hlsRef.current.destroy();
        hlsRef.current = null;
        urlRef.current = '';
      }
    };
  }, [videoUrl, isActive]);

  return videoRef;
}
