import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import ShareSheet from './ShareSheet';

interface FloatingActionsProps {
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onMenu?: () => void;
  commentCount?: number;
  reelId?: string;
}

export default function FloatingActions({ onLike, onComment, onShare, onMenu, commentCount = 23, reelId }: FloatingActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(3214);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    console.log('Like clicked');
    onLike?.();
  };

  const handleComment = () => {
    console.log('Comment clicked');
    onComment?.();
  };

  const handleShare = () => {
    console.log('Share clicked');
    setShowShareSheet(true);
    onShare?.();
  };

  const handleMenu = () => {
    console.log('Menu clicked');
    onMenu?.();
  };

  return (
    <>
      <div className="absolute right-3 bottom-24 z-40 flex flex-col items-center gap-4">
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-0.5 hover-elevate active-elevate-2 p-1"
          aria-label="Like"
          data-testid="button-like"
        >
          <Heart 
            className={`w-7 h-7 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`}
          />
          <span className="text-white text-xs font-medium">{likeCount.toLocaleString()}</span>
        </button>

        <button
          onClick={handleComment}
          className="flex flex-col items-center gap-0.5 hover-elevate active-elevate-2 p-1"
          aria-label="Comment"
          data-testid="button-comment"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="text-white text-xs font-medium">{commentCount}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-0.5 hover-elevate active-elevate-2 p-1"
          aria-label="Share"
          data-testid="button-share"
        >
          <Send className="w-7 h-7 text-white" />
          <span className="text-white text-xs font-medium">2.2K</span>
        </button>

        <button
          onClick={handleMenu}
          className="flex flex-col items-center gap-0.5 hover-elevate active-elevate-2 p-1"
          aria-label="More options"
          data-testid="button-menu"
        >
          <MoreHorizontal className="w-7 h-7 text-white" />
        </button>
      </div>

      <ShareSheet 
        isOpen={showShareSheet} 
        onClose={() => setShowShareSheet(false)}
        reelId={reelId}
      />
    </>
  );
}
