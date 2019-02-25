import { Readable } from "stream";
import { inherits } from "util";

export function RemoteReadable(channel, options) {
  if (!(this instanceof RemoteReadable)) {
    return new RemoteReadable(channel, options);
  }
  Readable.call(this, options);
  this._init(channel);
}

inherits(RemoteReadable, Readable);

RemoteReadable.prototype._init = function _init(channel) {
  this._channel = channel;

  this._onReady = () => {
    if (this.readableFlowing === true) {
      this._read();
    }
  };
  this._onPush = data => {
    if (!this.push(data)) {
      this._channel.send("busy");
    }
  };
  this._onClose = () => {
    this.push(null);
  };

  this._channel.addListener("ready", this._onReady);
  this._channel.addListener("push", this._onPush);
  this._channel.addListener("close", this._onClose);
};

RemoteReadable.prototype._read = function _read() {
  this._channel.send("drain");
};

RemoteReadable.prototype._destroy = function _destroy(err, callback) {
  this._channel.removeListener("ready", this._onReady);
  this._channel.removeListener("push", this._onPush);
  this._channel.removeListener("close", this._onClose);

  callback(err);
};
