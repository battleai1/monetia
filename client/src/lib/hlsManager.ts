// Глобальный менеджер HLS - гарантирует что существует ТОЛЬКО ОДИН HLS инстанс

import Hls from 'hls.js';

class HLSManager {
  private currentHls: Hls | null = null;
  private currentVideoId: string | null = null;
  private currentVideo: HTMLVideoElement | null = null;

  // Устанавливаем HLS для активного видео
  setActiveVideo(video: HTMLVideoElement, videoUrl: string, videoId: string) {
    // Если уже есть HLS для другого видео - уничтожаем
    if (this.currentHls && this.currentVideoId !== videoId) {
      console.log('[HLSManager] Switching from', this.currentVideoId, 'to', videoId);
      this.destroyCurrent();
    }

    // Если уже установлен для этого видео - ничего не делаем
    if (this.currentVideoId === videoId && this.currentHls) {
      console.log('[HLSManager] Already active for', videoId);
      return;
    }

    // Создаём новый HLS
    const isHLS = videoUrl.includes('.m3u8');
    
    if (isHLS && Hls.isSupported()) {
      console.log('[HLSManager] Creating HLS for', videoId);
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('[HLSManager] Fatal error for', videoId, data.type);
          this.destroyCurrent();
        }
      });
      
      this.currentHls = hls;
      this.currentVideoId = videoId;
      this.currentVideo = video;
    } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      this.currentVideoId = videoId;
      this.currentVideo = video;
    } else if (!isHLS) {
      video.src = videoUrl;
      this.currentVideoId = videoId;
      this.currentVideo = video;
    }
  }

  // Деактивировать текущее видео
  deactivateVideo(videoId: string) {
    if (this.currentVideoId === videoId) {
      console.log('[HLSManager] Deactivating', videoId);
      this.destroyCurrent();
    }
  }

  // Уничтожить текущий HLS
  private destroyCurrent() {
    if (this.currentHls) {
      this.currentHls.destroy();
      this.currentHls = null;
    }
    
    if (this.currentVideo) {
      this.currentVideo.pause();
      this.currentVideo.removeAttribute('src');
      this.currentVideo.src = '';
      this.currentVideo.load();
      this.currentVideo = null;
    }
    
    this.currentVideoId = null;
  }

  // Получить текущий активный videoId
  getCurrentVideoId() {
    return this.currentVideoId;
  }
}

// Единственный экземпляр менеджера
export const hlsManager = new HLSManager();
