# Design Guidelines: Telegram WebApp - Instagram Reels Style Sales Funnel

## Design Approach
**Reference-Based Approach**: Instagram Reels aesthetic with dark theme optimizations for Telegram WebApp context.

## Core Design Principles
- **Vertical-First Experience**: 9:16 fullscreen viewport optimized for mobile
- **Dark Reels Aesthetic**: Black-purple gradient backgrounds with neon accents
- **Smooth Transitions**: Framer Motion-powered animations for premium feel
- **Minimal Distraction**: Content-focused with strategic UI element placement

## Color Palette

### Dark Mode (Primary)
- **Background Base**: Pure black (#000000) to deep purple gradient (0 0% 0% to 270 25% 10%)
- **Neon Accents**: Electric purple (270 80% 60%), cyan highlights (180 80% 50%)
- **Text**: White (0 0% 100%) for primary, gray (0 0% 70%) for secondary
- **CTA Primary**: Gradient purple-pink (280 90% 65% to 320 85% 60%)
- **Progress Strips**: White/purple blend with opacity variants

## Typography
- **Font Stack**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)
- **Hero/Hook Text**: Bold 32-40px (text-3xl/4xl font-bold)
- **Lesson Titles**: Semibold 20-24px (text-xl/2xl font-semibold)
- **Body/Captions**: Regular 14-16px (text-sm/base)
- **CTAs**: Medium 16-18px (text-base/lg font-medium)

## Layout System
**Tailwind Spacing Units**: Consistently use 2, 4, 8, 12, 16, 20 units
- Tight spacing: `p-2`, `gap-2`
- Medium spacing: `p-4`, `m-4`, `gap-4`
- Section spacing: `p-8`, `py-12`
- Large gaps: `gap-16`, `py-20`

## Component Library

### Reels Viewport
- **Container**: `h-screen w-full bg-black relative overflow-hidden`
- **Snap Behavior**: Vertical scroll snap, one reel per viewport
- **Gesture**: Framer Motion drag="y" with spring animations

### Progress Indicators (Top)
- **Position**: `absolute top-safe left-0 right-0 z-50 px-4 pt-2`
- **Strips**: Horizontal thin bars with rounded ends, white/purple with opacity
- **Counter**: Small text "n/N" right-aligned, white with 70% opacity

### Hook Overlays (0-3 sec)
- **Display**: Large centered text, bold weight, fade-in animation
- **Background**: Semi-transparent dark gradient for readability
- **Typography**: `text-4xl font-bold text-white text-center leading-tight`

### Action Bar (Right Side)
- **Position**: `absolute right-4 bottom-32 z-40 flex flex-col gap-6`
- **Icons**: Circular buttons, white icons on dark semi-transparent background
- **Actions**: Like (heart), Share, Mute/Unmute
- **Size**: 48px circles with 24px icons

### CTA Buttons
- **Appearance Trigger**: After 60% video watch time
- **Animation**: Fade + scale from bottom with haptic feedback
- **Style**: Gradient background (purple-pink), white text, rounded-full, px-8 py-4
- **Position**: `absolute bottom-safe left-4 right-4 z-40`

### Lesson Caption (Training Mode)
- **Position**: Bottom overlay, expandable accordion
- **Collapsed**: 2-3 lines with "...more" button
- **Expanded**: Full description with "hide" option
- **Background**: Dark gradient overlay (black to transparent)
- **Text**: White text-sm with leading-relaxed

### Training Final Screen
- **Header**: Large heading "Next Step" centered, text-3xl font-bold
- **Primary CTA**: Huge button "Buy Main Product", full-width, gradient bg
- **Testimonials Wall**: Grid layout below CTA
  - Desktop: `grid-cols-3 gap-4`
  - Tablet: `grid-cols-2 gap-3`
  - Mobile: `grid-cols-1 gap-2`

### Testimonial Cards
- **Thumbnail**: Video poster with play icon overlay
- **Author**: Name + role in bottom overlay
- **Highlight Quote**: 1-line text with quotes, italic
- **Modal Player**: Fullscreen video on tap with close button

## Animations & Interactions
- **Swipe Transitions**: Spring physics (stiffness: 300, damping: 30)
- **CTA Appearance**: Fade + scale from 0.9 to 1.0, duration 300ms
- **Hook Display**: Fade in over 200ms, hold 3 seconds, fade out
- **Caption Expand**: Height animation, duration 250ms ease-out
- **Haptics**: Light vibration on swipe, medium on CTA tap (Telegram SDK)

## Accessibility
- **ARIA Labels**: All interactive elements labeled
- **Keyboard Nav**: Arrow keys ↑/↓ for reel switching
- **Contrast**: White text on dark bg ensures WCAG AA compliance
- **Focus States**: Visible purple outline (ring-2 ring-purple-500)

## Video Integration
- **Aspect Ratio**: 9:16 vertical, `object-cover` fill mode
- **Autoplay**: Muted by default, active reel plays automatically
- **Pause**: Inactive reels pause to save resources
- **Controls**: Custom overlay controls, no native UI

## Images
**No traditional hero images** - this is a video-first experience. Each reel IS the hero content.
- **Video Posters**: Thumbnail images for loading states
- **Testimonial Thumbnails**: Author headshots or video frames (1:1 ratio)
- **Placeholder Videos**: Use `/videos/*.mp4` paths with mock content

## Navigation Flow
1. **Sales Flow** (`/`): 8-10 reels → Final CTA leads to Training
2. **Training Flow** (`/training`): 6 lesson reels with expandable captions
3. **Training Final** (`/training/final`): CTA + Testimonials Wall (ONLY shown here)

## Platform Integration
- **Telegram MainButton**: Synced with primary CTAs, native styling
- **Deep Links**: Support `?mode=sales|training&reel={id}`
- **Safe Areas**: Use `top-safe`, `bottom-safe` for notched devices
- **WebApp SDK**: `WebApp.ready()`, `expand()`, `HapticFeedback`

## Content Density
- **Focused**: One message per reel, no clutter
- **Progressive Disclosure**: Hooks → video → CTA → next reel
- **Strategic Spacing**: Ample breathing room around text/buttons
- **Visual Hierarchy**: Size, color, position create clear flow