import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTelegram } from '@/hooks/useTelegram';

const DIGITS = [5, 4, 3, 2, 1];
const T = 1500;                   // длительность одного тика (1.5 секунды)
const OVERLAP = 0.4;              // доля перекрытия следующей цифры (40%)
const OVERLAY_FADE = 280;         // исчезновение оверлея

// Расчёт общего времени отсчёта:
// Первая цифра: T = 1500ms
// Следующие 4 цифры: T * (1 - OVERLAP) = 1500 * 0.6 = 900ms каждая
// Итого: 1500 + 4*900 = 5100ms ≈ 5 секунд ✓

interface IntroCountdownProps {
  onComplete: () => void;
}

export default function IntroCountdown({ onComplete }: IntroCountdownProps) {
  console.log('[IntroCountdown] Component mounting...');
  
  const [isVisible, setIsVisible] = useState(false);
  const [showReadyText, setShowReadyText] = useState(false);
  const { triggerHaptic } = useTelegram();
  const hasShown = useRef(false);
  const hasInteracted = useRef(false);
  const layer0Ref = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);

  // Track user interaction for vibrate API
  useEffect(() => {
    const handleInteraction = () => {
      hasInteracted.current = true;
    };
    window.addEventListener('pointerdown', handleInteraction, { once: true });
    return () => window.removeEventListener('pointerdown', handleInteraction);
  }, []);

  useEffect(() => {
    if (hasShown.current) return;
    hasShown.current = true;
    setIsVisible(true);
    
    // Ждём монтирования refs перед запуском countdown
    setTimeout(() => {
      console.log('[Countdown] Starting after mount...');
      runCountdown();
    }, 100);
  }, []);

  // Хэптик с безопасной проверкой
  const haptic = (n: number) => {
    try {
      const hapticType = n === 1 ? 'heavy' : 'medium';
      triggerHaptic(hapticType);
      
      // Фолбэк navigator.vibrate (только после user gesture)
      if ('vibrate' in navigator && hasInteracted.current) {
        navigator.vibrate(30);
      }
    } catch (error) {
      console.warn('[Countdown] Haptic error:', error);
    }
  };

  // Единая анимация для цифры (Web Animations API)
  const playDigit = (el: HTMLDivElement, value: number): void => {
    el.textContent = String(value);
    
    // Отменяем все текущие анимации
    el.getAnimations().forEach(a => a.cancel());

    // Пик (момент хэптика) ~35% длительности
    const hapticDelay = Math.round(T * 0.35);

    // Ключевая анимация: увеличение + размытие
    el.animate([
      { opacity: '0', transform: 'scale(0.7)', filter: 'blur(0px)' },
      { opacity: '1', transform: 'scale(1.0)', filter: 'blur(0px)', offset: 0.25 },
      { opacity: '0', transform: 'scale(2.0)', filter: 'blur(10px)' }
    ], { 
      duration: T, 
      easing: 'cubic-bezier(0.4,0,0.2,1)', 
      fill: 'both' 
    });

    // Триггер хэптика на пике
    setTimeout(() => haptic(value), hapticDelay);
  };

  // Главный цикл с перекрытием (двойной буфер)
  const runCountdown = async () => {
    const layers = [layer0Ref.current, layer1Ref.current];
    if (!layers[0] || !layers[1]) {
      console.error('[Countdown] Refs not initialized');
      return;
    }

    console.log('[Countdown] Starting countdown...');
    let buf = 0; // какой слой "входящий"
    
    for (let i = 0; i < DIGITS.length; i++) {
      const incoming = layers[buf];
      const n = DIGITS[i];

      console.log(`[Countdown] Playing digit ${n} on layer ${buf}`);
      
      // Стартуем входящую цифру
      playDigit(incoming, n);

      // Следующую цифру запустим раньше конца текущей — перекрытие
      const nextDelay = Math.max(0, T * (1 - OVERLAP)); // ~420ms
      
      if (i < DIGITS.length - 1) {
        await new Promise(r => setTimeout(r, nextDelay));
        buf = 1 - buf; // переключаем буфер
        continue;
      }

      // Для последней цифры — дождёмся конца анимации
      await new Promise(r => setTimeout(r, T));
    }

    // Показываем "Ты готов(а)?" на 2.5 секунды
    console.log('[Countdown] Showing "Ты готов(а)?"...');
    setShowReadyText(true);
    await new Promise(r => setTimeout(r, 2500));

    // Fade out
    console.log('[Countdown] Fading out, calling onComplete...');
    setIsVisible(false);
    setTimeout(() => {
      console.log('[Countdown] Complete!');
      onComplete();
    }, OVERLAY_FADE);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: OVERLAY_FADE / 1000 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      data-testid="intro-countdown"
    >
      {/* Backdrop - полностью чёрный */}
      <div className="absolute inset-0 bg-black" />

      {/* Content */}
      <div className="relative text-center px-6">
        {/* Двойной буфер цифр */}
        {!showReadyText && (
          <div 
            className="relative w-full grid place-items-center"
            style={{ height: '40vh' }}
            role="status" 
            aria-live="assertive" 
            aria-atomic="true"
          >
            {/* Слой 0 */}
            <div
              ref={layer0Ref}
              className="absolute text-white font-black leading-none select-none"
              style={{
                fontSize: 'clamp(80px, 30vmin, 200px)',
                willChange: 'transform, filter, opacity',
                filter: 'blur(0)',
                opacity: 0,
                transform: 'scale(0.7)',
              }}
            >
              5
            </div>

            {/* Слой 1 */}
            <div
              ref={layer1Ref}
              className="absolute text-white font-black leading-none select-none"
              style={{
                fontSize: 'clamp(80px, 30vmin, 200px)',
                willChange: 'transform, filter, opacity',
                filter: 'blur(0)',
                opacity: 0,
                transform: 'scale(0.7)',
              }}
            >
              5
            </div>
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
            }}
          >
            Ты готов(а)?
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
