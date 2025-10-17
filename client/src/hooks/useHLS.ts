import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean, videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHLS = videoUrl.includes('.m3u8');
    
    // НЕ создаём HLS для неактивных видео
    if (!isActive) {
      return;
    }
    
    if (isHLS) {
      if (Hls.isSupported()) {
        // Создаём HLS ТОЛЬКО если активно И ещё нет instance
        if (!hlsRef.current) {
          console.log('[HLS] ✅ CREATE', videoId, videoUrl.substring(0, 50));
          
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });
          
          hlsRef.current = hls;
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('[HLS] ✅ READY', videoId);
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error('[HLS] ❌ FATAL', videoId, data.type);
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
          console.log('[HLS] ♻️ REUSE existing HLS for', videoId);
        }
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      }
    } else {
      video.src = videoUrl;
    }

    // Cleanup ТОЛЬКО при unmount компонента
    return () => {
      if (hlsRef.current) {
        console.log('[HLS] 🗑️ DESTROY', videoId);
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, isActive]); // БЕЗ videoId в deps!

  return videoRef;
}
