import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
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
}

export default function CommentsSheet({ isOpen, onClose, comments, commentCount }: CommentsSheetProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
            data-testid="comments-overlay"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-t-2xl max-h-[85vh] flex flex-col"
            data-testid="comments-sheet"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Комментарии ({commentCount})
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover-elevate active-elevate-2 rounded-full"
                data-testid="button-close-comments"
              >
                <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 mb-4" data-testid={`comment-${comment.id}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                    <AvatarFallback className="bg-purple-600 text-white text-xs">
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {comment.author}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-900 dark:text-white leading-relaxed">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <button 
                        className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold hover:text-zinc-700 dark:hover:text-zinc-200"
                        data-testid={`button-reply-${comment.id}`}
                      >
                        Ответить
                      </button>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {likedComments.has(comment.id) ? comment.likes + 1 : comment.likes} отметок «Нравится»
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleLike(comment.id)}
                    className="p-1 flex-shrink-0"
                    data-testid={`button-like-comment-${comment.id}`}
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 transition-colors ${
                        likedComments.has(comment.id) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-zinc-400 dark:text-zinc-600'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs">
                    Вы
                  </AvatarFallback>
                </Avatar>
                <input
                  type="text"
                  placeholder="Добавьте комментарий..."
                  className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
                  data-testid="input-comment"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
