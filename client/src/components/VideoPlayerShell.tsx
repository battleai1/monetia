import { useEffect, useRef } from 'react';
import { useVideoPlayback } from '@/contexts/VideoPlaybackContext';
import { useAppStore } from '@/store/app.store';

interface VideoPlayerShellProps {
  posterUrl?: string;
}

export default function VideoPlayerShell({ posterUrl }: VideoPlayerShellProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { attachVideo, setMuted } = useVideoPlayback();
  const { isMuted } = useAppStore();

  // Подключаем video элемент к контроллеру при монтировании
  useEffect(() => {
    if (videoRef.current) {
      console.log('[VideoPlayerShell] 🎬 Attaching video to controller');
      const cleanup = attachVideo(videoRef.current);
      
      // Return cleanup to remove event listeners on unmount
      return cleanup;
    }
  }, [attachVideo]);

  // Синхронизируем muted state из глобального стора
  useEffect(() => {
    console.log('[VideoPlayerShell] 🔇 Syncing muted state:', isMuted);
    setMuted(isMuted);
  }, [isMuted, setMuted]);

  return (
    <video
      ref={videoRef}
      poster={posterUrl}
      muted={isMuted}
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
      data-testid="video-player-shell"
    />
  );
}
