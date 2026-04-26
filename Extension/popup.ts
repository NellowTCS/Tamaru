document.body.innerHTML = `
  <form id="configForm">
    <label>
      Size (px):
      <input type="number" id="size" min="40" max="300" step="1" value="120" />
    </label>
    <label>
      Theme:
      <select id="theme">
        <option value="default">Default</option>
        <option value="aqua">Aqua</option>
        <option value="red">Red</option>
        <option value="glossy">Glossy</option>
        <option value="metal">Metal</option>
        <option value="neon">Neon</option>
        <option value="sunset">Sunset</option>
      </select>
    </label>
    <label>
      Sound:
      <input type="checkbox" id="sound" />
    </label>
    <label>
      Roll Sound Level:
      <input type="range" id="rollSoundLevel" min="0" max="1" step="0.01" value="0.45" />
    </label>
    <label>
      Haptics:
      <input type="checkbox" id="haptics" />
    </label>
    <label>
      Scroll Mode:
      <select id="scrollMode">
        <option value="page">Page</option>
        <option value="nearest">Nearest</option>
        <option value="horizontal">Horizontal</option>
        <option value="momentum">Momentum</option>
      </select>
    </label>
    <label>
      Scroll Fallback:
      <select id="scrollFallback">
        <option value="document">Document</option>
        <option value="none">None</option>
        <option value="container">Container</option>
      </select>
    </label>
    <label>
      Fallback Container Selector:
      <input type="text" id="scrollFallbackContainer" placeholder=".my-scroll-container" />
    </label>
    <label>
      Friction:
      <input type="number" id="friction" min="0.5" max="1" step="0.01" value="0.92" />
    </label>
    <label>
      Sensitivity:
      <input type="number" id="sensitivity" min="0.1" max="5" step="0.01" value="1.8" />
    </label>
    <label>
      Snap Distance:
      <input type="number" id="snapDistance" min="10" max="300" step="1" value="80" />
    </label>
    <label>
      Stick Mode:
      <input type="checkbox" id="stickMode" checked />
    </label>
    <label>
      Stick Mode Target Cycle Key:
      <select id="stickModeTargetCycleKey">
        <option value="Shift">Shift</option>
        <option value="Alt">Alt</option>
        <option value="Control">Control</option>
        <option value="Meta">Meta</option>
        <option value="None">None</option>
      </select>
    </label>
    <label>
      Stick Mode Cycle Snap:
      <input type="checkbox" id="stickModeCycleSnap" checked />
    </label>
    <button type="submit">Save</button>
  </form>
`;

// Load config from storage and populate form
chrome.storage.sync.get("tamaruConfig", ({ tamaruConfig }) => {
  if (!tamaruConfig) return;
  (document.getElementById("size") as HTMLInputElement).value =
    tamaruConfig.size ?? 120;
  (document.getElementById("theme") as HTMLSelectElement).value =
    tamaruConfig.theme ?? "default";
  (document.getElementById("sound") as HTMLInputElement).checked =
    !!tamaruConfig.sound;
  (document.getElementById("rollSoundLevel") as HTMLInputElement).value =
    tamaruConfig.rollSoundLevel ?? 0.45;
  (document.getElementById("haptics") as HTMLInputElement).checked =
    !!tamaruConfig.haptics;
  (document.getElementById("scrollMode") as HTMLSelectElement).value =
    tamaruConfig.scrollMode ?? "page";
  (document.getElementById("scrollFallback") as HTMLSelectElement).value =
    tamaruConfig.scrollFallback ?? "document";
  (
    document.getElementById("scrollFallbackContainer") as HTMLInputElement
  ).value = tamaruConfig.scrollFallbackContainer ?? "";
  (document.getElementById("friction") as HTMLInputElement).value =
    tamaruConfig.friction ?? 0.92;
  (document.getElementById("sensitivity") as HTMLInputElement).value =
    tamaruConfig.sensitivity ?? 1.8;
  (document.getElementById("snapDistance") as HTMLInputElement).value =
    tamaruConfig.snapDistance ?? 80;
  (document.getElementById("stickMode") as HTMLInputElement).checked =
    !!tamaruConfig.stickMode;
  (
    document.getElementById("stickModeTargetCycleKey") as HTMLSelectElement
  ).value = tamaruConfig.stickModeTargetCycleKey ?? "Shift";
  (document.getElementById("stickModeCycleSnap") as HTMLInputElement).checked =
    !!tamaruConfig.stickModeCycleSnap;
});

document.getElementById("configForm")!.onsubmit = (e) => {
  e.preventDefault();
  const config = {
    size: Number((document.getElementById("size") as HTMLInputElement).value),
    theme: (document.getElementById("theme") as HTMLSelectElement).value,
    sound: (document.getElementById("sound") as HTMLInputElement).checked,
    rollSoundLevel: Number(
      (document.getElementById("rollSoundLevel") as HTMLInputElement).value,
    ),
    haptics: (document.getElementById("haptics") as HTMLInputElement).checked,
    scrollMode: (document.getElementById("scrollMode") as HTMLSelectElement)
      .value,
    scrollFallback: (
      document.getElementById("scrollFallback") as HTMLSelectElement
    ).value,
    scrollFallbackContainer: (
      document.getElementById("scrollFallbackContainer") as HTMLInputElement
    ).value,
    friction: Number(
      (document.getElementById("friction") as HTMLInputElement).value,
    ),
    sensitivity: Number(
      (document.getElementById("sensitivity") as HTMLInputElement).value,
    ),
    snapDistance: Number(
      (document.getElementById("snapDistance") as HTMLInputElement).value,
    ),
    stickMode: (document.getElementById("stickMode") as HTMLInputElement)
      .checked,
    stickModeTargetCycleKey: (
      document.getElementById("stickModeTargetCycleKey") as HTMLSelectElement
    ).value,
    stickModeCycleSnap: (
      document.getElementById("stickModeCycleSnap") as HTMLInputElement
    ).checked,
  };
  chrome.storage.sync.set({ tamaruConfig: config });
  alert("Tamaru config saved!");
};
