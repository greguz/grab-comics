import spawn from "cross-spawn";
import JSONStream from "JSONStream";
import { pipeline } from "stream";

import pageSchema from "../schema/page";

import { ctxToEnv, map, matchSchema, tplToCmd } from "./helpers";

function extend(page, chapter, comic, plugin) {
  return {
    ...page,
    chapter: chapter.number,
    comic: comic.id,
    plugin: plugin.id,
    path: `${chapter.path}:${page.number}`
  };
}

export default function pages(plugin, comic, chapter, onData, onEnd) {
  const cmd = tplToCmd(
    plugin.commands.pages,
    ctxToEnv({ plugin, comic, chapter })
  );

  pipeline(
    // Spawn configured command
    spawn(cmd[0], cmd.splice(1)).stdout,
    // Parse stdout as JSON
    JSONStream.parse("*"),
    // Get only valid pages
    matchSchema(pageSchema),
    // Extend page data
    map(page => extend(page, chapter, comic, plugin)),
    // Final callback
    onEnd
  ).on("data", onData);
}
