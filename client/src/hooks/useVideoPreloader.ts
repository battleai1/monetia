import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface PreloadedVideo {
  url: string;
  hls: Hls | null;
  videoElement: HTMLVideoElement;
  loaded: boolean;
}

export function useVideoPreloader(videoUrls: string[], enabled: boolean = false) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const preloadedVideos = useRef<Map<string, PreloadedVideo>>(new Map());
  const preloadContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || videoUrls.length === 0) return;

    console.log('[VideoPreloader] Starting preload for', videoUrls.length, 'videos');
    setIsPreloading(true);

    // Создаем скрытый контейнер для видео элементов
    if (!preloadContainerRef.current) {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.overflow = 'hidden';
      document.body.appendChild(container);
      preloadContainerRef.current = container;
    }

    // Функция для загрузки одного видео
    const preloadVideo = async (url: string, index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (preloadedVideos.current.has(url)) {
          console.log(`[VideoPreloader] Video ${index} already preloaded:`, url);
          resolve();
          return;
        }

        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';

        const isHLS = url.includes('.m3u8');

        if (isHLS && Hls.isSupported()) {
          console.log(`[VideoPreloader] Initializing HLS for video ${index}:`, url);
          
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            maxBufferSize: 60 * 1000 * 1000,
          });

          hls.loadSource(url);
          hls.attachMedia(video);

          let progressLogged = false;

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log(`[VideoPreloader] Manifest parsed for video ${index}`);
            
            // Загружаем первые 10 секунд
            video.currentTime = 0;
            video.volume = 0; // КРИТИЧНО: отключаем звук полностью
            video.play().then(() => {
              setTimeout(() => {
                // 1. STOP VIDEO
                video.pause();
                video.currentTime = 0;
                
                const buffered = video.buffered;
                if (buffered.length > 0) {
                  const bufferedEnd = buffered.end(0);
                  console.log(`[VideoPreloader] Video ${index} buffered ${bufferedEnd.toFixed(1)}s`);
                }
                
                // 2. DESTROY HLS
                hls.destroy();
                console.log(`[VideoPreloader] HLS destroyed for video ${index}`);
                
                // 3. REMOVE VIDEO FROM DOM
                video.src = '';
                video.load(); // Очищаем буфер
                if (video.parentNode) {
                  video.parentNode.removeChild(video);
                }
                console.log(`[VideoPreloader] Video element removed for video ${index}`);
                
                preloadedVideos.current.set(url, {
                  url,
                  hls: null,
                  videoElement: video, // Хранится только для ref, но удалён из DOM
                  loaded: true,
                });

                setLoadedCount(prev => prev + 1);
                resolve();
              }, 500); // Даем время на буферизацию
            }).catch(() => {
              console.log(`[VideoPreloader] Silent play failed for video ${index}, but HLS initialized`);
              
              // 1. DESTROY HLS
              hls.destroy();
              console.log(`[VideoPreloader] HLS destroyed for video ${index} (after failed play)`);
              
              // 2. REMOVE VIDEO FROM DOM
              video.pause();
              video.src = '';
              video.load();
              if (video.parentNode) {
                video.parentNode.removeChild(video);
              }
              console.log(`[VideoPreloader] Video element removed for video ${index} (after failed play)`);
              
              preloadedVideos.current.set(url, {
                url,
                hls: null,
                videoElement: video,
                loaded: true,
              });

              setLoadedCount(prev => prev + 1);
              resolve();
            });
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error(`[VideoPreloader] Fatal error for video ${index}:`, data);
              hls.destroy();
              resolve();
            } else if (!progressLogged) {
              console.log(`[VideoPreloader] Non-fatal error for video ${index}:`, data.type);
              progressLogged = true;
            }
          });

          hls.on(Hls.Events.FRAG_LOADED, () => {
            if (!progressLogged) {
              console.log(`[VideoPreloader] Fragment loaded for video ${index}`);
              progressLogged = true;
            }
          });
        } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari нативная поддержка HLS
          console.log(`[VideoPreloader] Using native HLS for video ${index} (Safari)`);
          video.src = url;
          
          video.addEventListener('loadeddata', () => {
            console.log(`[VideoPreloader] Native HLS loaded for video ${index}`);
            
            preloadedVideos.current.set(url, {
              url,
              hls: null,
              videoElement: video,
              loaded: true,
            });

            setLoadedCount(prev => prev + 1);
            resolve();
          }, { once: true });

          video.addEventListener('error', () => {
            console.error(`[VideoPreloader] Error loading video ${index}`);
            resolve();
          }, { once: true });

          video.load();
        } else {
          // Обычное MP4 видео
          video.src = url;
          
          video.addEventListener('canplaythrough', () => {
            preloadedVideos.current.set(url, {
              url,
              hls: null,
              videoElement: video,
              loaded: true,
            });

            setLoadedCount(prev => prev + 1);
            resolve();
          }, { once: true });

          video.load();
        }

        if (preloadContainerRef.current) {
          preloadContainerRef.current.appendChild(video);
        }
      });
    };

    // Загружаем видео поэтапно друг за другом
    const preloadSequentially = async () => {
      for (let i = 0; i < videoUrls.length; i++) {
        await preloadVideo(videoUrls[i], i);
      }
      
      console.log('[VideoPreloader] All videos preloaded:', loadedCount);
      setIsPreloading(false);
    };

    preloadSequentially();

    // Cleanup
    return () => {
      console.log('[VideoPreloader] Cleaning up preloaded videos');
      
      preloadedVideos.current.forEach((preloaded) => {
        if (preloaded.hls) {
          preloaded.hls.destroy();
        }
        if (preloaded.videoElement && preloaded.videoElement.parentNode) {
          preloaded.videoElement.parentNode.removeChild(preloaded.videoElement);
        }
      });
      
      preloadedVideos.current.clear();

      if (preloadContainerRef.current && preloadContainerRef.current.parentNode) {
        preloadContainerRef.current.parentNode.removeChild(preloadContainerRef.current);
        preloadContainerRef.current = null;
      }

      setLoadedCount(0);
      setIsPreloading(false);
    };
  }, [enabled, videoUrls]);

  return {
    loadedCount,
    totalCount: videoUrls.length,
    isPreloading,
    progress: videoUrls.length > 0 ? (loadedCount / videoUrls.length) * 100 : 0,
  };
}
