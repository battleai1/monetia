import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app.store';
import { useHLS } from '@/hooks/useHLS';
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
  const videoRef = useHLS(videoUrl, isActive, id);
  const [showHook, setShowHook] = useState(true);
  const [showCTA, setShowCTA] = useState(false);
  const [hasLoggedView, setHasLoggedView] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isHoldingPause, setIsHoldingPause] = useState(false);
  const [isHoldingSpeed, setIsHoldingSpeed] = useState(false);
  const { isMuted } = useAppStore();

  useEffect(() => {
    onCommentsOpenChange?.(showComments);
  }, [showComments, onCommentsOpenChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      console.log('[ReelCard] PLAY -', id);
      // Убираем poster чтобы показать первый кадр видео
      if (video.poster) {
        video.poster = '';
      }
      
      // Попытка автозапуска видео
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Если не получилось запустить со звуком, пробуем с muted
          console.log('[Video] Autoplay blocked, trying with muted:', error.message);
          video.muted = true;
          video.play().catch(err => {
            console.error('[Video] Failed to play even with muted:', err);
          });
        });
      }
    } else {
      console.log('[ReelCard] PAUSE -', id);
      video.pause();
      video.currentTime = 0; // Сброс на начало
    }
  }, [isActive, id]);

  // Принудительный запуск видео после countdown (для мобильных устройств)
  useEffect(() => {
    if (forcePlay && isActive) {
      const video = videoRef.current;
      if (!video) return;

      console.log('[Video] Force play triggered (mobile fix after countdown)');
      
      // Агрессивный перезапуск для мобильных с несколькими попытками
      const attemptPlay = (attempt = 1) => {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log(`[Video] Force play attempt ${attempt} failed:`, error.message);
            
            if (attempt === 1) {
              // Первая попытка не удалась - пробуем с muted
              video.muted = true;
              setTimeout(() => attemptPlay(2), 100);
            } else if (attempt === 2) {
              // Вторая попытка - перезагружаем видео и пробуем снова
              video.load();
              setTimeout(() => attemptPlay(3), 200);
            } else {
              console.error('[Video] All force play attempts failed');
            }
          }).then(() => {
            console.log(`[Video] Force play successful on attempt ${attempt}`);
          });
        }
      };
      
      // Стартуем с небольшой задержкой
      setTimeout(() => attemptPlay(1), 100);
    }
  }, [forcePlay, isActive]);

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
    const video = videoRef.current;
    if (!video) return;

    if (isHoldingPause) {
      video.pause();
    } else if (isActive) {
      // Вызываем play() только если видео на паузе и не закончилось
      if (video.paused && !video.ended) {
        video.play().catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isHoldingPause, isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Просто меняем скорость
    video.playbackRate = isHoldingSpeed ? 2.0 : 1.0;
  }, [isHoldingSpeed]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickRatio = x / rect.width;

    if (clickRatio > 0.75) {
      setIsHoldingSpeed(true);
    } else {
      setIsHoldingPause(true);
    }
  };

  const handlePointerUp = () => {
    setIsHoldingPause(false);
    setIsHoldingSpeed(false);
  };

  const handleCTAClick = () => {
    if (ctaText) {
      logCTAClick(id, ctaText);
    }
    onCTAClick?.();
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden lg:overflow-visible">
      <motion.div
        className="relative w-full origin-top overflow-hidden"
        animate={showComments ? {
          scale: 0.57,
          y: 65,
          height: '70%',
          borderRadius: 28,
        } : {
          scale: 1,
          y: 0,
          height: '100%',
          borderRadius: 0,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 400 }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          muted={isMuted}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          data-testid={`reel-video-${id}`}
        />

        <div 
          className="absolute inset-0 z-10 touch-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          data-testid={`video-interaction-overlay-${id}`}
        />

        {lessonTitle && (
          <div className="absolute top-safe top-16 left-4 right-16 z-30">
            <h2 className="text-white text-xl font-semibold leading-tight" data-testid={`lesson-title-${id}`}>
              {lessonTitle}
            </h2>
          </div>
        )}

        <AnimatePresence>
          {showHook && hook && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center z-20 bg-black/30 backdrop-blur-sm px-8"
              data-testid={`hook-overlay-${id}`}
            >
              <h1 className="text-white text-4xl font-bold text-center leading-tight">
                {hook}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {!showComments && (
          <>
            <FloatingActions 
              onComment={() => setShowComments(true)}
              commentCount={comments.length}
              likeCount={likeCount}
              shareCount={shareCount}
              reelId={id}
            />

            {mode === 'training' && lessonBrief && lessonFull && (
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
                onExpand={() => logLessonExpand(id)}
              />
            )}

            {ctaText && (
              <FinalCTA text={ctaText} onClick={handleCTAClick} visible={showCTA} />
            )}
          </>
        )}
      </motion.div>

      <CommentsSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        comments={comments}
        commentCount={comments.length}
        onOpenChange={setShowComments}
      />
    </div>
  );
}
