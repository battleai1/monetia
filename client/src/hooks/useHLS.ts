import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHLS = videoUrl.includes('.m3u8');
    
    if (isHLS) {
      if (Hls.isSupported()) {
        // Только создаем новый HLS если его еще нет или изменился URL
        if (!hlsRef.current) {
          console.log('[HLS] Initializing HLS.js for:', videoUrl);
          
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
        }
        
        return () => {
          // Уничтожаем HLS ТОЛЬКО при размонтировании компонента или смене videoUrl
          console.log('[HLS] Cleaning up HLS instance');
          if (hlsRef.current) {
            // Останавливаем видео перед уничтожением HLS
            if (video) {
              video.pause();
              video.removeAttribute('src');
              video.load();
            }
            hlsRef.current.destroy();
            hlsRef.current = null;
          }
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('[HLS] Using native HLS support (Safari)');
        video.src = videoUrl;
      } else {
        console.error('[HLS] HLS is not supported in this browser');
      }
    } else {
      video.src = videoUrl;
    }
  }, [videoUrl]); // Убрал enabled из зависимостей!

  return videoRef;
}
