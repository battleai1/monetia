import { useQuery } from '@tanstack/react-query';
import type { Video } from '@shared/schema';

export function useVideos(type?: string) {
  return useQuery<Video[]>({
    queryKey: type ? ['/api/videos', type] : ['/api/videos'],
    enabled: true,
  });
}

export function useSalesReels() {
  return useVideos('sales');
}

export function useLessons() {
  return useVideos('lesson');
}

export function useTestimonials() {
  return useVideos('testimonial');
}
