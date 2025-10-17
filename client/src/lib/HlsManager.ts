import Hls from 'hls.js';

export class HlsManager {
  private hls: Hls | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private currentUrl: string = '';
  private isHlsInitialized = false;

  constructor() {
    console.log('[HlsManager] 🎬 Initialized');
  }

  private initializeHls() {
    if (this.isHlsInitialized || !Hls.isSupported()) {
      return;
    }

    console.log('[HlsManager] 🔧 Creating HLS instance (once)');
    
    this.hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    });

    this.hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        console.error('[HlsManager] ❌ Fatal error:', data.type);
        
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log('[HlsManager] 🔄 Network error, retrying...');
            this.hls?.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log('[HlsManager] 🔄 Media error, recovering...');
            this.hls?.recoverMediaError();
            break;
          default:
            // Only destroy on truly unrecoverable errors
            console.error('[HlsManager] 💥 Unrecoverable error, destroying HLS');
            this.destroyHls();
            break;
        }
      }
    });

    this.isHlsInitialized = true;
  }

  private destroyHls() {
    if (this.hls) {
      console.log('[HlsManager] 🗑️ Destroying HLS instance');
      this.hls.destroy();
      this.hls = null;
      this.isHlsInitialized = false;
    }
  }

  attachVideo(video: HTMLVideoElement) {
    this.videoElement = video;
    console.log('[HlsManager] 📹 Video element attached');
    
    // Attach HLS to video if already initialized
    if (this.hls && this.videoElement) {
      this.hls.attachMedia(this.videoElement);
      console.log('[HlsManager] 🔗 HLS attached to video element');
    }
  }

  loadSource(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.videoElement) {
        console.error('[HlsManager] ❌ No video element attached');
        reject(new Error('No video element'));
        return;
      }

      const isHLS = url.includes('.m3u8');
      
      // If same URL - skip reload
      if (this.currentUrl === url) {
        console.log('[HlsManager] ♻️ Same URL, skipping reload');
        resolve();
        return;
      }

      console.log('[HlsManager] 🔄 Loading new source:', url.substring(0, 50));
      
      // Pause video before changing source
      this.videoElement.pause();
      this.currentUrl = url;

      if (isHLS && Hls.isSupported()) {
        // Initialize HLS once if not already done
        if (!this.isHlsInitialized) {
          this.initializeHls();
        }

        if (!this.hls) {
          reject(new Error('HLS initialization failed'));
          return;
        }

        // Attach media if not already attached
        if (!this.hls.media || this.hls.media !== this.videoElement) {
          this.hls.attachMedia(this.videoElement);
        }

        // Reuse existing HLS instance - just load new source
        console.log('[HlsManager] 🔄 Reusing HLS instance, loading new source');
        this.hls.loadSource(url);

        // Listen for manifest parsed (one-time)
        const onManifestParsed = () => {
          console.log('[HlsManager] ✅ Manifest parsed, ready to play');
          this.hls?.off(Hls.Events.MANIFEST_PARSED, onManifestParsed);
          resolve();
        };

        this.hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);

      } else if (isHLS && this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        console.log('[HlsManager] 🍎 Using native HLS (Safari)');
        this.videoElement.src = url;
        this.videoElement.addEventListener('loadedmetadata', () => {
          console.log('[HlsManager] ✅ Native HLS loaded');
          resolve();
        }, { once: true });
        this.videoElement.load();
      } else {
        // Regular MP4
        console.log('[HlsManager] 📹 Loading regular video');
        this.videoElement.src = url;
        this.videoElement.addEventListener('loadedmetadata', () => {
          console.log('[HlsManager] ✅ Video loaded');
          resolve();
        }, { once: true });
        this.videoElement.load();
      }
    });
  }

  play(): Promise<void> {
    if (!this.videoElement) {
      return Promise.reject(new Error('No video element'));
    }
    console.log('[HlsManager] ▶️ Playing');
    return this.videoElement.play();
  }

  pause() {
    if (!this.videoElement) return;
    console.log('[HlsManager] ⏸️ Pausing');
    this.videoElement.pause();
  }

  setMuted(muted: boolean) {
    if (!this.videoElement) return;
    console.log('[HlsManager] 🔇 Muted:', muted);
    this.videoElement.muted = muted;
  }

  destroy() {
    console.log('[HlsManager] 🗑️ Destroying');
    
    this.destroyHls();
    
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
      this.videoElement = null;
    }
    
    this.currentUrl = '';
  }

  getCurrentTime(): number {
    return this.videoElement?.currentTime || 0;
  }

  getDuration(): number {
    return this.videoElement?.duration || 0;
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }
}
