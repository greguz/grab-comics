import { Writable } from "stream";

import { events } from "./events";

export class RemoteWritable extends Writable {
  constructor(sender, id) {
    super({ objectMode: true });

    this._sender = sender;
    this._id = id;
    this._queue = [];
    this._flowing = true;

    this._onStop = () => {
      this._flowing = false;
    };

    this._onDrain = () => {
      this._flowing = true;
      while (this._queue.length > 0) {
        this._queue.shift()();
      }
    };

    this._on(events.STOP, this._onStop);
    this._on(events.DRAIN, this._onDrain);

    this._send(events.READY);
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

  _write(chunk, enconding, callback) {
    this._send(events.PUSH, chunk);

    if (this._flowing) {
      callback();
    } else {
      this._queue.push(callback);
    }
  }

  _final(callback) {
    this._send(events.CLOSE);
    callback();
  }

  _destroy() {
    this._off(events.STOP, this._onStop);
    this._off(events.DRAIN, this._onDrain);
  }
}
