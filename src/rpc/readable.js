import { Readable } from "stream";
import shortid from "shortid";

import { events } from "./events";

export class RemoteReadable extends Readable {
  constructor(sender, procedure, payload) {
    super({ objectMode: true });

    this._sender = sender;
    this._procedure = procedure;
    this._payload = payload;
    this._initialized = false;
    this._id = shortid.generate();

    this._onReady = () => {
      clearTimeout(this._watchdog);
    };

    this._onPush = (event, data) => {
      if (!this.push(data)) {
        this._send(events.STOP);
      }
    };

    this._onClose = () => {
      this.push(null);
    };

    this._on(events.READY, this._onReady);
    this._on(events.PUSH, this._onPush);
    this._on(events.CLOSE, this._onClose);
  }

  _channel(event) {
    return this._id + event.toString();
  }

  _send(event, data) {
    this._sender.send(this._channel(event), data);
  }

  _on(event, listener) {
    this._sender.on(this._channel(event), listener);
  }

  _off(event, listener) {
    this._sender.off(this._channel(event), listener);
  }

  _read() {
    if (this._watchdog !== undefined) {
      this._send(events.DRAIN);
    } else {
      this._watchdog = setTimeout(
        () =>
          process.nextTick(() =>
            this.emit("error", new Error("Target procedure not found"))
          ),
        1000
      );
      this._sender.send(this._procedure, this._id, this._payload);
    }
  }

  _destroy() {
    this._off(events.READY, this._onReady);
    this._off(events.PUSH, this._onPush);
    this._off(events.CLOSE, this._onClose);
  }
}
