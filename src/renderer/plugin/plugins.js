import { createReadStream } from "fs";
import { pipeline } from "stream";
import JSONStream from "JSONStream";
import slugify from "slugify";

import pluginSchema from "../schema/plugin";

import { map, matchSchema } from "./helpers";

function addId(plugin) {
  return {
    ...plugin,
    id: slugify(plugin.name, { lower: true, replacement: "-" })
  };
}

export default function plugins(file, onData, onEnd) {
  pipeline(
    createReadStream(file, "utf8"),
    JSONStream.parse("*"),
    matchSchema(pluginSchema),
    map(addId),
    onEnd
  ).once("data", onData);
}
