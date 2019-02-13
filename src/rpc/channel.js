import { ipcMain, ipcRenderer } from "electron";

function isRenderer() {
  // running in a web browser
  if (typeof process === "undefined") return true;

  // node-integration is disabled
  if (!process) return true;

  // We're in node.js somehow
  if (!process.type) return false;

  return process.type === "renderer";
}

export class ElectronChannel {
  constructor(id, sender) {
    this.id = id;
    this.sender = sender;
  }

  send(event, payload) {
    if (isRenderer()) {
      ipcRenderer.send(this.id + event, payload);
    } else {
      this.sender.send(this.id + event, payload);
    }
  }

  subscribe(event, listener) {
    const _event = this.id + event;
    const _listener = (e, data) => listener.call(null, data);

    if (isRenderer()) {
      ipcRenderer.on(_event, _listener);
    } else {
      ipcMain.on(_event, _listener);
    }

    return function unsubscribe() {
      if (isRenderer()) {
        ipcRenderer.off(_event, _listener);
      } else {
        ipcMain.off(_event, _listener);
      }
    };
  }
}
