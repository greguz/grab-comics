import { Readable } from "stream";

import { events } from "./events";

export class RemoteReadable extends Readable {
  constructor(channel, options) {
    super(options);

    this._channel = channel;
    this._subscriptions = [];

    this._subscribe(events.READY, () => {
      if (this.readableFlowing === true) {
        this._read();
      }
    });

    this._subscribe(events.PUSH, data => {
      if (!this.push(data)) {
        this._channel.send(events.BUSY);
      }
    });

    this._subscribe(events.CLOSE, () => {
      this.push(null);
    });
  }

  _subscribe(event, listener) {
    this._subscriptions.push(this._channel.subscribe(event, listener));
  }

  _read() {
    this._channel.send(events.DRAIN);
  }

  _destroy() {
    for (const unsubscribe of this._subscriptions) {
      unsubscribe();
    }
  }
}
