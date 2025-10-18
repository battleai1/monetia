import Hls from 'hls.js';

type Entry = {
  id: string;
  el: HTMLVideoElement;
  hls?: Hls | null;
  ac?: AbortController;
  src: string;
};

const isIOS =
  /iP(hone|od|ad)/.test(navigator.platform) ||
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

export class VideoController {
  private players = new Map<string, Entry>();
  private activeId: string | null = null;

  register(el: HTMLVideoElement, src: string, id: string) {
    // Cleanup if re-registering
    if (this.players.has(id)) this.destroy(id);

    // Обязательные атрибуты ДО присвоения источника
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', 'true');
    el.playsInline = true;
    el.muted = true;
    el.loop = true;
    el.preload = 'metadata';
    el.crossOrigin = 'anonymous';

    const entry: Entry = { id, el, src, hls: null, ac: new AbortController() };
    this.players.set(id, entry);

    const { signal } = entry.ac!;
    (async () => {
      try {
        if (signal.aborted) return;

        // iOS: нативный HLS
        if (isIOS && el.canPlayType('application/vnd.apple.mpegURL')) {
          console.log(`[VideoController] ${id} using native HLS (iOS)`);
          el.src = src;
          el.load();
        } 
        // Другие платформы: hls.js
        else if (Hls.isSupported()) {
          console.log(`[VideoController] ${id} using HLS.js`);
          const hls = new Hls({
            lowLatencyMode: true,
            capLevelToPlayerSize: true,
            progressive: true,
            backBufferLength: 30,
          });
          entry.hls = hls;

          hls.attachMedia(el);
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            if (signal.aborted) return;
            hls.loadSource(src);
            hls.startLoad();
          });

          // КРИТИЧНО: выбор правильного уровня (H.264/avc1)
          hls.on(Hls.Events.MANIFEST_PARSED, (_evt, d: any) => {
            console.log(`[HLS levels for ${id}]`, d.levels.map((l: any) => ({
              w: l.width,
              h: l.height,
              v: l.videoCodec,
              a: l.audioCodec,
            })));

            // 1) Отбросить audio-only уровни
            const videoLvls = d.levels
              .map((lvl: any, i: number) => ({ i, lvl }))
              .filter((x: any) => x.lvl.width || x.lvl.height);

            // 2) Приоритет H.264 (avc1) с МАКСИМАЛЬНЫМ разрешением
            const avc1Levels = videoLvls.filter((x: any) =>
              (x.lvl.videoCodec || '').toLowerCase().includes('avc1')
            );
            // Выбрать ПОСЛЕДНИЙ avc1 уровень (наивысшее разрешение)
            const pick = avc1Levels.length > 0 
              ? avc1Levels[avc1Levels.length - 1] 
              : videoLvls[videoLvls.length - 1];

            if (pick) {
              console.log(`[HLS] ${id} selecting level ${pick.i}:`, pick.lvl.videoCodec, `${pick.lvl.width}x${pick.lvl.height}`);
              hls.currentLevel = pick.i;
            } else {
              console.warn(`[HLS] ${id} no video levels found - audio only?`);
            }
          });

          hls.on(Hls.Events.ERROR, (_evt, data: any) => {
            if (data.fatal) {
              console.error(`[VideoController] Fatal HLS error for ${id}:`, data.type);
              try {
                hls.destroy();
              } catch (e) {}
              entry.hls = null;
            }
          });
        } 
        // Fallback: обычное видео (MP4)
        else {
          console.log(`[VideoController] ${id} using direct src`);
          el.src = src;
          el.load();
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
    const e = this.players.get(id);
    if (!e) return;
    e.el.muted = false;
    e.el.play().catch(() => {});
  }

  pauseAll(exceptId?: string) {
    for (const [pid, e] of this.players) {
      if (exceptId && pid === exceptId) continue;
      try {
        e.el.playbackRate = 1.0;
        e.el.pause();
        e.el.muted = true;
      } catch (e) {}
    }
  }

  destroy(id: string) {
    const e = this.players.get(id);
    if (!e) return;
    e.ac?.abort();
    try {
      e.hls?.stopLoad();
      e.hls?.detachMedia();
      e.hls?.destroy();
    } catch (err) {}
    try {
      e.el.removeAttribute('src');
      e.el.load();
    } catch (err) {}
    this.players.delete(id);
    if (this.activeId === id) this.activeId = null;
  }
}

export const videoController = new VideoController();
