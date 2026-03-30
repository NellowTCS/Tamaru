"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  initVirtualTrackball: () => initVirtualTrackball
});
module.exports = __toCommonJS(main_exports);

// styles/styles.css
var styles_default = `#vt-widget-container {
    position: fixed;
    z-index: 999999;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    transition: left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), width 0.3s ease, height 0.3s ease;
}

#vt-widget-container.is-dragging {
    transition: width 0.3s ease, height 0.3s ease !important;
}

#vt-controls {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0px) scale(0.8);
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
    z-index: 20;
}

#vt-widget-container:hover #vt-controls,
#vt-widget-container.vt-mini #vt-controls {
    opacity: 1;
    transform: translate(-50%, -36px) scale(1);
    pointer-events: auto;
}

.vt-btn {
    width: 30px;
    height: 30px;
    background: #1e293b;
    color: #fff;
    border: 1px solid #475569;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

#vt-drag-handle {
    cursor: grab;
}

#vt-drag-handle:active {
    cursor: grabbing;
}

#vt-trackball-area {
    position: relative;
    width: 120px;
    height: 120px;
    background: #1a1a1a;
    border-radius: 50%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), inset 0 2px 5px rgba(255, 255, 255, 0.1), inset 0 -2px 5px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

#vt-viewport {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    z-index: 10;
    cursor: grab;
    touch-action: none;
}

#vt-viewport:active {
    cursor: grabbing;
}

#vt-sphere {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #0b3d6e;
}

#vt-texture {
    position: absolute;
    top: -50px;
    left: -50px;
    right: -50px;
    bottom: -50px;
    background-color: #1e5ba3;
    /* I know inline SVG bad but i want to bundle everything in one file 
    and this is the only way to do it without adding extra files 
    or like vite shenanigans */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E");
    background-size: 150px 150px;
    background-position: 0px 0px;
    transition: background-position 0.1s linear;
}

#vt-shading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle at 30px 30px, rgba(255, 255, 255, 0.5) 0%, transparent 50%, rgba(0, 0, 0, 0.8) 100%);
    box-shadow: inset -10px -10px 20px rgba(0, 0, 0, 0.9), inset 0 0 10px rgba(0, 0, 0, 0.5), inset 5px 5px 10px rgba(255, 255, 255, 0.2);
}

#vt-widget-container.vt-mini {
    width: 48px;
    height: 48px;
}

#vt-widget-container.vt-mini #vt-trackball-area {
    width: 48px;
    height: 48px;
    cursor: pointer;
}

#vt-widget-container.vt-mini #vt-sphere,
#vt-widget-container.vt-mini #vt-viewport {
    display: none;
}

#vt-mini-icon {
    display: none;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle at 30% 30%, #5cabff, #0b3d6e);
    border-radius: 50%;
    box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.5);
}

#vt-widget-container.vt-mini #vt-mini-icon {
    display: block;
}`;

