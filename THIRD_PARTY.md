# Third-party software

## WebGL Fluid Simulation

- Author: Pavel Dobryakov
- Source: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- Pinned revision: `a2d292931f19d9b3b9f564e23e6c32729d2121c3`
- License: MIT; the full license is included in `dist/vendor/fluid.LICENSE.txt` and the source header.
- Local file: `dist/vendor/fluid.js`

GX404 adaptations remove the demo controls, promotional links, analytics, screenshot tools, automatic initial splashes and upstream input handlers. The engine exposes a small pointer and pause API, uses procedural dithering without an external image, caps pixel density, stops after idle periods, and pauses when the page is hidden. Page-level code adds accessible controls, pointer input, reduced-motion handling and graceful failure when WebGL is unavailable.

The page layout is independently implemented with io724.com as the user-provided visual reference. No third-party branding, registration numbers or proprietary site assets are included.

