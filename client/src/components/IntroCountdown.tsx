import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTelegram } from '@/hooks/useTelegram';

const APP_VERSION = '1';
const STORAGE_KEY = `introCountdownSeen_v${APP_VERSION}`;
const DIGITS = [5, 4, 3, 2, 1];
const DIGIT_DURATION = 1200; // ms - увеличено для более плавной анимации

interface IntroCountdownProps {
  onComplete: () => void;
}

export default function IntroCountdown({ onComplete }: IntroCountdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const [nextDigit, setNextDigit] = useState<number | null>(null);
  const [showReadyText, setShowReadyText] = useState(false);
  const { triggerHaptic } = useTelegram();
  const hasShown = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (hasShown.current) return;

    hasShown.current = true;
    setIsVisible(true);
    startCountdown();
  }, []);

  const startCountdown = async () => {
    // Отсчёт 5→4→3→2→1
    for (let i = 0; i < DIGITS.length; i++) {
      const digit = DIGITS[i];
      
      // Очищаем старую nextDigit перед установкой новой currentDigit
      setNextDigit(null);
      setCurrentDigit(digit);
      
      // Хэптик и вибрация СРАЗУ при появлении цифры
      if (digit === 1) {
        triggerHaptic('heavy');
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      } else {
        triggerHaptic('medium');
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }

      // Показываем СЛЕДУЮЩУЮ цифру на фоне в момент начала роста (через 540ms = 45% от 1200ms)
      if (i < DIGITS.length - 1) {
        setTimeout(() => {
          setNextDigit(DIGITS[i + 1]);
        }, 540);
      }

      await new Promise(resolve => setTimeout(resolve, DIGIT_DURATION));
      
      // Убираем текущую цифру
      setCurrentDigit(null);
    }
    
    // Убираем последнюю nextDigit
    setNextDigit(null);
    
    // Показываем "Ты готов(а)?" на 2.5 секунды
    setShowReadyText(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Fade out
    setIsVisible(false);
    
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
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
                className="relative h-[140px]"
                role="status" 
                aria-live="assertive" 
                aria-atomic="true"
              >
                {/* Текущая цифра (взрывается) */}
                <AnimatePresence>
                  {currentDigit !== null && (
                    <motion.div
                      key={`current-${currentDigit}`}
                      initial={{ 
                        opacity: prefersReducedMotion ? 1 : 0, 
                        scale: prefersReducedMotion ? 1 : 0.5,
                        filter: 'blur(0px)'
                      }}
                      animate={prefersReducedMotion ? {
                        opacity: [1, 0],
                      } : { 
                        opacity: [0, 1, 1, 1, 0],
                        scale: [0.5, 1.0, 1.0, 1.2, 8.0],
                        filter: ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(2px)', 'blur(40px)']
                      }}
                      transition={{
                        duration: DIGIT_DURATION / 1000,
                        times: prefersReducedMotion ? [0, 1] : [0, 0.15, 0.45, 0.7, 1],
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      className="text-white font-black leading-none absolute inset-0 flex items-center justify-center"
                      style={{
                        fontSize: 'clamp(80px, 30vmin, 200px)',
                        willChange: prefersReducedMotion ? 'opacity' : 'transform, filter, opacity',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        perspective: '1000px',
                        zIndex: 2
                      }}
                    >
                      {currentDigit}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Следующая цифра (появляется на фоне) */}
                <AnimatePresence>
                  {nextDigit !== null && (
                    <motion.div
                      key={`next-${nextDigit}`}
                      initial={{ 
                        opacity: 0, 
                        scale: 0.5,
                        filter: 'blur(0px)'
                      }}
                      animate={{ 
                        opacity: 1,
                        scale: 1.0,
                        filter: 'blur(0px)'
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      className="text-white font-black leading-none absolute inset-0 flex items-center justify-center"
                      style={{
                        fontSize: 'clamp(80px, 30vmin, 200px)',
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        perspective: '1000px',
                        zIndex: 1
                      }}
                    >
                      {nextDigit}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* "Ты готов(а)?" - показывается ПОСЛЕ отсчёта */}
            {showReadyText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="text-white font-bold"
                style={{ 
                  fontSize: 'clamp(28px, 7vmin, 48px)',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                Ты готов(а)?
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
