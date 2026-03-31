export function setControlsVisible(controls: HTMLElement, visible: boolean) {
  if (visible) {
    controls.classList.add("vt-controls-visible");
  } else {
    controls.classList.remove("vt-controls-visible");
  }
}

export function showControls(
  controls: HTMLElement,
  controlsHideTimeout: ReturnType<typeof setTimeout> | null,
  setControlsVisible: (controls: HTMLElement, visible: boolean) => void,
): ReturnType<typeof setTimeout> | null {
  if (controlsHideTimeout) {
    clearTimeout(controlsHideTimeout);
    controlsHideTimeout = null;
  }
  setControlsVisible(controls, true);
  return controlsHideTimeout;
}

export function hideControlsWithDelay(
  container: HTMLElement,
  controls: HTMLElement,
  controlsHideTimeout: ReturnType<typeof setTimeout> | null,
  setControlsVisible: (controls: HTMLElement, visible: boolean) => void,
): ReturnType<typeof setTimeout> {
  if (controlsHideTimeout) clearTimeout(controlsHideTimeout);
  return setTimeout(() => {
    if (!container.matches(":hover") && !controls.matches(":hover")) {
      setControlsVisible(controls, false);
    }
  }, 350);
}
