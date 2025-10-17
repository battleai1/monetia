import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { HlsManager } from '@/lib/HlsManager';

interface Reel {
  id: string;
  videoUrl: string;
  posterUrl?: string | null;
  [key: string]: any;
}

interface VideoPlaybackContextValue {
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  setIndex: (index: number) => void;
  play: () => Promise<void>;
  pause: () => void;
  forcePlayActive: () => Promise<void>;
  setMuted: (muted: boolean) => void;
  attachVideo: (video: HTMLVideoElement) => void;
  loadReel: (reel: Reel) => Promise<void>;
  getCurrentReel: () => Reel | null;
  onProgress: (callback: (progress: number) => void) => void;
  onEnded: (callback: () => void) => void;
}

const VideoPlaybackContext = createContext<VideoPlaybackContextValue | null>(null);

export function VideoPlaybackProvider({ 
  children, 
  reels,
  initialIndex = 0 
}: { 
  children: React.ReactNode; 
  reels: Reel[];
  initialIndex?: number;
}) {
  console.log('[VideoPlaybackProvider] 🏗️ Component rendering/mounting');
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const hlsManagerRef = useRef<HlsManager>(new HlsManager());
  const currentReelRef = useRef<Reel | null>(null);
  const progressCallbackRef = useRef<((progress: number) => void) | null>(null);
  const endedCallbackRef = useRef<(() => void) | null>(null);
  const isVideoAttachedRef = useRef(false);
  const pendingReelRef = useRef<Reel | null>(null);

  const loadReel = useCallback(async (reel: Reel) => {
    console.log('[VideoPlayback] 🔄 Loading reel:', reel.id);
    currentReelRef.current = reel;
    setProgress(0);
    
    // If video not attached yet, save as pending
    if (!isVideoAttachedRef.current) {
      console.log('[VideoPlayback] ⏳ Video not attached, saving pending load:', reel.id);
      pendingReelRef.current = reel;
      return;
    }
    
    try {
      await hlsManagerRef.current.loadSource(reel.videoUrl, reel.id);
      console.log('[VideoPlayback] ✅ Reel loaded successfully');
    } catch (error) {
      console.error('[VideoPlayback] ❌ Failed to load reel:', error);
    }
  }, []);

  const attachVideo = useCallback((video: HTMLVideoElement) => {
    console.log('[VideoPlayback] 📹 Attaching video element');
    isVideoAttachedRef.current = true;
    hlsManagerRef.current.attachVideo(video);

    // If there's a pending load, execute it now
    if (pendingReelRef.current) {
      console.log('[VideoPlayback] ▶️ Executing pending load:', pendingReelRef.current.id);
      const pending = pendingReelRef.current;
      pendingReelRef.current = null;
      hlsManagerRef.current.loadSource(pending.videoUrl, pending.id).then(() => {
        console.log('[VideoPlayback] ✅ Pending reel loaded');
      }).catch(err => {
        console.error('[VideoPlayback] ❌ Failed to load pending reel:', err);
      });
    } else {
      // Otherwise, load initial reel
      const initialReel = reels[currentIndex];
      if (initialReel && !currentReelRef.current) {
        console.log('[VideoPlayback] 🎬 Loading initial reel after video attached');
        currentReelRef.current = initialReel;
        setProgress(0);
        hlsManagerRef.current.loadSource(initialReel.videoUrl, initialReel.id).then(() => {
          console.log('[VideoPlayback] ✅ Initial reel loaded');
        }).catch(err => {
          console.error('[VideoPlayback] ❌ Failed to load initial reel:', err);
        });
      }
    }

    // Подписываемся на события видео
    const handleTimeUpdate = () => {
      const videoEl = hlsManagerRef.current.getVideoElement();
      if (videoEl) {
        const prog = (videoEl.currentTime / videoEl.duration) * 100;
        setProgress(prog);
        progressCallbackRef.current?.(prog);
      }
    };

    const handleEnded = () => {
      console.log('[VideoPlayback] 🏁 Video ended');
      setIsPlaying(false);
      endedCallbackRef.current?.();
    };

    const handlePlay = () => {
      console.log('[VideoPlayback] ▶️ Playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('[VideoPlayback] ⏸️ Paused');
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const setIndex = useCallback(async (index: number) => {
    console.log('[VideoPlayback] 📊 Setting index:', index);
    
    // Паузим текущее видео
    hlsManagerRef.current.pause();
    setIsPlaying(false);
    
    // Обновляем индекс
    setCurrentIndex(index);
    
    // Загружаем новое видео
    const reel = reels[index];
    if (reel) {
      await loadReel(reel);
    }
  }, [reels, loadReel]);

  const play = useCallback(async () => {
    try {
      await hlsManagerRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('[VideoPlayback] ❌ Play failed:', error);
      throw error;
    }
  }, []);

  const pause = useCallback(() => {
    hlsManagerRef.current.pause();
    setIsPlaying(false);
  }, []);

  const forcePlayActive = useCallback(async () => {
    console.log('[VideoPlayback] 🎬 Force play active video');
    
    const attemptPlay = async (attempt = 1): Promise<void> => {
      try {
        await hlsManagerRef.current.play();
        console.log(`[VideoPlayback] ✅ Force play successful on attempt ${attempt}`);
        setIsPlaying(true);
      } catch (error: any) {
        console.log(`[VideoPlayback] ⚠️ Force play attempt ${attempt} failed:`, error.message);
        
        if (attempt === 1) {
          // Первая попытка не удалась - пробуем с muted
          hlsManagerRef.current.setMuted(true);
          await new Promise(resolve => setTimeout(resolve, 100));
          return attemptPlay(2);
        } else if (attempt === 2) {
          // Вторая попытка - перезагружаем видео
          const videoEl = hlsManagerRef.current.getVideoElement();
          if (videoEl) {
            videoEl.load();
            await new Promise(resolve => setTimeout(resolve, 200));
            return attemptPlay(3);
          }
        } else {
          console.error('[VideoPlayback] ❌ All force play attempts failed');
          throw error;
        }
      }
    };

    await attemptPlay(1);
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    hlsManagerRef.current.setMuted(muted);
  }, []);

  const getCurrentReel = useCallback(() => {
    return currentReelRef.current;
  }, []);

  const onProgress = useCallback((callback: (progress: number) => void) => {
    progressCallbackRef.current = callback;
  }, []);

  const onEnded = useCallback((callback: () => void) => {
    endedCallbackRef.current = callback;
  }, []);

  // Cleanup при размонтировании
  useEffect(() => {
    console.log('[VideoPlaybackProvider] ✅ Provider mounted');
    return () => {
      console.log('[VideoPlaybackProvider] 🗑️ Provider unmounting, destroying HlsManager');
      hlsManagerRef.current.destroy();
    };
  }, []);

  const value: VideoPlaybackContextValue = {
    currentIndex,
    isPlaying,
    progress,
    setIndex,
    play,
    pause,
    forcePlayActive,
    setMuted,
    attachVideo,
    loadReel,
    getCurrentReel,
    onProgress,
    onEnded,
  };

  return (
    <VideoPlaybackContext.Provider value={value}>
      {children}
    </VideoPlaybackContext.Provider>
  );
}

export function useVideoPlayback() {
  const context = useContext(VideoPlaybackContext);
  if (!context) {
    throw new Error('useVideoPlayback must be used within VideoPlaybackProvider');
  }
  return context;
}
