import { initVirtualTrackball, updateVirtualTrackballConfig } from "tamaru";
import type { TamaruConfig } from "./types";
import { STORAGE_KEY } from "./types";

const getConfig = (): Promise<TamaruConfig | undefined> =>
  chrome.storage.sync
    .get(STORAGE_KEY)
    .then((result) => result[STORAGE_KEY] as TamaruConfig | undefined);

const init = async () => {
  const config = (await getConfig()) ?? {};
  initVirtualTrackball(config as Parameters<typeof initVirtualTrackball>[0]);
};

export function onExecute() {
  init();
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes[STORAGE_KEY]) {
    updateVirtualTrackballConfig(
      changes[STORAGE_KEY].newValue as Parameters<
        typeof updateVirtualTrackballConfig
      >[0],
    );
  }
});
