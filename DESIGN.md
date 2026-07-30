# Design System

## Theme
* **Dark Mode Default**: Warm slate charcoal dark theme (`#080b09`) acting as the global environment.
* **Accent Colors**: Sunset Orange (`#F58220` to `#FF9E42`) for primary calls-to-action and headers, and Forest Green (`#2F5D50`) for badges and active states.

## Color Palette
* `primary`: `#F58220` (Sunset Orange)
* `secondary`: `#2F5D50` (Forest Green)
* `background`: `#080b09` (Cinematic Slate)
* `text`: `#ffffff` (Primary text on dark backgrounds)
* `text-muted`: `rgba(255, 255, 255, 0.7)`

## Typography
* **Headings**: `Poppins`, sans-serif (bold, geometric, uppercase uppercase visual weight).
* **Editorial headings**: `Playfair Display`, serif (sophisticated, traditional serif for founder details).
* **Body Font**: `Inter`, sans-serif (neutral geometric modern sans-serif).

## Spacing & Layout
* **Grid**: 8px layout baseline.
* **Layout Max Width**: `1280px` (`--container-max-width`).
* **Border Radii**:
  * `radius-default`: `8px`
  * `radius-md`: `12px`
  * `radius-lg`: `16px`
  * `radius-xl`: `24px`
  * `radius-2xl`: `32px`
  * `radius-full`: `9999px`

## Key Components
1. **Floating Navigation Header**:
   * Translucent dark glassmorphism pill (`rgba(15, 23, 18, 0.45)`).
   * Transitions to a slightly more opaque glass (`rgba(15, 23, 18, 0.7)`) on scroll.
   * `backdrop-filter: blur(10px–12px)` and a subtle `rgba(255, 255, 255, 0.1)` border.
2. **Interactive 3D Carousel**:
   * Cylindrical projection layout (`gallery.js`).
   * Pure floating photo cards without outline borders or text overlays.
   * Mouse scroll wheel acceleration and physics-damped auto-rotation.
3. **Featured Tours Showcase**:
   * Horizontal slider with crossfading background images.
   * Hardware-accelerated transitions and expand-to-background visual effects.
