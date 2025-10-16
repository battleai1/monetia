import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { logLessonExpand } from '@/lib/analytics';

interface LessonCaptionProps {
  lessonId: string;
  brief: string;
  full: string;
  author?: string;
  authorAvatar?: string;
}

export default function LessonCaption({ lessonId, brief, full, author, authorAvatar }: LessonCaptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (!isExpanded) {
      logLessonExpand(lessonId);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pb-safe pb-8 px-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
      {author && (
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="w-9 h-9 border-2 border-white/80">
            <AvatarImage src={authorAvatar} alt={author} />
            <AvatarFallback className="bg-purple-600 text-white text-xs">
              {author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold text-sm" data-testid={`author-${lessonId}`}>
            {author}
          </span>
          <button
            onClick={() => console.log('Follow clicked')}
            className="px-4 py-1 border border-white/80 rounded-lg text-white text-sm font-semibold hover-elevate active-elevate-2"
            data-testid={`button-follow-${lessonId}`}
          >
            Follow
          </button>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-white pr-16"
        >
          <p 
            onClick={toggleExpand}
            className="text-sm leading-relaxed text-white/90 cursor-pointer" 
            data-testid={`caption-brief-${lessonId}`}
          >
            {isExpanded ? full : `${brief}...`}
          </p>
          {isExpanded && (
            <button
              onClick={toggleExpand}
              className="text-xs text-white/70 hover-elevate active-elevate-2 mt-1"
              data-testid={`button-collapse-${lessonId}`}
            >
              скрыть
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
