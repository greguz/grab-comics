import { createReadStream } from "fs";
import { pipeline } from "stream";
import JSONStream from "JSONStream";
import slugify from "slugify";

import pluginSchema from "../schema/plugin";

import { map, matchSchema } from "../libs/helpers";

function extend(plugin) {
  const id = slugify(plugin.name, { lower: true, replacement: "-" });
  return {
    ...plugin,
    id,
    path: id
  };
}

export default function plugins(file, single, onData, onEnd) {
  pipeline(
    createReadStream(file, "utf8"),
    JSONStream.parse(single === true ? undefined : "*"),
    matchSchema(pluginSchema),
    map(extend),
    onEnd
  ).once("data", onData);
}

// TODO: disting function for single plugin (with forced validation)
