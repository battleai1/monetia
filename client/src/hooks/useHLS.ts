// Custom hook для HLS.js - простая надёжная версия

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function useHLS(videoUrl: string, isActive: boolean, videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isHLSAttached = useRef(false);

  // Создаём HLS ОДИН РАЗ при монтировании
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isHLSAttached.current) return;

    const isHLS = videoUrl.includes('.m3u8');

    if (isHLS && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;
      isHLSAttached.current = true;

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              break;
          }
        }
      });
    } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      isHLSAttached.current = true;
    } else if (!isHLS) {
      video.src = videoUrl;
      isHLSAttached.current = true;
    }

    // Cleanup только при unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      isHLSAttached.current = false;
    };
  }, [videoUrl]); // Только videoUrl в dependencies!

  return videoRef;
}
