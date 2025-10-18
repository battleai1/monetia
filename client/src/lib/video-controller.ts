import Hls from 'hls.js';

type PlayerEntry = {
  id: string;
  el: HTMLVideoElement;
  hls?: Hls | null;
  initAbort?: AbortController;
  source: string;
};

class VideoController {
  private players = new Map<string, PlayerEntry>();
  private activeId: string | null = null;

  register(el: HTMLVideoElement, source: string, id: string) {
    const prev = this.players.get(id);
    if (prev?.el === el && prev?.source === source) return;

    if (prev) this.destroy(id);

    const entry: PlayerEntry = { id, el, source, hls: null, initAbort: new AbortController() };
    this.players.set(id, entry);

    el.muted = true;
    el.playsInline = true;
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', 'true');
    el.preload = 'metadata';
    el.loop = false;

    const { signal } = entry.initAbort!;
    (async () => {
      try {
        if (signal.aborted) return;

        if (el.canPlayType('application/vnd.apple.mpegURL')) {
          el.src = source;
          if (el.load) await el.load();
        } else if (Hls.isSupported()) {
          const hls = new Hls({
            maxBufferLength: 10,
            maxMaxBufferLength: 30,
            startPosition: -1,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 30,
            progressive: true,
            autoStartLoad: false,
          });
          entry.hls = hls;
          
          hls.attachMedia(el);
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            if (signal.aborted) return;
            hls.loadSource(source);
            hls.startLoad();
          });

          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              console.error(`[VideoController] Fatal HLS error for ${id}:`, data.type);
              try {
                hls.stopLoad();
                hls.detachMedia();
                hls.destroy();
              } catch (e) {}
              entry.hls = null;
            }
          });
        } else {
          el.src = source;
        }
      } catch (e) {
        console.error(`[VideoController] Init error for ${id}:`, e);
      }
    })();
  }

  activate(id: string) {
    if (this.activeId === id) return;
    
    this.pauseAll(id);
    this.activeId = id;
    
    const entry = this.players.get(id);
    if (!entry) return;
    
    entry.el.muted = false;
    entry.el.play().catch(() => {
      entry.el.muted = true;
      entry.el.play().catch(() => {});
    });
  }

  pauseAll(exceptId?: string) {
    Array.from(this.players.entries()).forEach(([pid, p]) => {
      if (exceptId && pid === exceptId) return;
      try {
        p.el.playbackRate = 1.0;
        p.el.pause();
        p.el.muted = true;
      } catch (e) {}
    });
  }

  destroy(id: string) {
    const entry = this.players.get(id);
    if (!entry) return;
    
    entry.initAbort?.abort();
    
    try {
      if (entry.hls) {
        entry.hls.stopLoad();
        entry.hls.detachMedia();
        entry.hls.destroy();
      }
    } catch (e) {}
    
    try {
      entry.el.pause();
      entry.el.src = '';
      entry.el.removeAttribute('src');
      entry.el.load();
    } catch (e) {}
    
    this.players.delete(id);
    if (this.activeId === id) this.activeId = null;
  }

  getActiveId() {
    return this.activeId;
  }
}

export const videoController = new VideoController();
