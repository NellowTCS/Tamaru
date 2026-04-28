import { DEFAULT_CONFIG, STORAGE_KEY } from "./types";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Tamaru extension installed");
  chrome.storage.sync.set({ [STORAGE_KEY]: DEFAULT_CONFIG });
});
