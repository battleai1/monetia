import { Heart, MessageCircle, Send, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import ShareSheet from './ShareSheet';
import { useAppStore } from '@/store/app.store';

interface FloatingActionsProps {
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onMenu?: () => void;
  commentCount?: number;
  likeCount?: number;
  shareCount?: number;
  reelId?: string;
}

export default function FloatingActions({ onLike, onComment, onShare, onMenu, commentCount = 23, likeCount: initialLikeCount = 3214, shareCount = 2200, reelId }: FloatingActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const { isMuted, toggleMute } = useAppStore();

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

  const handleMute = () => {
    toggleMute();
    console.log('Mute toggled:', !isMuted);
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
          <span className="text-white text-xs font-medium">{shareCount >= 1000 ? `${(shareCount / 1000).toFixed(1)}K` : shareCount}</span>
        </button>

        <button
          onClick={handleMute}
          className="flex flex-col items-center gap-0.5 hover-elevate active-elevate-2 p-1"
          aria-label={isMuted ? "Unmute" : "Mute"}
          data-testid="button-mute"
        >
          {isMuted ? (
            <VolumeX className="w-7 h-7 text-white" />
          ) : (
            <Volume2 className="w-7 h-7 text-white" />
          )}
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
