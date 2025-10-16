import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="absolute bottom-0 left-0 right-20 z-30 pb-safe pb-4 px-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
      {author && (
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="w-8 h-8 border-2 border-white">
            <AvatarImage src={authorAvatar} alt={author} />
            <AvatarFallback className="bg-purple-600 text-white text-xs">
              {author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold text-sm" data-testid={`author-${lessonId}`}>
            {author}
          </span>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-white"
        >
          <p className="text-sm leading-relaxed mb-2 text-white/90" data-testid={`caption-brief-${lessonId}`}>
            {isExpanded ? full : brief}
          </p>
          <button
            onClick={toggleExpand}
            className="flex items-center gap-1 text-xs text-white/70 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
            data-testid={`button-expand-${lessonId}`}
          >
            {isExpanded ? (
              <>
                скрыть <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                ещё <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
