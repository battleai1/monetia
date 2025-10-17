# NeurotRaffic - Vertical Video Sales Funnel

## Overview

NeurotRaffic is a Telegram WebApp designed to deliver educational content and sales funnels through an Instagram Reels-style vertical video experience. It features two main flows: a sales funnel introducing vertical video marketing and a training flow with educational lessons. The application is optimized for mobile with fullscreen vertical videos (9:16), swipe navigation, and a dark theme. Key capabilities include deep linking to specific reels, HLS video streaming, and a robust Telegram authentication system. The project aims to leverage vertical video for engaging user experiences and effective content delivery, with ambitions for market potential in mobile-first content consumption and direct sales funnels.

## Recent Changes (October 2025)

### Video Preloading System (October 17, 2025) - DEPRECATED
- ~~Created `useVideoPreloader` hook for sequential HLS video preloading~~
- ❌ **REMOVED**: Caused audio duplication issues by creating additional HLS instances
- ❌ Replaced by new single-instance architecture (see Video Playback Architecture Rewrite)

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

### Video Playback Architecture Rewrite (October 17, 2025)
- ✅ **Complete rewrite** of video playback system to eliminate audio duplication bugs
- ✅ **New Architecture**: Single video element + single HLS instance shared across all reels
  - `HlsManager` class: Manages single HLS.js instance, reuses it via `loadSource()` for different videos
  - `VideoPlaybackProvider`: React context managing playback state and HLS lifecycle
  - `VideoPlayerShell`: Single `<video>` element rendered once, positioned behind all reel overlays
  - `ReelOverlay`: Presentational component for UI (hooks, captions, CTA, comments) - no video logic
  - `ReelsViewport`: Orchestrates swipe navigation and overlay positioning
- ✅ **Guarantees**: Physically impossible to have audio duplication (only one video/HLS exists)
- ✅ **Performance**: Zero HLS reinitializations on swipes, instant source switching
- ✅ **Memory**: Single HLS instance throughout app lifecycle, proper cleanup on unmount
- ✅ **Removed**: `useHLS` hook, old `ReelCard` component, `useVideoPreloader` (caused duplication)
- ✅ **Integration**: forcePlayActive() for post-countdown mobile autoplay, muted state sync from global store

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