// src/main.ts
function initVirtualTrackball() {
  if (document.getElementById("vt-widget-container")) return;
  if (!document.getElementById("vt-styles")) {
    const style = document.createElement("style");
    style.id = "vt-styles";
    style.textContent = styles_default;
    document.head.appendChild(style);
  }
  const container = document.createElement("div");
  container.id = "vt-widget-container";
  container.innerHTML = `
        <div id="vt-controls">
            <div id="vt-drag-handle" class="vt-btn" title="Drag to move">\u2725</div>
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
  document.body.appendChild(container);
  let currentLeft = window.innerWidth - 120 - 24;
  let currentTop = window.innerHeight - 120 - 24;
  container.style.left = currentLeft + "px";
  container.style.top = currentTop + "px";
  const dragHandle = document.getElementById("vt-drag-handle");
  let isWidgetDragging = false;
  let startMouseX = 0, startMouseY = 0;
  let startLeft = 0, startTop = 0;
  dragHandle.addEventListener("pointerdown", (e) => {
    isWidgetDragging = true;
    container.classList.add("is-dragging");
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startLeft = currentLeft;
    startTop = currentTop;
    dragHandle.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });
  dragHandle.addEventListener("pointermove", (e) => {
    if (!isWidgetDragging) return;
    currentLeft = startLeft + (e.clientX - startMouseX);
    currentTop = startTop + (e.clientY - startMouseY);
    container.style.left = currentLeft + "px";
    container.style.top = currentTop + "px";
  });
  function snapToEdge() {
    const margin = 24;
    const snapDist = 80;
    const rect = container.getBoundingClientRect();
    const maxLeft = window.innerWidth - rect.width - margin;
    const maxTop = window.innerHeight - rect.height - margin;
    if (currentLeft < snapDist) currentLeft = margin;
    if (currentLeft > maxLeft - snapDist + margin) currentLeft = maxLeft;
    if (currentTop < snapDist) currentTop = margin;
    if (currentTop > maxTop - snapDist + margin) currentTop = maxTop;
    currentLeft = Math.max(margin, Math.min(currentLeft, maxLeft));
    currentTop = Math.max(margin, Math.min(currentTop, maxTop));
    container.style.left = currentLeft + "px";
    container.style.top = currentTop + "px";
  }
  dragHandle.addEventListener("pointerup", (e) => {
    isWidgetDragging = false;
    container.classList.remove("is-dragging");
    dragHandle.releasePointerCapture(e.pointerId);
    snapToEdge();
  });
  window.addEventListener("resize", snapToEdge);
  const toggleBtn = document.getElementById("vt-toggle-btn");
  const trackballArea = document.getElementById("vt-trackball-area");
  toggleBtn.addEventListener("click", () => {
    container.classList.toggle("vt-mini");
    toggleBtn.textContent = container.classList.contains("vt-mini") ? "+" : "\u2212";
    snapToEdge();
  });
  trackballArea.addEventListener("click", () => {
    if (container.classList.contains("vt-mini")) {
      container.classList.remove("vt-mini");
      toggleBtn.textContent = "\u2212";
      snapToEdge();
    }
  });
  const viewport = document.getElementById("vt-viewport");
  const texture = document.getElementById("vt-texture");
  let texPosX = 0, texPosY = 0;
  let isTrackballDragging = false;
  let tbPrevMouseX = 0, tbPrevMouseY = 0;
  let velX = 0, velY = 0;
  const friction = 0.92;
  function applyMovement(dx, dy) {
    const scrollSensitivity = 1.8;
    window.scrollBy(-dx * scrollSensitivity, -dy * scrollSensitivity);
    texPosX += dx * 1.5;
    texPosY += dy * 1.5;
    texture.style.backgroundPosition = `${Math.round(texPosX)}px ${Math.round(texPosY)}px`;
  }
  viewport.addEventListener("pointerdown", (e) => {
    isTrackballDragging = true;
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    velX = 0;
    velY = 0;
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!isTrackballDragging) return;
    const dx = e.clientX - tbPrevMouseX;
    const dy = e.clientY - tbPrevMouseY;
    velX = dx;
    velY = dy;
    applyMovement(dx, dy);
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
  });
  viewport.addEventListener("pointerup", (e) => {
    isTrackballDragging = false;
    viewport.releasePointerCapture(e.pointerId);
  });
  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    velX += -e.deltaX * 0.2;
    velY += -e.deltaY * 0.2;
    velX = Math.max(-60, Math.min(60, velX));
    velY = Math.max(-60, Math.min(60, velY));
  }, { passive: false });
  function physicsLoop() {
    if (!isTrackballDragging) {
      velX *= friction;
      velY *= friction;
      if (Math.abs(velX) < 0.1) velX = 0;
      if (Math.abs(velY) < 0.1) velY = 0;
      if (velX !== 0 || velY !== 0) applyMovement(velX, velY);
    }
    requestAnimationFrame(physicsLoop);
  }
  requestAnimationFrame(physicsLoop);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  initVirtualTrackball
});
//# sourceMappingURL=main.js.map