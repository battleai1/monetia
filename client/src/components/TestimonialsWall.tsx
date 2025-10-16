import { useState } from 'react';
import { Play } from 'lucide-react';
import { Testimonial } from '@/lib/content';
import TestimonialModal from './TestimonialModal';

interface TestimonialsWallProps {
  testimonials: Testimonial[];
}

export default function TestimonialsWall({ testimonials }: TestimonialsWallProps) {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, testimonials.length));
  };

  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {visibleTestimonials.map((testimonial) => (
          <button
            key={testimonial.id}
            onClick={() => setSelectedTestimonial(testimonial)}
            className="relative aspect-[9/16] rounded-lg overflow-hidden group hover-elevate active-elevate-2"
            data-testid={`testimonial-${testimonial.id}`}
          >
            <img
              src={testimonial.thumbUrl}
              alt={testimonial.author}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-4">
              <div className="flex justify-center items-center flex-1">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium" data-testid={`testimonial-author-${testimonial.id}`}>
                  {testimonial.author}
                </p>
                {testimonial.role && (
                  <p className="text-white/70 text-xs" data-testid={`testimonial-role-${testimonial.id}`}>
                    {testimonial.role}
                  </p>
                )}
                {testimonial.highlight && (
                  <p className="text-white/90 text-xs italic mt-1 line-clamp-2" data-testid={`testimonial-highlight-${testimonial.id}`}>
                    {testimonial.highlight}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
            data-testid="button-load-more"
          >
            Загрузить ещё
          </button>
        </div>
      )}

      {selectedTestimonial && (
        <TestimonialModal
          isOpen={!!selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
          videoUrl={selectedTestimonial.videoUrl}
          author={selectedTestimonial.author}
          role={selectedTestimonial.role}
        />
      )}
    </>
  );
}
