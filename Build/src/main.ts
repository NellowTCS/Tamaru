import { mainLogger } from "./logger";
import { TamaruConfig } from "./types";
import { TamaruApp } from "./app";

let tamaruInstance: TamaruApp | null = null;

export function initVirtualTrackball(config?: TamaruConfig): void {
  if (tamaruInstance) {
    mainLogger.warn("Init called but Tamaru is already mounted. Aborting.");
    return;
  }
  tamaruInstance = new TamaruApp(config);
  tamaruInstance.init();
}

export function updateVirtualTrackballConfig(
  newConfig: Partial<TamaruConfig>,
): void {
  if (!tamaruInstance) {
    mainLogger.warn("Failed to update config: Widget not initialized.");
    return;
  }
  mainLogger.debug("Updating config", { state: { newConfig } });
  tamaruInstance.updateConfig(newConfig);
}

export function destroyVirtualTrackball(): void {
  if (!tamaruInstance) {
    mainLogger.warn("Destroy called but no widget is active");
    return;
  }
  mainLogger.info("Destroying widget");
  tamaruInstance.destroy();
  tamaruInstance = null;
}

export function hideVirtualTrackball(): void {
  if (tamaruInstance) tamaruInstance.hide();
}
