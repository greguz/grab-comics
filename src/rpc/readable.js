import { Readable } from "stream";
import shortid from "shortid";

import { events } from "./events";

export class RemoteReadable extends Readable {
  constructor(sender, procedure, payload) {
    super({ objectMode: true });

    this._sender = sender;

    // RPC data
    this._procedure = procedure;
    this._payload = payload;

    // Used to detect the first "read" call
    this._initialized = false;

    // Generate channel ID
    this._id = shortid.generate();

    // Remote PUSH event callback
    const onPush = (event, data) => {
      if (!this.push(data)) {
        this._sender.send(this._channel(events.STOP));
      }
    };

    // Remote CLOSE event callback
    const onClose = () => {
      this._sender.off(this._channel(events.PUSH), onPush);
      this.push(null);
    };

    // Setup listeners
    this._sender.on(this._channel(events.PUSH), onPush);
    this._sender.once(this._channel(events.CLOSE), onClose);
  }

  _channel(event) {
    // From event name to channel name
    return this._id + event.toString();
  }

  _read() {
    if (this._initialized) {
      this._sender.send(this._channel(events.DRAIN));
    } else {
      this._initialized = true;
      this._sender.send(this._procedure, this._id, this._payload);
    }
  }
}
