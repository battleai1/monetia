import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  text: string;
  likes: number;
  timestamp: string;
}

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  commentCount: number;
  onOpenChange?: (open: boolean) => void;
}

const EMOJI_REACTIONS = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];

export default function CommentsSheet({ isOpen, onClose, comments, commentCount, onOpenChange }: CommentsSheetProps) {
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const toggleLike = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleClose = () => {
    onClose();
    onOpenChange?.(false);
  };

  const handleDragEnd = (_event: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-transparent z-40 pointer-events-none"
            data-testid="comments-overlay"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            transition={{ type: 'spring', damping: 35, stiffness: 400 }}
            className="fixed lg:absolute bottom-0 left-0 right-0 z-50 bg-[#262626] rounded-t-3xl max-h-[75vh] lg:max-h-[660px] flex flex-col pb-safe"
            data-testid="comments-sheet"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-3 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 bg-zinc-600 rounded-full" data-testid="drag-handle" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-center px-4 pb-4">
              <h3 className="text-base font-semibold text-white">
                Comments
              </h3>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 mb-6" data-testid={`comment-${comment.id}`}>
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                    <AvatarFallback className="bg-zinc-700 text-white text-sm">
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">
                        {comment.author}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-white leading-relaxed mb-2">
                      {comment.text}
                    </p>
                    <button 
                      className="text-xs text-zinc-500 font-semibold"
                      data-testid={`button-reply-${comment.id}`}
                    >
                      Reply
                    </button>
                    {comment.likes > 0 && (
                      <button 
                        className="text-xs text-zinc-500 ml-4"
                        data-testid={`button-view-likes-${comment.id}`}
                      >
                        View {comment.likes + (likedComments.has(comment.id) ? 1 : 0)} {comment.likes === 1 ? 'like' : 'likes'}
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={() => toggleLike(comment.id)}
                    className="flex-shrink-0 mt-1"
                    data-testid={`button-like-comment-${comment.id}`}
                  >
                    <svg 
                      className={`w-3 h-3 transition-colors ${
                        likedComments.has(comment.id) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-zinc-500'
                      }`}
                      viewBox="0 0 24 24"
                      fill={likedComments.has(comment.id) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Emoji Reactions */}
            <div className="flex gap-3 px-4 py-3 overflow-x-auto">
              {EMOJI_REACTIONS.map((emoji, index) => (
                <button
                  key={index}
                  className="text-2xl flex-shrink-0 hover:scale-110 transition-transform emoji-modern"
                  data-testid={`emoji-reaction-${index}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Comment Input */}
            <div className="px-4 pb-4 pt-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback className="bg-zinc-700 text-white text-sm">
                    Вы
                  </AvatarFallback>
                </Avatar>
                <input
                  type="text"
                  placeholder="Add a comment for d_r_wear"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
                  data-testid="input-comment"
                />
                <button className="flex-shrink-0" data-testid="button-emoji-picker">
                  <Smile className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Safe Area Indicator (like on screenshot) */}
            <div className="h-1 mx-auto w-32 bg-white/80 rounded-full mb-2" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
