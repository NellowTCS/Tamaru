import styles from '../styles/styles.css';

export function initVirtualTrackball(): void {
    if (document.getElementById('vt-widget-container')) return;

    if (!document.getElementById('vt-styles')) {
        const style = document.createElement('style');
        style.id = 'vt-styles';
        style.textContent = styles as unknown as string;
        document.head.appendChild(style);
    }

    const container = document.createElement('div');
    container.id = 'vt-widget-container';
    // innerHTML is used here for simplicity since the content is static and controlled
    // but i would prefer to create elements manually later
    // TODO
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
    document.body.appendChild(container);

    let currentLeft = window.innerWidth - 120 - 24;
    let currentTop = window.innerHeight - 120 - 24;
    container.style.left = currentLeft + 'px';
    container.style.top = currentTop + 'px';

    const dragHandle = document.getElementById('vt-drag-handle') as HTMLElement;
    let isWidgetDragging = false;
    let startMouseX = 0, startMouseY = 0;
    let startLeft = 0, startTop = 0;

    dragHandle.addEventListener('pointerdown', (e: PointerEvent) => {
        isWidgetDragging = true;
        container.classList.add('is-dragging');
        startMouseX = e.clientX; startMouseY = e.clientY;
        startLeft = currentLeft; startTop = currentTop;
        dragHandle.setPointerCapture(e.pointerId);
        e.stopPropagation();
    });

    dragHandle.addEventListener('pointermove', (e: PointerEvent) => {
        if (!isWidgetDragging) return;
        currentLeft = startLeft + (e.clientX - startMouseX);
        currentTop = startTop + (e.clientY - startMouseY);
        container.style.left = currentLeft + 'px';
        container.style.top = currentTop + 'px';
    });

    function snapToEdge(): void {
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

        container.style.left = currentLeft + 'px';
        container.style.top = currentTop + 'px';
    }

    dragHandle.addEventListener('pointerup', (e: PointerEvent) => {
        isWidgetDragging = false;
        container.classList.remove('is-dragging');
        dragHandle.releasePointerCapture(e.pointerId);
        snapToEdge();
    });

    window.addEventListener('resize', snapToEdge);

    const toggleBtn = document.getElementById('vt-toggle-btn') as HTMLElement;
    const trackballArea = document.getElementById('vt-trackball-area') as HTMLElement;

    toggleBtn.addEventListener('click', () => {
        container.classList.toggle('vt-mini');
        toggleBtn.textContent = container.classList.contains('vt-mini') ? '+' : '−';
        snapToEdge();
    });

    trackballArea.addEventListener('click', () => {
        if (container.classList.contains('vt-mini')) {
            container.classList.remove('vt-mini');
            toggleBtn.textContent = '−';
            snapToEdge();
        }
    });

    const viewport = document.getElementById('vt-viewport') as HTMLElement;
    const texture = document.getElementById('vt-texture') as HTMLElement;
    let texPosX = 0, texPosY = 0;
    let isTrackballDragging = false;
    let tbPrevMouseX = 0, tbPrevMouseY = 0;
    let velX = 0, velY = 0;
    const friction = 0.92;

    function applyMovement(dx: number, dy: number): void {
        const scrollSensitivity = 1.8;
        window.scrollBy(-dx * scrollSensitivity, -dy * scrollSensitivity);
        texPosX += (dx * 1.5); texPosY += (dy * 1.5);
        texture.style.backgroundPosition = `${Math.round(texPosX)}px ${Math.round(texPosY)}px`;
    }

    viewport.addEventListener('pointerdown', (e: PointerEvent) => {
        isTrackballDragging = true;
        tbPrevMouseX = e.clientX; tbPrevMouseY = e.clientY;
        velX = 0; velY = 0;
        viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e: PointerEvent) => {
        if (!isTrackballDragging) return;
        const dx = e.clientX - tbPrevMouseX;
        const dy = e.clientY - tbPrevMouseY;
        velX = dx; velY = dy;
        applyMovement(dx, dy);
        tbPrevMouseX = e.clientX; tbPrevMouseY = e.clientY;
    });

    viewport.addEventListener('pointerup', (e: PointerEvent) => {
        isTrackballDragging = false;
        viewport.releasePointerCapture(e.pointerId);
    });

    viewport.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        velX += -e.deltaX * 0.2; velY += -e.deltaY * 0.2;
        velX = Math.max(-60, Math.min(60, velX));
        velY = Math.max(-60, Math.min(60, velY));
    }, { passive: false });

    function physicsLoop(): void {
        if (!isTrackballDragging) {
            velX *= friction; velY *= friction;
            if (Math.abs(velX) < 0.1) velX = 0;
            if (Math.abs(velY) < 0.1) velY = 0;
            if (velX !== 0 || velY !== 0) applyMovement(velX, velY);
        }
        requestAnimationFrame(physicsLoop);
    }
    requestAnimationFrame(physicsLoop);
}
