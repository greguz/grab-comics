import spawn from "cross-spawn";
import { Readable } from "stream";

export class Process extends Readable {
  constructor(cmd, args, options) {
    super(options);

    this._cmd = cmd;
    this._args = args;
    this._options = options;
  }

  _read() {
    if (!this._process) {
      this._process = spawn(this._cmd, this._args, this._options);

      this._onStdOut = data => {
        this.push(data);
      };

      this._onStdErr = data => {
        // TODO: collect
        console.error(data.toString("utf8"));
      };

      this._onExit = code => {
        if (code === 0) {
          this.push(null);
        } else {
          process.nextTick(() =>
            this.emit("error", new Error(`Process exited with code ${code}`))
          );
        }
      };

      this._process.stdout.on("data", this._onStdOut);
      this._process.stderr.on("data", this._onStdErr);
      this._process.on("exit", this._onExit);
    }
  }

  _destroy(err, callback) {
    if (this._process) {
      this._process.stdout.off("data", this._onStdOut);
      this._process.stderr.off("data", this._onStdErr);
      this._process.off("exit", this._onExit);

      this._process.kill("SIGTERM");

      this._process = undefined;
    }

    callback(err);
  }
}
