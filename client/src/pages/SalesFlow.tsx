import { useLocation } from 'wouter';
import { salesReels } from '@/lib/content';
import ReelsViewport from '@/components/ReelsViewport';
import ReelCard from '@/components/ReelCard';

export default function SalesFlow() {
  const [, setLocation] = useLocation();

  const handleFinalCTA = () => {
    setLocation('/training');
  };

  return (
    <div className="h-screen w-full bg-black">
      <ReelsViewport totalReels={salesReels.length}>
        {salesReels.map((reel, index) => (
          <ReelCard
            key={reel.id}
            id={reel.id}
            videoUrl={reel.videoUrl}
            posterUrl={reel.posterUrl}
            hook={reel.hook}
            ctaText={reel.ctaText}
            isActive={true}
            mode="sales"
            onCTAClick={reel.isFinal ? handleFinalCTA : undefined}
          />
        ))}
      </ReelsViewport>
    </div>
  );
}
