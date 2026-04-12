---
title: "Tamaru"
description: "Skeuomorphic, momentum-based virtual trackball widget for the web"
---

**Tamaru** is a physics-driven virtual trackball widget. It gives you tactile, momentum-based scrolling and panning across any web content with no hand-written scroll tracking required.

::: callout tip
Tamaru brings a physical trackball to the screen. The idea: users grab and flick a 3D sphere that translates directly into document or container scrolls, and the whole physics calculation is handled for you.
:::

## What it solves

You're building something that needs a lot of scrolling. Normally that'd be a pain point and bad UI/UX.

Tamaru says: *why suffer?* It's a single drop-in ES module that does all the heavy lifting while being genuinely fun to use. Hand it a config object, and magic! You've got a playful skeuomorphic trackball that users will want to flick around. Actual physics, actual delight, zero pain. It's the kind of unnecessary-yet-essential feature that makes people go "wait, let me try that again" instead of "oh, I'm scrolling now."

## Features

::: card Momentum Physics
Built-in kinetic scrolling. Flicking the trackball calculates realistic drag and eases the DOM scroll position until it settles to a halt. No more jerky custom scroll code.
:::

::: card Flexible Routing
Automatically route scroll events to the nearest scrollable container, fallback to the main document, or explicitly target a DOM element.
:::

::: card Stick Mode (Pointer Lock)
Enter "Stick Mode" to capture the mouse and use physical mouse movement to scroll directly. Hold `Shift` while locked to visually cycle through and target different scrollable elements on the page.
:::

::: card Skinnable Themes
Swap out visual variables and base textures at runtime. It ships with built-in gradients ranging from glossy metal to flat matte.
:::

::: card Haptics & Audio
Trigger precise Web Audio and Web Haptic vibrations as the trackball rolls or crashes into screen edges. It creates a tactile illusion of mass. The audio is fully made with code, not a single audio file for the ultimate overengineered yet lean goodness.
:::

## Quick Example

**Initialize the widget:**

```typescript
import { initVirtualTrackball, updateVirtualTrackballConfig } from "tamaru";

// Start Tamaru with the default configuration
initVirtualTrackball({
  theme: "neon",
  scrollMode: "document",
  sensitivity: 2.0,
  friction: 0.95
});

// Update it on the fly
updateVirtualTrackballConfig({ size: 150 });
```

That's it. No DOM mounting, no event loops, no math. (I emphasise this because I want you all to appreciate the math *I* had to do)

## Installation

::: tabs
== tab "npm"

```bash
npm install tamaru
```

== tab "pnpm"

```bash
pnpm install tamaru
```

== tab "yarn"

```bash
yarn add tamaru
```

:::

## Bookmarklet

Want to use Tamaru on any website you visit? Just create a new bookmark in your browser, and set the URL to this snippet:

```javascript
javascript:(function(){if(window.Tamaru){Tamaru.initVirtualTrackball();return}var s=document.createElement('script');s.src='https://unpkg.com/tamaru@latest/dist/main.global.js';s.onload=function(){Tamaru.initVirtualTrackball()};document.head.appendChild(s);})();
```

Once saved, just click the bookmark to spawn the interactive trackball on whatever page you are reading!

## Next Steps

- [Configuration](./config): Understand themes and settings
- [API Reference](./api): Lifecycle functions and state management
