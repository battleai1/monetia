import { Heart, MessageCircle, Send, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '@/store/app.store';
import { useState } from 'react';

interface FloatingActionsProps {
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onMenu?: () => void;
}

export default function FloatingActions({ onLike, onComment, onShare, onMenu }: FloatingActionsProps) {
  const { isMuted, toggleMute } = useAppStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(3214);

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
    onShare?.();
  };

  const handleMenu = () => {
    console.log('Menu clicked');
    onMenu?.();
  };

  return (
    <div className="absolute right-3 bottom-24 z-40 flex flex-col items-center gap-5">
      <button
        onClick={handleLike}
        className="flex flex-col items-center gap-1 hover-elevate active-elevate-2 p-2 rounded-lg"
        aria-label="Like"
        data-testid="button-like"
      >
        <Heart 
          className={`w-7 h-7 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`}
        />
        <span className="text-white text-xs font-semibold">{likeCount.toLocaleString()}</span>
      </button>

      <button
        onClick={handleComment}
        className="flex flex-col items-center gap-1 hover-elevate active-elevate-2 p-2 rounded-lg"
        aria-label="Comment"
        data-testid="button-comment"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="text-white text-xs font-semibold">23</span>
      </button>

      <button
        onClick={handleShare}
        className="flex flex-col items-center gap-1 hover-elevate active-elevate-2 p-2 rounded-lg"
        aria-label="Share"
        data-testid="button-share"
      >
        <Send className="w-7 h-7 text-white" />
        <span className="text-white text-xs font-semibold">2.2K</span>
      </button>

      <button
        onClick={handleMenu}
        className="flex flex-col items-center gap-1 hover-elevate active-elevate-2 p-2 rounded-lg"
        aria-label="More options"
        data-testid="button-menu"
      >
        <MoreHorizontal className="w-7 h-7 text-white" />
      </button>

      <button
        onClick={toggleMute}
        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover-elevate active-elevate-2 mt-2"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        data-testid="button-mute"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}
