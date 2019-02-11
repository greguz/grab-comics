import { ipcRenderer } from "electron";

import { RemoteReadable } from "./readable";
import { RemoteWritable } from "./writable";

export function call(procedure, payload) {
  return new RemoteReadable(ipcRenderer, procedure, payload);
}

export function handle(procedure, handler) {
  ipcRenderer.on(procedure, (event, id, payload) => {
    handler.call(null, new RemoteWritable(ipcRenderer, id), payload);
  });
}
