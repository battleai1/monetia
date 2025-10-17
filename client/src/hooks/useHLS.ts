import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, shouldLoad: boolean = true) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHLS = videoUrl.includes('.m3u8');
    
    // НЕ создаём HLS пока shouldLoad=false
    if (!shouldLoad) {
      return;
    }
    
    // Создаём HLS ТОЛЬКО если shouldLoad=true и ещё не создавали
    if (isHLS && !hasLoadedRef.current) {
      if (Hls.isSupported()) {
        console.log('[HLS] Creating HLS for:', videoUrl);
        hasLoadedRef.current = true;
        
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        
        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('[HLS] Ready');
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('[HLS] Fatal error:', data);
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
                hasLoadedRef.current = false;
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      }
    } else if (!isHLS) {
      video.src = videoUrl;
    }
    
    return () => {
      // Cleanup только при unmount
      if (hlsRef.current) {
        console.log('[HLS] Cleanup');
        hlsRef.current.destroy();
        hlsRef.current = null;
        hasLoadedRef.current = false;
      }
    };
  }, [videoUrl, shouldLoad]);

  return videoRef;
}
