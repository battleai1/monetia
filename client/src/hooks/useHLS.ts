// Custom hook для HLS.js - создаёт HLS ТОЛЬКО для активного видео

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean, videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isHLSUrl = videoUrl.includes('.m3u8');

  // КРИТИЧНО: Создаём HLS ТОЛЬКО когда видео активно!
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Для неактивных видео - НЕ создаём HLS вообще
    if (!isActive) {
      // Если HLS существует - уничтожаем
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      video.removeAttribute('src');
      video.src = '';
      video.load();
      return;
    }

    // Активное видео - создаём HLS если его нет
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

    // Cleanup при unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.src = '';
        video.load();
      }
    };
  }, [isActive, videoUrl, isHLSUrl, videoId]); // isActive теперь В deps!

  return videoRef;
}
