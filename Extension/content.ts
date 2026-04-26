import {
  initVirtualTrackball,
  updateVirtualTrackballConfig,
  destroyVirtualTrackball,
} from "tamaru";

chrome.storage.sync.get("tamaruConfig", (cfg) => {
  initVirtualTrackball(cfg || {});
});
