import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTelegram } from '@/hooks/useTelegram';

const APP_VERSION = '1';
const STORAGE_KEY = `introCountdownSeen_v${APP_VERSION}`;
const DIGITS = [5, 4, 3, 2, 1];
const DIGIT_DURATION = 700; // ms

interface IntroCountdownProps {
  onComplete: () => void;
}

export default function IntroCountdown({ onComplete }: IntroCountdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const [showReadyText, setShowReadyText] = useState(false);
  const { triggerHaptic } = useTelegram();
  const hasShown = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (hasShown.current) return;
    
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) {
      onComplete();
      return;
    }

    hasShown.current = true;
    setIsVisible(true);
    startCountdown();
  }, []);

  const startCountdown = async () => {
    // Отсчёт 5→4→3→2→1
    for (let i = 0; i < DIGITS.length; i++) {
      const digit = DIGITS[i];
      setCurrentDigit(digit);
      
      // Хэптик в момент появления цифры
      setTimeout(() => {
        if (digit === 1) {
          triggerHaptic('heavy');
        } else {
          triggerHaptic('medium');
        }
      }, 250);

      await new Promise(resolve => setTimeout(resolve, DIGIT_DURATION));
    }

    // Убираем цифру
    setCurrentDigit(null);
    
    // Показываем "Ты готов(а)?" на 1 секунду
    setShowReadyText(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fade out
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, '1');
    
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  if (!isVisible && !currentDigit) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          data-testid="intro-countdown"
        >
          {/* Backdrop - полностью чёрный */}
          <div className="absolute inset-0 bg-black" />

          {/* Content */}
          <div className="relative text-center px-6">
            {/* Digit */}
            {!showReadyText && (
              <div 
                className="relative"
                role="status" 
                aria-live="assertive" 
                aria-atomic="true"
              >
                <AnimatePresence mode="wait">
                  {currentDigit !== null && (
                    <motion.div
                      key={currentDigit}
                      initial={{ 
                        opacity: prefersReducedMotion ? 1 : 0, 
                        scale: prefersReducedMotion ? 1 : 0.7,
                        filter: 'blur(0px)'
                      }}
                      animate={prefersReducedMotion ? {
                        opacity: [1, 0],
                      } : { 
                        opacity: [0, 1, 1, 0],
                        scale: [0.7, 1.0, 1.0, 2.0],
                        filter: ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(10px)']
                      }}
                      transition={{
                        duration: DIGIT_DURATION / 1000,
                        times: prefersReducedMotion ? [0, 1] : [0, 0.25, 0.5, 1],
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="text-white font-black leading-none"
                      style={{
                        fontSize: 'clamp(56px, 20vmin, 140px)',
                        willChange: prefersReducedMotion ? 'opacity' : 'transform, filter, opacity'
                      }}
                    >
                      {currentDigit}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* "Ты готов(а)?" - показывается ПОСЛЕ отсчёта */}
            {showReadyText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-white font-bold"
                style={{ fontSize: 'clamp(20px, 5vmin, 32px)' }}
              >
                Ты готов(а)?
              </motion.div>
            )}
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 px-3 py-2 bg-white/8 border border-white/18 text-white rounded-xl backdrop-blur-sm transition-colors hover:bg-white/12"
            aria-label="Пропустить обратный отсчёт"
            data-testid="button-skip-countdown"
          >
            Пропустить
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
