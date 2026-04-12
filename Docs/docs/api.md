---
title: "API Reference"
---

# API Reference

The Tamaru library exposes a clean interface. Mount it, tweak it, tear it down.

## `initVirtualTrackball`

Mounts the virtual trackball and starts the physics loop. Call this *after* the DOM is ready.

```typescript
import { initVirtualTrackball } from "tamaru";

initVirtualTrackball({
  size: 150,
  theme: "default"
});
```

Calling this multiple times is a no-op. To change parameters on the fly, use `updateVirtualTrackballConfig`.

## `updateVirtualTrackballConfig`

Applies configuration changes safely without interrupting the physics loop.

```typescript
function updateVirtualTrackballConfig(newConfig: Partial<TamaruConfig>): void;
```

This merges the supplied configuration with the active state. Changes like `theme` or `size` trigger immediate visual reflows.

## `destroyVirtualTrackball`

Stops the physics sequence, removes internal event listeners, and purges the DOM nodes. A completely clean exit.

```typescript
destroyVirtualTrackball();
```

## `pauseVirtualTrackball` & `resumeVirtualTrackball`

Temporarily disable or re-enable the widget input handling and physics loop. You don't need to tear down the DOM nodes to pause interactions.

```typescript
export function pauseVirtualTrackball(): void;
export function resumeVirtualTrackball(): void;
```

## `hideVirtualTrackball` & `showVirtualTrackball`

Toggles the widget `display` property. Useful for suppressing the widget during certain application states without losing kinetic state.

```typescript
export function hideVirtualTrackball(): void;
export function showVirtualTrackball(): void;
```
