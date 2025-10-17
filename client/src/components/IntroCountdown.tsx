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
  const [visibleDigits, setVisibleDigits] = useState<number[]>([]);
  const [explodingDigit, setExplodingDigit] = useState<number | null>(null);
  const [showReadyText, setShowReadyText] = useState(false);
  const { triggerHaptic} = useTelegram();
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
      
      // Показываем текущую цифру и устанавливаем её как взрывающуюся
      setVisibleDigits([digit]);
      setExplodingDigit(digit);
      
      // Хэптик и вибрация СРАЗУ при появлении цифры
      const vibrationDuration = digit === 1 ? 100 : 50;
      const hapticType = digit === 1 ? 'heavy' : 'medium';
      
      console.log(`[Countdown] Digit ${digit} - triggering vibration (${vibrationDuration}ms)`);
      
      // Telegram Haptic
      triggerHaptic(hapticType);
      
      // Navigator Vibrate API
      if ('vibrate' in navigator) {
        try {
          const vibrateResult = navigator.vibrate(vibrationDuration);
          console.log(`[Countdown] Vibrate API result:`, vibrateResult);
        } catch (error) {
          console.error('[Countdown] Vibrate API error:', error);
        }
      } else {
        console.warn('[Countdown] Vibrate API not supported');
      }

      // Показываем СЛЕДУЮЩУЮ цифру на фоне через 100ms после начала взрыва (840ms + 100ms = 940ms)
      if (i < DIGITS.length - 1) {
        setTimeout(() => {
          setVisibleDigits([digit, DIGITS[i + 1]]);
        }, 940);
      }

      await new Promise(resolve => setTimeout(resolve, DIGIT_DURATION));
      
      // Убираем взорвавшуюся цифру из массива
      setVisibleDigits(current => current.filter(d => d !== digit));
    }
    
    // Очищаем все
    setVisibleDigits([]);
    setExplodingDigit(null);
    
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

  if (!isVisible && visibleDigits.length === 0) return null;

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
            {/* Digits */}
            {!showReadyText && (
              <div 
                className="relative h-[140px]"
                role="status" 
                aria-live="assertive" 
                aria-atomic="true"
              >
                <AnimatePresence>
                  {visibleDigits.map((digit) => {
                    const isExploding = digit === explodingDigit;
                    
                    return (
                      <motion.div
                        key={digit}
                        initial={{ 
                          opacity: 0, 
                          scale: 0.5,
                          filter: 'blur(0px)'
                        }}
                        animate={isExploding ? (prefersReducedMotion ? {
                          opacity: [1, 0],
                        } : { 
                          opacity: [0, 1, 1, 1, 0],
                          scale: [0.5, 1.0, 1.0, 1.2, 8.0],
                          filter: ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(2px)', 'blur(40px)']
                        }) : {
                          opacity: 1,
                          scale: 1.0,
                          filter: 'blur(0px)'
                        }}
                        exit={{
                          opacity: 0
                        }}
                        transition={isExploding ? {
                          duration: DIGIT_DURATION / 1000,
                          times: prefersReducedMotion ? [0, 1] : [0, 0.15, 0.45, 0.7, 1],
                          ease: [0.23, 1, 0.32, 1]
                        } : {
                          duration: 0.5,
                          ease: [0.23, 1, 0.32, 1]
                        }}
                        className="text-white font-black leading-none absolute inset-0 flex items-center justify-center"
                        style={{
                          fontSize: 'clamp(80px, 30vmin, 200px)',
                          willChange: isExploding && !prefersReducedMotion ? 'transform, filter, opacity' : 'transform, opacity',
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden',
                          perspective: '1000px',
                          zIndex: isExploding ? 2 : 1
                        }}
                      >
                        {digit}
                      </motion.div>
                    );
                  })}
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
