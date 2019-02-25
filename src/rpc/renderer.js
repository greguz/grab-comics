import { ipcRenderer } from "electron";
import shortid from "shortid";

import { ElectronChannel } from "./channel";
import { RemoteReadable } from "./readable";

export function request(procedure, payload, onData, onEnd) {
  const id = shortid.generate();
  const channel = new ElectronChannel(id);
  const stream = new RemoteReadable(channel, { objectMode: true });

  stream.on("data", onData);

  channel.addListener("x", err => {
    channel.destroy();
    stream.off("data", onData);
    stream.destroy();
    onEnd(err);
  });

  ipcRenderer.send(procedure, { id, payload });
}

export function call(procedure, payload) {
  return new Promise((resolve, reject) => {
    let last;
    request(
      procedure,
      payload,
      data => (last = data),
      err => (err ? reject(err) : resolve(last))
    );
  });
}
