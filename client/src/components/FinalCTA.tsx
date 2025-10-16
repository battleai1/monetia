import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface FinalCTAProps {
  text: string;
  onClick: () => void;
  visible: boolean;
}

export default function FinalCTA({ text, onClick, visible }: FinalCTAProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-safe bottom-8 left-4 right-4 z-40"
    >
      <Button
        onClick={onClick}
        className="w-full h-14 text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-lg"
        data-testid="button-final-cta"
      >
        {text}
      </Button>
    </motion.div>
  );
}
