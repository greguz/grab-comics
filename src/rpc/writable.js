import { Writable } from "stream";

import { events } from "./events";

export class RemoteWritable extends Writable {
  constructor(channel, options) {
    super(options);

    this._channel = channel;
    this._subscriptions = [];

    this._flowing = false;
    this._queue = [];

    this._subscribe(events.DRAIN, () => {
      this._flowing = true;
      while (this._queue.length > 0 && this._flowing === true) {
        const { chunk, enconding, callback } = this._queue.shift();
        this._write(chunk, enconding, callback);
      }
    });

    this._subscribe(events.BUSY, () => {
      this._flowing = false;
    });

    this._channel.send(events.READY);
  }

  _subscribe(event, listener) {
    this._subscriptions.push(this._channel.subscribe(event, listener));
  }

  _write(chunk, enconding, callback) {
    if (this._flowing) {
      this._channel.send(events.PUSH, chunk);
      callback();
    } else {
      this._queue.push({ chunk, enconding, callback });
    }
  }

  _final(callback) {
    this._channel.send(events.CLOSE);
    callback();
  }

  _destroy() {
    for (const unsubscribe of this._subscriptions) {
      unsubscribe();
    }
  }
}
