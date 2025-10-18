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
    console.log(`[VideoController] Registering ${id}`, { source });
    const prev = this.players.get(id);
    if (prev?.el === el && prev?.source === source) {
      console.log(`[VideoController] ${id} already registered, skipping`);
      return;
    }

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
          console.log(`[VideoController] ${id} using native HLS`);
          el.src = source;
          if (el.load) await el.load();
        } else if (Hls.isSupported()) {
          console.log(`[VideoController] ${id} using HLS.js`);
          const hls = new Hls({
            maxBufferLength: 10,
            maxMaxBufferLength: 30,
            startPosition: -1,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 30,
            progressive: true,
            autoStartLoad: false,
            capLevelToPlayerSize: true,
          });
          entry.hls = hls;
          
          hls.attachMedia(el);
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            if (signal.aborted) return;
            hls.loadSource(source);
            hls.startLoad();
          });

          // КРИТИЧНО: Диагностика и фикс выбора уровня
          hls.on(Hls.Events.MANIFEST_PARSED, (_, data: any) => {
            console.log(`[HLS levels for ${id}]`, data.levels.map((l: any, i: number) => ({
              i, w: l.width, h: l.height, v: l.videoCodec, a: l.audioCodec, type: l.attrs?.TYPE
            })));
            
            // 1) Выкинуть audio-only уровни
            const videoLevels = data.levels
              .map((lvl: any, i: number) => ({ i, lvl }))
              .filter((x: any) => (x.lvl.width || x.lvl.height));
            
            // 2) Предпочесть H.264 (avc1) для мобильных
            const avc1Level = videoLevels.find((x: any) => 
              (x.lvl.videoCodec || '').toLowerCase().includes('avc1')
            );
            const pick = avc1Level ?? videoLevels[0];
            
            if (pick) {
              console.log(`[HLS] ${id} selecting level ${pick.i}:`, pick.lvl.videoCodec, `${pick.lvl.width}x${pick.lvl.height}`);
              hls.currentLevel = pick.i;
            } else {
              console.warn(`[HLS] ${id} no video levels found - audio only?`);
            }
          });

          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              console.error(`[VideoController] Fatal HLS error for ${id}:`, data.type, data);
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
    console.log(`[VideoController] Activating ${id}`);
    if (this.activeId === id) {
      console.log(`[VideoController] ${id} already active`);
      return;
    }
    
    this.pauseAll(id);
    this.activeId = id;
    
    const entry = this.players.get(id);
    if (!entry) {
      console.error(`[VideoController] Cannot activate ${id} - not found`);
      return;
    }
    
    const rect = entry.el.getBoundingClientRect();
    console.log(`[VideoController] Playing ${id}`, { 
      readyState: entry.el.readyState,
      paused: entry.el.paused,
      muted: entry.el.muted,
      width: rect.width,
      height: rect.height,
      videoWidth: entry.el.videoWidth,
      videoHeight: entry.el.videoHeight,
      src: entry.el.src,
      currentSrc: entry.el.currentSrc
    });
    
    entry.el.muted = false;
    entry.el.play()
      .then(() => {
        const r = entry.el.getBoundingClientRect();
        console.log(`[VideoController] ${id} playing successfully`, {
          width: r.width,
          height: r.height,
          videoWidth: entry.el.videoWidth,
          videoHeight: entry.el.videoHeight
        });
      })
      .catch((err) => {
        console.warn(`[VideoController] ${id} play failed, retrying muted`, err);
        entry.el.muted = true;
        entry.el.play().catch((e) => console.error(`[VideoController] ${id} muted play failed`, e));
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
