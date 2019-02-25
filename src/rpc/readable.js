import { Readable } from "stream";

export class RemoteReadable extends Readable {
  constructor(channel, options) {
    super(options);
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
  }

  _read() {
    this._channel.send("drain");
  }

  _destroy(err, callback) {
    this._channel.removeListener("ready", this._onReady);
    this._channel.removeListener("push", this._onPush);
    this._channel.removeListener("close", this._onClose);

    callback(err);
  }
}
