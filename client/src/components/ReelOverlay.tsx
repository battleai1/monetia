import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayback } from '@/contexts/VideoPlaybackContext';
import FloatingActions from './FloatingActions';
import FinalCTA from './FinalCTA';
import LessonCaption from './LessonCaption';
import ReelAuthorCaption from './ReelAuthorCaption';
import CommentsSheet, { Comment } from './CommentsSheet';
import { logReelView, logCTAShown, logCTAClick, logLessonExpand } from '@/lib/analytics';

interface ReelOverlayProps {
  id: string;
  hook?: string;
  lessonTitle?: string;
  lessonBrief?: string;
  lessonFull?: string;
  ctaText?: string;
  mode: 'sales' | 'training';
  onCTAClick?: () => void;
  onCommentsOpenChange?: (open: boolean) => void;
  author?: string;
  authorAvatar?: string;
  title?: string;
  descriptionBrief?: string;
  descriptionFull?: string;
  comments?: Comment[];
  likeCount?: number;
  shareCount?: number;
  isActive: boolean;
}

export default function ReelOverlay({
  id,
  hook,
  lessonTitle,
  lessonBrief,
  lessonFull,
  ctaText,
  mode,
  onCTAClick,
  onCommentsOpenChange,
  author,
  authorAvatar,
  title,
  descriptionBrief,
  descriptionFull,
  comments = [],
  likeCount,
  shareCount,
  isActive,
}: ReelOverlayProps) {
  const [showHook, setShowHook] = useState(true);
  const [showCTA, setShowCTA] = useState(false);
  const [hasLoggedView, setHasLoggedView] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isHoldingPause, setIsHoldingPause] = useState(false);
  const [isHoldingSpeed, setIsHoldingSpeed] = useState(false);
  
  const { progress, pause, play } = useVideoPlayback();

  useEffect(() => {
    onCommentsOpenChange?.(showComments);
  }, [showComments, onCommentsOpenChange]);

  // Управление видео через контроллер при активности
  useEffect(() => {
    if (!isActive) {
      // Сбрасываем состояния при деактивации
      setIsHoldingPause(false);
      setIsHoldingSpeed(false);
    }
  }, [isActive]);

  // Логика CTA и аналитики
  useEffect(() => {
    if (!isActive) return;

    if (progress >= 60 && !showCTA && ctaText && !onCTAClick) {
      setShowCTA(true);
      logCTAShown(id, ctaText);
    }

    if (progress >= 60 && !hasLoggedView) {
      logReelView(id, mode);
      setHasLoggedView(true);
    }
  }, [progress, isActive, id, mode, ctaText, showCTA, hasLoggedView, onCTAClick]);

  // Сброс при смене reel
  useEffect(() => {
    if (isActive) {
      setHasLoggedView(false);
      setShowCTA(false);
    }
  }, [id, isActive]);

  const handlePointerDown = () => {
    if (!isActive) return;
    setIsHoldingPause(true);
    setIsHoldingSpeed(true);
    pause();
  };

  const handlePointerUp = () => {
    if (!isActive) return;
    setIsHoldingPause(false);
    setIsHoldingSpeed(false);
    play();
  };

  const handleCTAClick = () => {
    if (ctaText) {
      logCTAClick(id, ctaText);
    }
    onCTAClick?.();
  };

  return (
    <div className="absolute inset-0 z-10">
      <motion.div
        className="relative w-full h-full origin-top overflow-hidden"
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
              />
            )}

            {mode === 'sales' && author && (
              <ReelAuthorCaption
                reelId={id}
                author={author || ""}
                authorAvatar={authorAvatar || ""}
                title={title || ""}
                descriptionBrief={descriptionBrief || ""}
                descriptionFull={descriptionFull || ""}
              />
            )}

            <AnimatePresence>
              {showCTA && ctaText && onCTAClick && (
                <FinalCTA text={ctaText} visible={showCTA} onClick={handleCTAClick} />
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>

      <CommentsSheet 
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        comments={comments}
        commentCount={comments.length}
      />
    </div>
  );
}
