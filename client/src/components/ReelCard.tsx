import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app.store';
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
  author?: string;
  authorAvatar?: string;
  title?: string;
  descriptionBrief?: string;
  descriptionFull?: string;
  comments?: Comment[];
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
  author,
  authorAvatar,
  title,
  descriptionBrief,
  descriptionFull,
  comments = [],
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showHook, setShowHook] = useState(true);
  const [showCTA, setShowCTA] = useState(false);
  const [hasLoggedView, setHasLoggedView] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isHoldingPause, setIsHoldingPause] = useState(false);
  const [isHoldingSpeed, setIsHoldingSpeed] = useState(false);
  const { isMuted } = useAppStore();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

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
    } else if (isActive && !isHoldingSpeed) {
      video.play().catch(() => {});
    }
  }, [isHoldingPause, isActive, isHoldingSpeed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHoldingSpeed) {
      video.playbackRate = 2.0;
    } else {
      video.playbackRate = 1.0;
    }
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
          scale: 0.60,
          y: 50,
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
