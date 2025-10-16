import { Heart, Share2, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '@/store/app.store';

interface FloatingActionsProps {
  onLike?: () => void;
  onShare?: () => void;
}

export default function FloatingActions({ onLike, onShare }: FloatingActionsProps) {
  const { isMuted, toggleMute } = useAppStore();

  const handleLike = () => {
    console.log('Like clicked');
    onLike?.();
  };

  const handleShare = () => {
    console.log('Share clicked');
    onShare?.();
  };

  return (
    <div className="absolute right-4 bottom-32 z-40 flex flex-col gap-6">
      <button
        onClick={handleLike}
        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover-elevate active-elevate-2"
        aria-label="Like"
        data-testid="button-like"
      >
        <Heart className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={handleShare}
        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover-elevate active-elevate-2"
        aria-label="Share"
        data-testid="button-share"
      >
        <Share2 className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={toggleMute}
        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover-elevate active-elevate-2"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        data-testid="button-mute"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
