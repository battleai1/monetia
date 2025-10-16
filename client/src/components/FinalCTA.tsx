import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface FinalCTAProps {
  text: string;
  onClick: () => void;
  visible: boolean;
}

export default function FinalCTA({ text, onClick, visible }: FinalCTAProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          data-testid="final-cta-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-6 w-full max-w-sm"
          >
            <Button
              onClick={onClick}
              className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-2xl rounded-2xl"
              data-testid="button-final-cta"
            >
              {text}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
