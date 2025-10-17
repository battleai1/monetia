import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isInitializedRef = useRef(false);

  // Создаём HLS ОДИН РАЗ при первой активации
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive || isInitializedRef.current) return;

    const isHLS = videoUrl.includes('.m3u8');
    console.log('[HLS] First activation for:', videoUrl.substring(0, 50));
    
    if (isHLS && Hls.isSupported()) {
      console.log('[HLS] ✅ Creating HLS (one-time)');
      isInitializedRef.current = true;
      
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
              isInitializedRef.current = false;
              break;
          }
        }
      });
    } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      isInitializedRef.current = true;
    } else if (!isHLS) {
      video.src = videoUrl;
      isInitializedRef.current = true;
    }

    // Cleanup ТОЛЬКО при unmount
    return () => {
      if (hlsRef.current) {
        console.log('[HLS] 🗑️ Cleanup on unmount');
        hlsRef.current.destroy();
        hlsRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [videoUrl, isActive]);

  return videoRef;
}
