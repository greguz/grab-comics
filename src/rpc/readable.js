import { Readable } from "stream";

import { events } from "./events";

export class RemoteReadable extends Readable {
  constructor(channel, options) {
    super(options);

    this._channel = channel;

    this._onReady = () => {
      if (this.readableFlowing === true) {
        this._read();
      }
    };

    this._onPush = (event, data) => {
      if (!this.push(data)) {
        this._channel.send(events.BUSY);
      }
    };

    this._onClose = () => {
      this.push(null);
    };

    this._channel.on(events.READY, this._onReady);
    this._channel.on(events.PUSH, this._onPush);
    this._channel.on(events.CLOSE, this._onClose);
  }

  _read() {
    this._channel.send(events.DRAIN);
  }

  _destroy() {
    this._channel.off(events.READY, this._onReady);
    this._channel.off(events.PUSH, this._onPush);
    this._channel.off(events.CLOSE, this._onClose);
  }
}
