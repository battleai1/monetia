import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app.store';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  author: string;
  role?: string;
}

export default function TestimonialModal({
  isOpen,
  onClose,
  videoUrl,
  author,
  role,
}: TestimonialModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isMuted } = useAppStore();

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
      data-testid="testimonial-modal"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover-elevate active-elevate-2"
        aria-label="Close"
        data-testid="button-close-modal"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="relative w-full h-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          src={videoUrl}
          muted={isMuted}
          loop
          playsInline
          className="w-full h-full object-cover"
          data-testid="testimonial-video"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h3 className="text-white text-xl font-semibold" data-testid="modal-author">
            {author}
          </h3>
          {role && (
            <p className="text-white/70 text-sm" data-testid="modal-role">
              {role}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
