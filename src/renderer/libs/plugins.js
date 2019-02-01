import { createReadStream } from "fs";
import { pipeline } from "stream";
import JSONStream from "JSONStream";
import slugify from "slugify";

import pluginSchema from "../schema/plugin";

import { map, matchSchema } from "./helpers";

function extend(plugin) {
  return {
    ...plugin,
    id: slugify(plugin.name, { lower: true, replacement: "-" })
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
