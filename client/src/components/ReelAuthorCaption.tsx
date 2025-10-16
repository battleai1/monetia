import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ReelAuthorCaptionProps {
  reelId: string;
  author: string;
  authorAvatar?: string;
  title: string;
  descriptionBrief: string;
  descriptionFull: string;
  onExpand?: () => void;
}

export default function ReelAuthorCaption({
  reelId,
  author,
  authorAvatar,
  title,
  descriptionBrief,
  descriptionFull,
  onExpand,
}: ReelAuthorCaptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (!isExpanded) {
      onExpand?.();
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pb-safe pb-4 px-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="w-9 h-9 border-2 border-white/80">
          <AvatarImage src={authorAvatar} alt={author} />
          <AvatarFallback className="bg-purple-600 text-white text-xs">
            {author.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-white font-semibold text-sm" data-testid={`author-${reelId}`}>
          {author}
        </span>
        <button
          onClick={() => console.log('Follow clicked')}
          className="px-4 py-1 border border-white/80 rounded-lg text-white text-sm font-semibold hover-elevate active-elevate-2"
          data-testid={`button-follow-${reelId}`}
        >
          Follow
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-white"
        >
          <h3 className="text-base font-medium mb-1" data-testid={`title-${reelId}`}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-white/90" data-testid={`description-${reelId}`}>
            {isExpanded ? descriptionFull : descriptionBrief}{' '}
            {!isExpanded && (
              <button
                onClick={toggleExpand}
                className="text-white/70 hover-elevate active-elevate-2"
                data-testid={`button-expand-${reelId}`}
              >
                ...
              </button>
            )}
          </p>
          {isExpanded && (
            <button
              onClick={toggleExpand}
              className="text-xs text-white/70 hover-elevate active-elevate-2 mt-1"
              data-testid={`button-collapse-${reelId}`}
            >
              скрыть
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
