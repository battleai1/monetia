import { useState } from 'react';
import TestimonialModal from '../TestimonialModal';
import { Button } from '@/components/ui/button';

export default function TestimonialModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <TestimonialModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        author="Мария"
        role="Студент"
      />
    </div>
  );
}
