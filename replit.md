# NeurotRaffic - Vertical Video Sales Funnel

## Overview

NeurotRaffic is a Telegram WebApp that delivers educational content and sales funnels through Instagram Reels-style vertical video experiences. The application features two primary flows: a sales funnel that introduces users to vertical video marketing concepts, and a training flow that provides educational lessons. The experience is optimized for mobile devices with fullscreen vertical videos (9:16 aspect ratio), swipe-based navigation, and a dark theme aesthetic inspired by Instagram Reels.

## Recent Changes (October 2025)

### Latest Updates
- ✅ **Intro Countdown Animation** (Стартовый отсчёт) - ФИНАЛЬНАЯ ВЕРСИЯ:
  - **Техника двойного буфера** - два абсолютно позиционированных слоя цифр (flip-flop)
  - **Перекрывающиеся анимации** - следующая цифра начинается ДО завершения предыдущей
  - **Параметры:**
    - Hold time (пауза): **800ms** - цифра стоит на месте
    - Animation time (взрыв): **700ms** - быстрая взрывная анимация
    - Общая длительность тика (T): **1500ms** (800 + 700)
    - Перекрытие (overlap): **40%** (600ms)
    - Следующая цифра стартует через: **900ms** (T * 0.6)
  - **Анимация цифры (4 keyframes):**
    1. Появление (0-10%): opacity 0→1, scale 0.7→1.0 (150ms)
    2. Hold phase (10-53%): opacity 1, scale 1.0 стоит на месте (650ms) ⏸️
    3. Взрыв (53-100%): opacity 1→0, scale 1.0→2.0, blur 0→10px (700ms) 💥
    - Easing: cubic-bezier(0.4, 0, 0.2, 1)
  - **Хэптик срабатывает в начале взрыва** (после hold, ~800ms):
    - Telegram HapticFeedback API: medium для 5-2, heavy для 1
    - Fallback Web Vibration API: 30ms для medium, 50ms для heavy
    - Работает на смартфонах в Telegram боте (версия > 6.0)
  - **Web Animations API (WAAPI)** - нативные браузерные анимации, 60 FPS, GPU-ускорение
  - **Последовательность**: таймер (5с) → "Ты готов(а)?" (2.5с) → видео запускается
  - **Общая длительность countdown**: ~7.6 секунд
  - **Размеры**:
    - Цифры: clamp(80px, 30vmin, 200px)
    - Надпись "Ты готов(а)?": clamp(28px, 7vmin, 48px)
  - Видео НЕ рендерится до завершения countdown
  - Доступность: aria-live для объявления цифр
- ✅ **Автозапуск видео на смартфонах после countdown**:
  - **Агрессивная стратегия с 3 попытками**:
    1. Попытка 1 (100ms): play() со звуком
    2. Попытка 2 (200ms): play() с muted
    3. Попытка 3 (300ms): load() + play() с muted (перезагрузка)
  - Автоматическое удаление poster для показа первого кадра
  - preload="auto" для быстрой загрузки первого видео
  - playsInline для корректной работы на iOS
  - forcePlay механизм активируется после завершения countdown
  - Подробное логирование для отладки мобильных браузеров

### Completed Implementation
- ✅ Full Instagram Reels-style UI with dark theme (black-purple gradients, neon accents)
- ✅ Vertical swipe navigation with Framer Motion gestures (drag up/down to switch reels)
- ✅ Video playback management (auto-play active reel, pause inactive)
- ✅ CTA timing system:
  - Final reels (with onCTAClick): CTA appears after 2 seconds, resets on swipe
  - Regular reels: CTA appears after 60% video progress
- ✅ Three main flows working:
  - Sales Flow: 9 reels introducing vertical video marketing
  - Training Flow: 6 educational lessons
  - Final Page: Purchase CTA with testimonials wall (20 video testimonials)
- ✅ Expandable descriptions (click anywhere on text to expand/collapse)
- ✅ Author blocks with avatars, names, Follow buttons
- ✅ Floating action buttons (like, comment, share, menu) with compact spacing
- ✅ Progress strips showing current reel position (n/N)
- ✅ Telegram WebApp integration (haptic feedback, MainButton, deep links)
- ✅ Analytics tracking (console-based, ready for production service integration)
- ✅ **Secure Telegram Authentication System**:
  - HMAC-SHA256 validation of Telegram initData using bot token
  - Middleware protection for all API endpoints
  - Automatic user creation/update on first authentication
  - Authorization header-only validation (prevents request body injection attacks)
  - PostgreSQL database with users table (telegram_id, username, firstName, lastName)
  - Drizzle ORM with DbStorage for persistent data storage
  - Debug endpoint for authentication status checking
- ✅ **Video Interaction Controls**:
  - Hold left/center of screen: pause video (no visual indicator)
  - Hold right edge of screen: 2x speed playback (no visual indicator)
  - Pointer events with smooth animations via Framer Motion
