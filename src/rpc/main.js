import { ipcMain } from "electron";

import { RemoteReadable } from "./readable";
import { RemoteWritable } from "./writable";

export function call(window, procedure, payload) {
  return new RemoteReadable(window.webContents, `rpc:${procedure}`, payload);
}

export function handle(procedure, handler) {
  ipcMain.on(`rpc:${procedure}`, ({ sender }, id, payload) => {
    handler.call(null, new RemoteWritable(sender, id), payload);
  });
}
