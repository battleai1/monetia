# NeurotRaffic - Vertical Video Sales Funnel

## Overview

NeurotRaffic is a Telegram WebApp designed to deliver educational content and sales funnels through an Instagram Reels-style vertical video experience. It features two main flows: a sales funnel introducing vertical video marketing and a training flow with educational lessons. The application is optimized for mobile with fullscreen vertical videos (9:16), swipe navigation, and a dark theme. Key capabilities include deep linking to specific reels, HLS video streaming, and a robust Telegram authentication system. The project aims to leverage vertical video for engaging user experiences and effective content delivery, with ambitions for market potential in mobile-first content consumption and direct sales funnels.

## Recent Changes (October 2025)

### Video Preloading System (October 17, 2025)
- ✅ Created `useVideoPreloader` hook for sequential HLS video preloading
- ✅ Videos preload during countdown animation (~7.6s window in SalesFlow)
- ✅ First video buffers 58.9s in <1 second using HLS.js manifest parsing
- ✅ Integrated in SalesFlow (starts during countdown) and TrainingFlow (starts on mount)
- ✅ Duplicate URL detection prevents re-downloading same videos
- ✅ Performance: Instant playback after countdown, no loading delays on swipe
- ✅ Console logging: `[VideoPreloader] Video N buffered Xs` for monitoring

### Redis Caching System (October 17, 2025)
- ✅ Installed `ioredis` client for Redis connectivity
- ✅ Created caching utilities: `getCached()`, `setCache()`, `invalidateCache()`
- ✅ Added caching to video API endpoints with 5-minute TTL
- ✅ Cache management endpoint: POST `/api/cache/clear` with pattern support
- ✅ Performance improvement: 3.4x faster responses (97ms cached vs 333ms DB)
- ✅ Graceful fallback: works without Redis, just logs warning

### Telegram Bot Integration (October 17, 2025)
- ✅ Integrated `telegraf` library for Telegram Bot API
- ✅ Auto-accepts channel join requests via `chat_join_request` handler
- ✅ Sends welcome message "+10 руб. - продолжи просмотр" with WebApp inline button
- ✅ Bot authenticated and running with long polling active (Monetia_Bot)
- ✅ Requires `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID` environment secrets
- ✅ Bot must be admin in target channel to auto-approve join requests

### Video System Complete Rebuild (October 18, 2025) - CSS Safe Mode Edition
- ✅ **VideoController Rewrite** - strict TZ compliance:
  - iOS detection: `/iP(hone|od|ad)/.test(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document)`
  - Native HLS for iOS (`video.canPlayType('application/vnd.apple.mpegURL')`), hls.js for Android/desktop
  - MANIFEST_PARSED: filters audio-only levels, selects HIGHEST avc1 level (e.g., 720x1280 instead of 198x352)
  - AbortController prevents race conditions, proper cleanup: stopLoad, detachMedia, destroy
  - Singleton pattern: only ONE Hls() instance per video ID
- ✅ **ReelCard Simplified** - removed black screen risks:
  - Removed motion.div transform (violates CSS Safe Mode!)
  - Removed poster (can cause rendering issues)
  - Pointer events gestures (180ms threshold):
    * x <= 0.66 → toggle pause/resume
    * x > 0.66 → playbackRate 2.0 while holding
  - No longer syncs with isMuted store (VideoController manages muted state)
- ✅ **CSS Safe Mode** - eliminates mobile black screens:
  - NO transform/filter/backdrop-filter/mix-blend-mode/perspective on video or ancestors
  - Border-radius on inner wrapper, not video element
  - Uses `top` offset instead of `transform: translateY` for positioning
  - 100dvh viewport height for proper mobile display
- ✅ **IntersectionObserver** - auto-activation at 60% visibility:
  - threshold: [0, 0.2, 0.6, 0.8, 1]
  - Observes/unobserves dynamically in ref callback (supports newly mounted reels)
  - Activates video when ≥60% visible in viewport
- ✅ **Telegram WebApp Integration**:
  - Calls Telegram.WebApp.ready() and expand() on mount
  - Excludes visibilitychange pausing in Telegram (avoids false "hidden" events)
- ✅ **Replit Dev Exception**:
  - Force-activates first reel after 400ms in iframe (IntersectionObserver may not trigger at 60% in preview)
  - Ignores visibilitychange in Replit iframe
- ✅ Performance: Highest quality HLS (avc1 codec), zero duplicate audio, CSS-safe rendering

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with **React 18** and **TypeScript**, using **Vite** for fast development. **Wouter** handles client-side routing. UI components are crafted using **Radix UI** primitives and **shadcn/ui**, styled with **Tailwind CSS** for a dark-first theme inspired by Instagram Reels. **Framer Motion** powers smooth animations and gesture-based interactions like vertical swipe navigation. State management relies on **Zustand** for global app state and **TanStack Query** (React Query) for server state and data fetching.

### Backend Architecture

The backend utilizes **Express.js** with **TypeScript** for API routing and custom middleware. Authentication is handled via **HMAC-SHA256 validation** of Telegram initData, ensuring secure user login and automatic user creation/update. A **PostgreSQL database**, specifically **Neon serverless PostgreSQL**, is used for persistent storage, managed with **Drizzle ORM**. Data includes video content and user information. **Redis** is implemented for caching video API responses, significantly improving performance.

### System Design Choices

The application implements an Instagram Reels-style UI with a dark theme, featuring vertical swipe navigation, video playback management (auto-play/pause), and a CTA timing system. Key features include expandable descriptions, author blocks, floating action buttons, and progress indicators. **HLS video streaming** is supported for optimized delivery. A **countdown animation** precedes video playback, and aggressive auto-play strategies are employed for mobile devices. The system supports **Telegram WebApp deep linking** to specific video content. Interactive video controls allow pausing and 2x speed playback. A synchronized **comments system** provides an Instagram-like interaction experience. Mobile Telegram WebApp optimization includes adaptive padding to accommodate native UI elements.

## External Dependencies

*   **Telegram Integration**: 
    - `@twa-dev/sdk` for Telegram WebApp API features like haptic feedback, MainButton, user data, and native share functionality
    - `telegraf` for Telegram Bot API (auto-accepting channel join requests, sending welcome messages)
*   **Database**: Neon Database for serverless PostgreSQL, managed with Drizzle ORM.
*   **Caching**: `ioredis` for Redis caching.
*   **Video Streaming**: `hls.js` for HLS video playback; Bunny CDN for HLS streams.
*   **Media & Content**: Video content is served from external CDNs (e.g., Google Cloud Storage).
*   **UI Libraries**: Radix UI, shadcn/ui, Framer Motion, cmdk, class-variance-authority, clsx, tailwind-merge.
*   **Development & Tooling**: Vite, PostCSS, Tailwind CSS, Autoprefixer, tsx, esbuild.