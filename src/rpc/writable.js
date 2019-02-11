import { Writable } from "stream";

import { events } from "./events";

export class RemoteWritable extends Writable {
  constructor(sender, id) {
    super({ objectMode: true });

    this._sender = sender;
    this._id = id;
    this._queue = [];
    this._flowing = true;

    /// Remote STOP event callback
    this._onStop = () => {
      this._flowing = false;
    };

    /// Remote DRAIN event callback
    this._onDrain = () => {
      while (this._queue.length > 0) {
        this._queue.shift()();
      }
      this._flowing = true;
    };

    /// Setup event listeners
    this._sender.on(this._channel(events.STOP), this._onStop);
    this._sender.on(this._channel(events.DRAIN), this._onDrain);
  }

  _channel(event) {
    // From event name to channel name
    return this._id + event.toString();
  }

  _write(chunk, enconding, callback) {
    this._sender.send(this._channel(events.PUSH), chunk);

    if (this._flowing) {
      callback();
    } else {
      this._queue.push(callback);
    }
  }

  _final(callback) {
    // Clear listeners
    this._sender.off(this._channel(events.STOP), this._onStop);
    this._sender.off(this._channel(events.DRAIN), this._onDrain);

    // Send CLOSE event
    this._sender.send(this._channel(events.CLOSE));

    // All done
    callback();
  }
}
