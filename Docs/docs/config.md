---
title: "Configuration"
---

# Configuration

The Tamaru widget behaviour is driven entirely by a configuration object. Pass it to `initVirtualTrackball` or `updateVirtualTrackballConfig`.

## `TamaruConfig` Interface

### Theming and Visuals

`theme`  
Type: `string`  
Default: `"default"`  
The built-in texture applied to the virtual **sphere**. 
Options: `"default"`, `"glossy"`, `"metal"`, `"aqua"`, and `"red"`.

`customTheme`  
Type: `Record<string, string>`  
Default: `{}`  
An object containing a set of CSS properties that override the active `theme` selection.

```typescript
initVirtualTrackball({
  theme: "default",
  customTheme: {
    "ball-main": "#ff00ff",
    "ball-shadow": "rgba(0,0,0,0.5)"
  }
});
```

`size`  
Type: `number`  
Default: `120`  
Fixed square dimensions of the injected container in pixels.

### Stick Mode

`stickMode`  
Type: `boolean`  
Default: `true`  
Enables "Stick Mode" (Pointer Lock) via the crosshair button. When active, mouse movement directly scrolls the active target.

`stickModeTargetCycleKey`  
Type: `"Shift" | "Alt" | "Control" | "Meta" | "None"`  
Default: `"Shift"`  
The modifier key that, when held in Stick Mode, allows the scroll wheel to cycle through scrollable elements on the page instead of scrolling them.

`stickModeCycleSnap`  
Type: `boolean`  
Default: `true`  
Whether the window should automatically perform a smooth scroll into targeting view (`scrollIntoView`) on the newly selected container when cycling targets.

### Physics and Interaction

`scrollMode`  
Type: `"document" | "nearest" | "container"`  
Default: `"document"`  
Where scroll injection events execute.  
- `"document"`: Locks on the window.  
- `"nearest"`: Finds the closest scrollable ancestor.  
- `"container"`: Locks into a targeted DOM element.

`friction`  
Type: `number`  
Default: `0.92`  
A decimal scalar from `0.0` (immediate stop) to `1.0` (zero loss) that multiplies the speed over each frame. Set it closer to `0.98` for long, gliding throws.

`sensitivity`  
Type: `number`  
Default: `1.8`  
Multiplier to align physical pointer deltas to standard scrolling units. Increase for rapid scanning, decrease for precision.

`snapDistance`  
Type: `number`  
Default: `80`  
Pixels from the edge of the viewport. When dragging ends within this distance, the widget slides flush to the nearest screen edge.

### Audio and Haptics

`enableSound`  
Type: `boolean`  
Default: `true`  
Allow playback of Web Audio nodes simulating ball bearings and inertia rumbles.

`rollSoundLevel`  
Type: `number`  
Default: `1.0`  
Multiplier for background rolling noise. Value from `0.0` to `2.0`.

`enableHaptics`  
Type: `boolean`  
Default: `true`  
Triggers low-latency vibration patterns on `pointerdown` and edge collision using tactile bindings.

### Advanced Targets

`scrollFallbackContainer`  
Type: `string`
Default: `undefined`  
The explicit DOM selector when `scrollMode` is `"container"`. For example, `"#main-layout"`.

`scrollFallback`  
Type: `"document" | "none"`  
Default: `"document"`  
If `"nearest"` mode fails to identify an overflowing ancestor, Tamaru resolves to `"document"` or aborts if set to `"none"`.
