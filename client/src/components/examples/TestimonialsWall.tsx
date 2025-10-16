import TestimonialsWall from '../TestimonialsWall';
import { testimonials } from '@/lib/content';

export default function TestimonialsWallExample() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black">
      <TestimonialsWall testimonials={testimonials} />
    </div>
  );
}
