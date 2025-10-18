import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app.store';
import { videoController } from '@/lib/video-controller';
import FloatingActions from './FloatingActions';
import FinalCTA from './FinalCTA';
import LessonCaption from './LessonCaption';
import ReelAuthorCaption from './ReelAuthorCaption';
import CommentsSheet, { Comment } from './CommentsSheet';
import { logReelView, logCTAShown, logCTAClick, logLessonExpand } from '@/lib/analytics';

interface ReelCardProps {
  id: string;
  videoUrl: string;
  posterUrl?: string;
  hook?: string;
  lessonTitle?: string;
  lessonBrief?: string;
  lessonFull?: string;
  ctaText?: string;
  isActive: boolean;
  mode: 'sales' | 'training';
  onProgress?: (progress: number) => void;
  onCTAClick?: () => void;
  onVideoEnded?: () => void;
  onCommentsOpenChange?: (open: boolean) => void;
  author?: string;
  authorAvatar?: string;
  title?: string;
  descriptionBrief?: string;
  descriptionFull?: string;
  comments?: Comment[];
  likeCount?: number;
  shareCount?: number;
  forcePlay?: boolean;
}

export default function ReelCard({
  id,
  videoUrl,
  posterUrl,
  hook,
  lessonTitle,
  lessonBrief,
  lessonFull,
  ctaText,
  isActive,
  mode,
  onProgress,
  onCTAClick,
  onVideoEnded,
  onCommentsOpenChange,
  author,
  authorAvatar,
  title,
  descriptionBrief,
  descriptionFull,
  comments = [],
  likeCount,
  shareCount,
  forcePlay = false,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const holdTimer = useRef<number | null>(null);
  const holdingRight = useRef(false);
  const holdingPause = useRef(false);
  
  const [showHook, setShowHook] = useState(true);
  const [showCTA, setShowCTA] = useState(false);
  const [hasLoggedView, setHasLoggedView] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { isMuted } = useAppStore();

  // Регистрация видео в VideoController
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    
    // КРИТИЧНО: принудительно устанавливаем размеры ПЕРЕД регистрацией
    el.style.width = `${window.innerWidth}px`;
    el.style.height = `${window.innerHeight}px`;
    
    videoController.register(el, videoUrl, id);
    return () => videoController.destroy(id);
  }, [id, videoUrl]);

  // Активация/деактивация видео
  useEffect(() => {
    if (isActive) {
      videoController.activate(id);
    }
  }, [isActive, id]);

  // Синхронизация mute state с глобальным store
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isActive) return;
    
    el.muted = isMuted;
  }, [isMuted, isActive]);

  // Жесты: долгое нажатие для паузы/ускорения
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const xFrac = (e.clientX - rect.left) / rect.width;

      const timer = window.setTimeout(() => {
        if (xFrac > 0.66) {
          // Правая часть - ускорение x2
          holdingRight.current = true;
          videoController.activate(id);
          el.playbackRate = 2.0;
          el.play().catch(() => {});
        } else {
          // Левая/центр - пауза (возобновится при отпускании)
          holdingPause.current = true;
          el.pause();
        }
      }, 180);
      
      holdTimer.current = timer;

      const stop = () => {
        if (holdTimer.current) {
          clearTimeout(holdTimer.current);
          holdTimer.current = null;
        }
        
        // Возобновляем после ускорения
        if (holdingRight.current) {
          holdingRight.current = false;
          el.playbackRate = 1.0;
        }
        
        // Возобновляем после паузы
        if (holdingPause.current) {
          holdingPause.current = false;
          videoController.activate(id);
          el.play().catch(() => {});
        }
        
        window.removeEventListener('pointerup', stop);
        window.removeEventListener('pointercancel', stop);
      };
      
      window.addEventListener('pointerup', stop, { passive: true });
      window.addEventListener('pointercancel', stop, { passive: true });
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: false });
    return () => el.removeEventListener('pointerdown', onPointerDown);
  }, [id]);

  // Отслеживание прогресса видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);

      if (progress >= 60 && !showCTA && ctaText && !onCTAClick) {
        setShowCTA(true);
        logCTAShown(id, ctaText);
      }

      if (progress >= 60 && !hasLoggedView) {
        logReelView(id, mode);
        setHasLoggedView(true);
      }
    };

    const handleEnded = () => {
      if (ctaText && onCTAClick && !showCTA) {
        setShowCTA(true);
        logCTAShown(id, ctaText);
      }
      onVideoEnded?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [id, mode, ctaText, showCTA, hasLoggedView, onProgress, onCTAClick, onVideoEnded]);

  useEffect(() => {
    if (!isActive) {
      setShowCTA(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (hook) {
      const timer = setTimeout(() => setShowHook(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [hook]);

  useEffect(() => {
    onCommentsOpenChange?.(showComments);
  }, [showComments, onCommentsOpenChange]);

  const handleCTAClick = () => {
    if (ctaText) {
      logCTAClick(id, ctaText);
    }
    onCTAClick?.();
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden lg:overflow-visible">
      <div className="relative w-full h-full overflow-hidden">
        {posterUrl && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${posterUrl})` }}
          />
        )}
        
        <video
          ref={videoRef}
          className="absolute top-0 left-0 object-cover"
          style={{
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            display: 'block',
          }}
          playsInline
          muted
          preload="metadata"
          webkit-playsinline="true"
          data-testid={`video-${id}`}
        />

        <AnimatePresence>
          {hook && showHook && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-20 left-4 right-4 text-white text-2xl font-bold drop-shadow-lg"
              data-testid="video-hook"
            >
              {hook}
            </motion.div>
          )}
        </AnimatePresence>

        {mode === 'training' && lessonTitle && lessonBrief && lessonFull && (
          <LessonCaption
            lessonId={id}
            brief={lessonBrief}
            full={lessonFull}
            author={author}
            authorAvatar={authorAvatar}
          />
        )}

        {mode === 'sales' && author && title && descriptionBrief && descriptionFull && (
          <ReelAuthorCaption
            reelId={id}
            author={author}
            authorAvatar={authorAvatar}
            title={title}
            descriptionBrief={descriptionBrief}
            descriptionFull={descriptionFull}
          />
        )}

        <FloatingActions
          likeCount={likeCount || 0}
          commentCount={comments?.length || 0}
          shareCount={shareCount || 0}
          onComment={() => setShowComments(!showComments)}
          reelId={id}
        />

        <AnimatePresence>
          {showCTA && ctaText && onCTAClick && (
            <FinalCTA text={ctaText} onClick={handleCTAClick} visible={true} />
          )}
        </AnimatePresence>
      </div>

      <CommentsSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        comments={comments}
        commentCount={comments?.length || 0}
        onOpenChange={setShowComments}
      />
    </div>
  );
}
