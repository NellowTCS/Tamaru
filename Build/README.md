# Tamaru

A modular, self-contained JavaScript/TypeScript widget for adding a draggable, interactive trackball overlay to any web page or app. Includes built-in CSS and no external dependencies.

## Features

- Draggable floating widget
- Trackball area for scrolling (with inertia)
- Minimize/restore toggle
- Snap-to-edge logic
- All styles injected automatically
- Modular TypeScript codebase

## Installation

Install via npm (library usage):

```bash
npm install tamaru
```

## Usage

### As a module (ESM/TypeScript)

```js
import { initVirtualTrackball } from 'tamaru';
initVirtualTrackball();
```

### In the browser (UMD or ESM build)

```html
<!-- ESM -->
<script type="module">
  import { initVirtualTrackball } from 'tamaru';
  initVirtualTrackball();
</script>
```

## Demo

A live demo is available in the `Demo/` directory. To try it locally:

1. Build the project: `cd Build && npm install && npm run build`
2. Open `Demo/index.html` in your browser

The demo page disables native page scrolling and uses a scrollable content area. The trackball widget can be used to scroll this area.

Find the demo online at <https://nellowtcs.me/Tamaru>!

## License

MIT
