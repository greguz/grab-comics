import { Duplex } from "stream";
import { inherits } from "util";

import { RemoteReadable } from "./readable";
import { RemoteWritable } from "./writable";

export function RemoteDuplex(channel, options) {
  if (!(this instanceof RemoteDuplex)) {
    return new RemoteDuplex(options);
  }
  Duplex.call(this, options);
  this._init(channel);
}

inherits(RemoteDuplex, Duplex);

RemoteReadable.prototype._init = function _init(channel) {
  RemoteReadable.prototype._init.call(this, channel);
  RemoteWritable.prototype._init.call(this, channel);
};

RemoteDuplex.prototype._read = RemoteReadable.prototype._read;

RemoteDuplex.prototype._write = RemoteWritable.prototype._write;

RemoteDuplex.prototype._final = RemoteWritable.prototype._final;

RemoteReadable.prototype._destroy = function _destroy(err, callback) {
  RemoteReadable.prototype._destroy.call(this, null, function() {});
  RemoteWritable.prototype._destroy.call(this, null, function() {});
  callback(err);
};
