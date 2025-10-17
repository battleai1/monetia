import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean, videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isActiveRef = useRef(isActive);
  
  // Обновляем ref при изменении isActive (БЕЗ перезапуска эффекта)
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Создаём HLS ОДИН РАЗ при монтировании, ТОЛЬКО если активно
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      console.log('[useHLS] No video element', videoId);
      return;
    }

    // НЕ создаём HLS для неактивных видео
    if (!isActiveRef.current) {
      console.log('[useHLS] SKIP - not active on mount', videoId);
      return;
    }

    const isHLS = videoUrl.includes('.m3u8');
    console.log('[useHLS] Mount effect -', videoId, 'creating HLS instance');
    
    if (isHLS) {
      if (Hls.isSupported()) {
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
        }
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('[useHLS] Native HLS', videoId);
        video.src = videoUrl;
      }
    } else {
      console.log('[useHLS] Direct src', videoId);
      video.src = videoUrl;
    }

    // Cleanup ТОЛЬКО при unmount компонента или смене videoUrl
    return () => {
      if (hlsRef.current) {
        console.log('[useHLS] 🗑️ DESTROY', videoId);
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, videoId]);

  return videoRef;
}
