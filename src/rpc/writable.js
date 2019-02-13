import { Writable } from "stream";

import { events } from "./events";

export class RemoteWritable extends Writable {
  constructor(channel, options) {
    super(options);

    this._channel = channel;
    this._flowing = false;
    this._queue = [];

    this._onDrain = () => {
      this._flowing = true;

      while (this._queue.length > 0) {
        const { chunk, enconding, callback } = this._queue.shift();
        this._write(chunk, enconding, callback);
      }
    };

    this._onBusy = () => {
      this._flowing = false;
    };

    this._channel.on(events.DRAIN, this._onDrain);
    this._channel.on(events.BUSY, this._onBusy);

    this._channel.send(events.READY);
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
    this._channel.off(events.DRAIN, this._onDrain);
    this._channel.off(events.BUSY, this._onBusy);
  }
}
