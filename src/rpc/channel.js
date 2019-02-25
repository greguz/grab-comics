import { EventEmitter } from "events";
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

export class ElectronChannel extends EventEmitter {
  constructor(id, sender) {
    super();
    this._id = id.toString();
    this._sender = sender;
    this._destroyed = false;

    this._event = "REMOTE_CHANNEL";
    this._listener = (_, data) => {
      if (
        typeof data === "object" &&
        data.channel === "electron" &&
        data.id === this._id
      ) {
        this.emit(data.event, data.payload);
      }
    };

    if (isRenderer()) {
      ipcRenderer.addListener(this._event, this._listener);
    } else {
      ipcMain.addListener(this._event, this._listener);
    }
  }

  addListener(event, listener) {
    if (this._destroyed) {
      throw new Error("This channel is already destroyed");
    } else {
      super.addListener(event, listener);
    }
  }

  send(event, payload) {
    const data = {
      channel: "electron",
      id: this._id,
      event,
      payload
    };

    if (isRenderer()) {
      ipcRenderer.send(this._event, data);
    } else {
      this._sender.send(this._event, data);
    }
  }

  destroy() {
    // Notify imminent destruction
    this.emit("destroy");

    // Remove all registered listeners
    this.removeAllListeners();

    // Flag this instance as destroyed
    this._destroyed = true;

    // Disable the channel between electron processes
    if (isRenderer()) {
      ipcRenderer.removeListener(this._event, this._listener);
    } else {
      ipcMain.removeListener(this._event, this._listener);
    }
  }
}
