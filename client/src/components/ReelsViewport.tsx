import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useReelsController } from '@/hooks/useReelsController';
import ProgressStrips from './ProgressStrips';

interface ReelsViewportProps {
  children: React.ReactNode[];
  totalReels: number;
  onIndexChange?: (index: number) => void;
}

export default function ReelsViewport({ children, totalReels, onIndexChange }: ReelsViewportProps) {
  const { currentIndex, goToNext, goToPrev, updateProgress, getProgress } = useReelsController({
    totalReels,
    onIndexChange,
  });

  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) {
      goToNext();
    } else if (info.offset.y > threshold) {
      goToPrev();
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <ProgressStrips
        total={totalReels}
        current={currentIndex}
        progress={getProgress(currentIndex)}
      />

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ y, opacity }}
        className="w-full h-full"
        data-testid="reels-viewport"
      >
        {children[currentIndex]}
      </motion.div>
    </div>
  );
}
