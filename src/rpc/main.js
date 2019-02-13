import { ipcMain } from "electron";

import { ElectronChannel } from "./channel";
import { RemoteWritable } from "./writable";

export function reply(procedure, handler) {
  ipcMain.on(procedure, ({ sender }, { id, payload }) => {
    const channel = new ElectronChannel(id, sender);
    const stream = new RemoteWritable(channel, { objectMode: true });

    handler
      .call(null, payload, stream)
      .then(() => channel.send("x"))
      .catch(err => channel.send("x", err))
      .then(() => stream.destroy());
  });
}

export function handle(procedure, handler) {
  reply(procedure, (payload, stream) => {
    return new Promise((resolve, reject) => {
      handler
        .call(null, payload)
        .then(result => stream.end(result, null, resolve))
        .catch(reject);
    });
  });
}
