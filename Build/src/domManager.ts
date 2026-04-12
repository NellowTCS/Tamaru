export function createWidgetContainer(): HTMLDivElement {
  const container = document.createElement("div");
  container.id = "vt-widget-container";
  container.innerHTML = `
    <div id="vt-controls">
      <div id="vt-drag-handle" class="vt-btn" title="Drag to move">✥</div>
      <div id="vt-toggle-btn" class="vt-btn" title="Toggle Size">-</div>
    </div>
    <div id="vt-trackball-area">
      <div id="vt-sphere">
        <div id="vt-texture"></div>
        <div id="vt-shading"></div>
      </div>
      <div id="vt-viewport"></div>
      <div id="vt-mini-icon"></div>
    </div>
  `;
  return container;
}

export function injectStyleTag(styles: string): void {
  if (!document.getElementById("vt-styles")) {
    const style = document.createElement("style");
    style.id = "vt-styles";
    style.textContent = styles;
    document.head.appendChild(style);
  }

  if (!document.getElementById("vt-scrollbar-hide")) {
    const hideStyle = document.createElement("style");
    hideStyle.id = "vt-scrollbar-hide";
    hideStyle.textContent = `
      [data-vt-hide-scrollbar="1"] {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      [data-vt-hide-scrollbar="1"]::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none !important;
        background: transparent;
      }
    `;
    document.head.appendChild(hideStyle);
  }
}
