import { Readable } from "stream";

export default class ComposedReadable extends Readable {
  constructor(sources, options) {
    super(options);
    this._sources = sources;
    this._counter = 0;
    this._initialized = false;
  }

  _push(data) {
    if (!this.push(data)) {
      for (const source of this._sources) {
        source.pause();
      }
    }
  }

  _end() {
    this._counter++;
    if (this._counter >= this._sources.length) {
      this.push(null);
    }
  }

  _read() {
    if (!this._initialized) {
      this._initialized = true;
      for (const source of this._sources) {
        source
          .on("data", data => this._push(data))
          .once("end", () => this._end());
      }
    } else {
      for (const source of this._sources) {
        source.resume();
      }
    }
  }
}
