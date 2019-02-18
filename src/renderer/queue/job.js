import * as os from "os";
import * as path from "path";
import shortid from "shortid";

import { request } from "../../rpc/renderer";

export default async function job(plugin, comic, chapter) {
  const dir = path.join(os.tmpdir(), shortid.generate());
  const tasks = [];

  await new Promise((resolve, reject) => {
    request(
      "grab:pages",
      { plugin, comic, chapter },
      ({ number, url }) =>
        tasks.push({
          status: "PENDING",
          type: "DOWNLOAD",
          url,
          file: path.join(dir, number.toString().padStart(5, "0"))
        }),
      err => (err ? reject(err) : resolve())
    );
  });

  return {
    id: shortid.generate(),
    status: "PENDING",
    progress: 0,
    comic,
    chapter,
    tasks
  };
}