- ✅ **Share Sheet Integration**:
  - Custom bottom sheet for sharing instead of external redirect
  - Telegram chat link and share options
  - Dark themed with gradient icons
- ✅ **Instagram Reels-style Comments System**:
  - Synchronized animations: video scales to 57% and moves down 45px when comments open
  - Video becomes clean vertical rectangle with rounded corners (28px)
  - All UI elements hide during comments view (FloatingActions, captions, CTA buttons)
  - Dark theme (#262626 background) matching Instagram aesthetic
  - Drag-to-close gesture: swipe down to dismiss (offset > 100px or velocity > 500)
  - Simplified header with centered "Comments" text only
  - Modern emoji reactions bar (❤️ 🙌 🔥 👏 😢 😍 😮 😂) using system fonts (Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji)
  - Comment input with emoji picker button
  - Safe area padding for smartphone compatibility (bottom bar indicator)
  - Spring animations (damping: 35, stiffness: 400) for smooth transitions
- ✅ **Mobile Telegram WebApp Optimization**:
  - Progress bar automatically adapts position for mobile Telegram WebApp
  - 52px top padding on mobile devices to avoid overlapping with native Telegram UI (close button, etc.)
  - Desktop and browser versions maintain default positioning

### Key Technical Decisions
- ReelsViewport uses cloneElement to pass isActive and onProgress props to active reel only
- Videos managed via refs - play when isActive=true, pause when false
- CTA state resets on reel deactivation to ensure proper timing on re-entry
- Text descriptions limited width (pr-16) to prevent overlap with floating buttons
- Hook overlays auto-hide after 3 seconds
- All interactive elements have data-testid attributes for testing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety and modern component patterns
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing (sales flow, training flow, final page)

**UI Component System**
- Radix UI primitives for accessible, unstyled components (dialogs, popovers, tooltips, etc.)
- shadcn/ui component library configured with "new-york" style variant
- Tailwind CSS for utility-first styling with custom dark theme configuration
- Framer Motion for smooth animations and gesture-based interactions

**State Management**
- Zustand for global app state (mute toggle, current flow tracking)
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod resolvers for form validation (prepared but not actively used)

**Design System**
- Dark-first theme with purple-pink gradients (Instagram Reels aesthetic)
- Custom Tailwind configuration with safe area insets for notched devices
- Consistent spacing scale (2, 4, 8, 12, 16, 20 units)
- Custom color system with HSL variables for light/dark mode support

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript with ES modules for type safety
- Custom middleware for request logging and error handling
- Development mode includes Vite middleware for HMR

**Authentication & Security**
- Telegram WebApp authentication using HMAC-SHA256 validation
- Bot token stored securely in TELEGRAM_BOT_TOKEN environment variable
- Middleware validates initData from Authorization header only (prevents injection attacks)
- Automatic user creation/update on first authentication
- 24-hour validity window for authentication data
- API endpoints: POST /api/auth/telegram, GET /api/auth/me, GET /api/debug/auth-status

**Data Layer**
- PostgreSQL database with DbStorage implementation using Drizzle ORM
- Neon serverless PostgreSQL for production-ready persistent storage
- Schema definition in shared directory for type sharing between client/server
- Storage interface pattern (IStorage) allows swapping implementations
- Users table: telegramId (primary key), username, firstName, lastName, createdAt
- Database operations: getUserByTelegramId, createUser, updateUser

**Development Tools**
- tsx for running TypeScript server code directly in development
- esbuild for bundling server code in production
- Separate development and production build processes

### External Dependencies

**Telegram Integration**
- @twa-dev/sdk for Telegram WebApp API integration
- Custom useTelegram hook for accessing WebApp features (haptic feedback, main button, user data)
- Deep linking support via URL query parameters (mode=sales/training, reel=id)
- Telegram script loaded via CDN in index.html

**Database**
- Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- Drizzle ORM for schema definition and migrations
- connect-pg-simple for PostgreSQL session store (configured but not actively used)
- DATABASE_URL environment variable required for database connection

**Media & Content**
- Video content served from external CDN (Google Cloud Storage for demos)
- Static images stored in attached_assets directory
- Placeholder services used for demo content

**Development & Tooling**
- Replit-specific plugins for development environment integration
- PostCSS with Tailwind and Autoprefixer for CSS processing
- TypeScript with strict mode enabled and path aliases configured

**Third-Party UI Libraries**
- cmdk for command palette functionality
- date-fns for date manipulation
- class-variance-authority for component variant management
- clsx and tailwind-merge for className utilities

**Analytics**
- Custom analytics module with console logging (prepared for integration with analytics service)
- Event tracking for reel views, CTA interactions, lesson expansions, and purchase clicks