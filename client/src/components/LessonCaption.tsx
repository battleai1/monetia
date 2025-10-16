import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logLessonExpand } from '@/lib/analytics';

interface LessonCaptionProps {
  lessonId: string;
  brief: string;
  full: string;
}

export default function LessonCaption({ lessonId, brief, full }: LessonCaptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (!isExpanded) {
      logLessonExpand(lessonId);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pb-safe pb-4 px-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-white"
        >
          <p className="text-sm leading-relaxed mb-2" data-testid={`caption-brief-${lessonId}`}>
            {isExpanded ? full : brief}
          </p>
          <button
            onClick={toggleExpand}
            className="flex items-center gap-1 text-xs text-white/70 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
            data-testid={`button-expand-${lessonId}`}
          >
            {isExpanded ? (
              <>
                скрыть <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                ещё <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
