import { Writable } from "stream";

export class RemoteWritable extends Writable {
  constructor(channel, options) {
    super(options);
    this._channel = channel;

    this._flowing = false;
    this._queued = undefined;

    this._onDrain = () => {
      this._flowing = true;
      if (this._queued) {
        const { chunk, enconding, callback } = this._queued;
        this._write(chunk, enconding, callback);
        this._queued = undefined;
      }
    };
    this._onBusy = () => {
      this._flowing = false;
    };

    this._channel.addListener("drain", this._onDrain);
    this._channel.addListener("busy", this._onBusy);

    this._channel.send("ready");
  }

  _write(chunk, enconding, callback) {
    if (this._flowing) {
      this._channel.send("push", chunk);
      callback();
    } else {
      this._queued = { chunk, enconding, callback };
    }
  }

  _final(callback) {
    this._channel.send("close");
    callback();
  }

  _destroy(err, callback) {
    this._channel.removeListener("drain", this._onDrain);
    this._channel.removeListener("busy", this._onBusy);

    callback(err);
  }
}
