import { ipcRenderer } from "electron";
import { Readable } from "stream";
import shortid from "shortid";

const events = {
  PUSH: 0,
  STOP: 1,
  DRAIN: 2,
  CLOSE: 3
};

class RemoteStream extends Readable {
  constructor(procedure, payload) {
    super({ objectMode: true });

    // RPC data
    this._procedure = procedure;
    this._payload = payload;

    // Used to detect the first "read" call
    this._initialized = false;

    // Generate channel ID
    this._id = shortid.generate();

    // Remote PUSH event callback
    const onPush = (event, data) => {
      if (!this.push(data)) {
        ipcRenderer.send(this._channel(events.STOP));
      }
    };

    // Remote CLOSE event callback
    const onClose = () => {
      ipcRenderer.off(this._channel(events.PUSH), onPush);
      this.push(null);
    };

    // Setup listeners
    ipcRenderer.on(this._channel(events.PUSH), onPush);
    ipcRenderer.once(this._channel(events.CLOSE), onClose);
  }

  _channel(event) {
    // From event name to channel name
    return this._id + event.toString();
  }

  _read() {
    if (this._initialized) {
      ipcRenderer.send(this._channel(events.DRAIN));
    } else {
      this._initialized = true;
      ipcRenderer.send(this._procedure, this._id, this._payload);
    }
  }
}

export default function call(procedure, payload) {
  return new RemoteStream(procedure, payload);
}
