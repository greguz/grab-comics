import { Writable } from "stream";
import { inherits } from "util";

export function RemoteWritable(channel, options) {
  if (!(this instanceof RemoteWritable)) {
    return new RemoteWritable(channel, options);
  }
  Writable.call(this, options);
  this._init(channel);
}

inherits(RemoteWritable, Writable);

RemoteWritable.prototype._init = function _init(channel) {
  this._channel = channel;
  this._flowing = false;
  this._queued = undefined;
  this._close = undefined;

  this._onDrain = () => {
    this._flowing = true;
    if (this._queued) {
      const { chunk, enconding, callback } = this._queued;
      this._queued = undefined;
      this._write(chunk, enconding, callback);
    }
    if (this._close) {
      this._final(this._close);
    }
  };
  this._onBusy = () => {
    this._flowing = false;
  };

  this._channel.addListener("drain", this._onDrain);
  this._channel.addListener("busy", this._onBusy);

  this._channel.send("ready");
};

RemoteWritable.prototype._write = function _write(chunk, enconding, callback) {
  if (this._flowing) {
    this._channel.send("push", chunk);
    callback();
  } else {
    this._queued = { chunk, enconding, callback };
  }
};

RemoteWritable.prototype._final = function _final(callback) {
  if (this._flowing) {
    this._channel.send("close");
    callback();
  } else {
    this._close = callback;
  }
};

RemoteWritable.prototype._destroy = function _destroy(err, callback) {
  this._channel.removeListener("drain", this._onDrain);
  this._channel.removeListener("busy", this._onBusy);
  callback(err);
};
