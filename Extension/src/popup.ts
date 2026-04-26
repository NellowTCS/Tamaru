import type { TamaruConfig } from "./types";
import { DEFAULT_CONFIG, STORAGE_KEY } from "./types";

const getElement = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;

const getConfig = async (): Promise<TamaruConfig | undefined> => {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  return result[STORAGE_KEY] as TamaruConfig | undefined;
};

const setConfig = (config: TamaruConfig) =>
  chrome.storage.sync.set({ [STORAGE_KEY]: config });

const getValue = (el: HTMLInputElement | HTMLSelectElement) =>
  el instanceof HTMLInputElement && el.type === "checkbox"
    ? el.checked
    : el.value;

const setValue = (
  el: HTMLInputElement | HTMLSelectElement,
  value: string | number | boolean,
) => {
  if (el instanceof HTMLInputElement && el.type === "checkbox") {
    el.checked = Boolean(value);
  } else {
    el.value = String(value);
  }
};

const applyConfig = (config: TamaruConfig) => {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const ids = [
    "size",
    "theme",
    "sound",
    "rollSoundLevel",
    "haptics",
    "scrollMode",
    "scrollFallback",
    "scrollFallbackContainer",
    "friction",
    "sensitivity",
    "snapDistance",
    "stickMode",
    "stickModeTargetCycleKey",
    "stickModeCycleSnap",
  ] as const;

  for (const id of ids) {
    const el = getElement<HTMLInputElement | HTMLSelectElement>(id);
    setValue(el, cfg[id]);
  }

  updateValueDisplays();
  updateContainerFieldVisibility();
};

const collectConfig = (): TamaruConfig => ({
  size: Number(getElement<HTMLInputElement>("size").value),
  theme: getElement<HTMLSelectElement>("theme").value,
  sound: getElement<HTMLInputElement>("sound").checked,
  rollSoundLevel: Number(getElement<HTMLInputElement>("rollSoundLevel").value),
  haptics: getElement<HTMLInputElement>("haptics").checked,
  scrollMode: getElement<HTMLSelectElement>("scrollMode").value,
  scrollFallback: getElement<HTMLSelectElement>("scrollFallback").value,
  scrollFallbackContainer: getElement<HTMLInputElement>("scrollFallbackContainer").value,
  friction: Number(getElement<HTMLInputElement>("friction").value),
  sensitivity: Number(getElement<HTMLInputElement>("sensitivity").value),
  snapDistance: Number(getElement<HTMLInputElement>("snapDistance").value),
  stickMode: getElement<HTMLInputElement>("stickMode").checked,
  stickModeTargetCycleKey: getElement<HTMLSelectElement>("stickModeTargetCycleKey").value,
  stickModeCycleSnap: getElement<HTMLInputElement>("stickModeCycleSnap").checked,
});

const updateValueDisplays = () => {
  const displays = document.querySelectorAll<HTMLSpanElement>(".value-display");
  displays.forEach((display) => {
    const inputId = display.dataset.for;
    if (!inputId) return;
    const input = getElement<HTMLInputElement>(inputId);
    display.textContent = input.value;
  });
};

const updateContainerFieldVisibility = () => {
  const containerField = getElement<HTMLDivElement>("containerField");
  const scrollFallback = getElement<HTMLSelectElement>("scrollFallback").value;
  containerField.classList.toggle("visible", scrollFallback === "container");
};

const setupEventListeners = () => {
  const rangeInputs = document.querySelectorAll<HTMLInputElement>('input[type="range"]');
  rangeInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const display = document.querySelector(`.value-display[data-for="${input.id}"]`);
      if (display) display.textContent = input.value;
    });
  });

  getElement<HTMLSelectElement>("scrollFallback").addEventListener("change", updateContainerFieldVisibility);

  getElement<HTMLFormElement>("configForm").addEventListener("submit", (e) => {
    e.preventDefault();
    setConfig(collectConfig());
    alert("Settings saved!");
  });
};

const init = async () => {
  const config = await getConfig();
  if (config) applyConfig(config);
  setupEventListeners();
};

init();