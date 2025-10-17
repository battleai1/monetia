import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean, videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      console.log('[useHLS] No video element', videoId);
      return;
    }

    const isHLS = videoUrl.includes('.m3u8');
    console.log('[useHLS] Effect running -', videoId, 'isActive:', isActive, 'hasHLS:', !!hlsRef.current);
    
    // НЕ создаём HLS для неактивных видео
    if (!isActive) {
      console.log('[useHLS] SKIP inactive', videoId);
      return;
    }
    
    if (isHLS) {
      if (Hls.isSupported()) {
        // Создаём HLS ТОЛЬКО если активно И ещё нет instance
        if (!hlsRef.current) {
          console.log('[useHLS] ✅ CREATE HLS', videoId);
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });
          
          hlsRef.current = hls;
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('[useHLS] ✅ READY', videoId);
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error('[useHLS] ❌ FATAL', videoId, data.type);
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
        } else {
          console.log('[useHLS] ♻️ REUSE HLS', videoId);
        }
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('[useHLS] Native HLS', videoId);
        video.src = videoUrl;
      }
    } else {
      console.log('[useHLS] Direct src', videoId);
      video.src = videoUrl;
    }

    // Cleanup ТОЛЬКО при unmount компонента
    return () => {
      if (hlsRef.current) {
        console.log('[useHLS] 🗑️ DESTROY', videoId);
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, isActive, videoId]);

  return videoRef;
}
