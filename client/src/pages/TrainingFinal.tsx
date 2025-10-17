import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import TestimonialsWall from '@/components/TestimonialsWall';
import { useTestimonials } from '@/hooks/useVideos';
import { logPurchaseClick } from '@/lib/analytics';
import { useTelegram } from '@/hooks/useTelegram';
import type { Testimonial } from '@/lib/content';
import type { Video } from '@shared/schema';

export default function TrainingFinal() {
  const { webApp, triggerHaptic } = useTelegram();
  const { data: videosData, isLoading } = useTestimonials();
  
  const testimonials = useMemo(() => {
    if (!videosData) return [];
    return videosData.map((video: Video): Testimonial => ({
      id: video.id,
      author: video.author || '',
      role: video.role || undefined,
      thumbUrl: video.thumbUrl || '',
      videoUrl: video.videoUrl,
      highlight: video.highlight || undefined,
    }));
  }, [videosData]);

  useEffect(() => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText('Купить основной продукт');
      webApp.MainButton.show();
      webApp.MainButton.onClick(handlePrimaryPurchase);

      return () => {
        webApp.MainButton.hide();
        webApp.MainButton.offClick(handlePrimaryPurchase);
      };
    }
  }, [webApp]);

  const handlePrimaryPurchase = () => {
    logPurchaseClick('training_final');
    triggerHaptic('medium');

    const checkoutUrl = import.meta.env.VITE_CHECKOUT_URL;
    if (checkoutUrl && webApp) {
      webApp.openLink(checkoutUrl, { try_instant_view: false });
    } else {
      console.log('Purchase initiated - payment integration pending');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black">
      <div className="pt-safe pt-8 pb-8 px-4">
        <h1 className="text-white text-3xl font-bold text-center mb-2" data-testid="final-heading">
          Следующий шаг
        </h1>
        <p className="text-white/70 text-center mb-8" data-testid="final-subheading">
          Готовы перейти на новый уровень?
        </p>

        <Button
          onClick={handlePrimaryPurchase}
          className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-2xl mb-4"
          data-testid="button-purchase-main"
        >
          Купить основной продукт
        </Button>

        <p className="text-white/50 text-xs text-center mb-12" data-testid="disclaimer">
          Результаты зависят от ваших усилий. Мы не гарантируем конкретных сумм или доходов.
        </p>

        <h2 className="text-white text-2xl font-bold mb-6" data-testid="testimonials-heading">
          Что говорят ученики
        </h2>

        {isLoading ? (
          <div className="text-center text-white/70">Загрузка отзывов...</div>
        ) : testimonials && testimonials.length > 0 ? (
          <TestimonialsWall testimonials={testimonials} />
        ) : (
          <div className="text-center text-white/70">Отзывы скоро появятся</div>
        )}
      </div>
    </div>
  );
}
