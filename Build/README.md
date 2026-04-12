# Tamaru

A modular, self-contained JavaScript/TypeScript widget for adding a draggable, interactive trackball overlay to any web page or app. Includes built-in CSS and only 2 external dependencies (one of which is made by me, [@nisoku/satori](https://github.com/Nisoku/Satori)!).

> Tamaru (たまる) is a Japanese verb meaning “to accumulate,”
> which mirrors how the trackball builds momentum as you flick it.

## Features

- Draggable floating widget
- Trackball area for scrolling (with inertia)
- "Stick Mode" (Pointer Lock) for absolute scrolling via mouse movement. Hold `Shift` while in stick mode to cycle targets.
- Minimize/restore toggle
- Snap-to-edge logic
- Theming system with multiple built-in color schemes (`default`, `aqua`, `red`, `glossy`, `metal`, `neon`, `sunset`)
- Configurable sound and haptics feedback with naturalized mechanical variation
- Support for different scroll modes (`page`, `nearest`, `horizontal`, `momentum`)
- Configurable behaviors (friction, sensitivity, snap distance, roll sound level)
- All styles injected automatically
- Modular TypeScript codebase

## Installation

Install via npm, pnpm, or yarn (for library usage):

```bash
npm install tamaru
```

## Usage

### As a module (ESM/TypeScript)

```js
import { initVirtualTrackball, updateVirtualTrackballConfig } from 'tamaru';

initVirtualTrackball({
  theme: 'neon',
  sound: true,
  rollSoundLevel: 0.85,
  haptics: true,
  scrollMode: 'page',
  size: 120,
  friction: 0.92,
  sensitivity: 1.8
});

// Update later:
updateVirtualTrackballConfig({
  theme: 'metal',
  rollSoundLevel: 0.65
});
```

`rollSoundLevel` accepts values from `0` to `1` and controls the continuous rolling bed intensity.

### In the browser (ESM build)

```html
<!-- ESM -->
<script type="module">
  import { initVirtualTrackball } from 'https://cdn.jsdelivr.net/npm/tamaru';
  initVirtualTrackball();
</script>
```

### Bookmarklet (Use on any site)

Want to use Tamaru on any website you visit? Just create a new bookmark in your browser, and set the URL to this snippet:

```javascript
javascript:(function(){if(window.Tamaru){Tamaru.initVirtualTrackball();return}var s=document.createElement('script');s.src='https://unpkg.com/tamaru@latest/dist/main.global.js';s.onload=function(){Tamaru.initVirtualTrackball()};document.head.appendChild(s);})();
```

Once saved, just click the bookmark to spawn the interactive trackball on whatever page you are reading!

## Docs

Tiny, but comphrehensive docs have been created (using DocMD, [shoutout](https://docmd.io/)) for your perusing pleasure.

Find them at <https://nellowtcs.me/Tamaru/docs>!

## Demo

A live demo is available in the `Demo/` directory. To try it locally:

1. Build the project: `cd Build && npm install && npm run build`
2. Open `Demo/index.html` in your browser

The demo page disables native page scrolling and uses a scrollable content area. The trackball widget can be used to scroll this area.

Find the demo online at <https://nellowtcs.me/Tamaru>!

## License

[MIT](LICENSE)
