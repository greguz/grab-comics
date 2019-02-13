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

  on(event, listener) {
    if (isRenderer()) {
      ipcRenderer.on(this.id + event, listener);
    } else {
      ipcMain.on(this.id + event, listener);
    }
  }

  once(event, listener) {
    if (isRenderer()) {
      ipcRenderer.once(this.id + event, listener);
    } else {
      ipcMain.once(this.id + event, listener);
    }
  }

  off(event, listener) {
    if (isRenderer()) {
      ipcRenderer.off(this.id + event, listener);
    } else {
      ipcMain.off(this.id + event, listener);
    }
  }
}
