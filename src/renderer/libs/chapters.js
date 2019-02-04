import spawn from "cross-spawn";
import JSONStream from "JSONStream";
import { pipeline } from "stream";

import chapterSchema from "../schema/chapter";

import { ctxToEnv, map, matchSchema, tplToCmd } from "./helpers";

function extend(chapter, comic, plugin) {
  return {
    ...chapter,
    comic: comic.id,
    plugin: plugin.id,
    title: chapter.title ? chapter.title : `Chapter ${chapter.number}`,
    path: `${comic.path}:${chapter.number}`
  };
}

export default function chapters(plugin, comic, onData, onEnd) {
  const cmd = tplToCmd(plugin.commands.chapters, ctxToEnv({ plugin, comic }));

  pipeline(
    // Spawn configured command
    spawn(cmd[0], cmd.splice(1)).stdout,
    // Parse stdout as JSON
    JSONStream.parse("*"),
    // Get only valid chapters
    matchSchema(chapterSchema),
    // Extend chapter data
    map(chapter => extend(chapter, comic, plugin)),
    // Final callback
    onEnd
  ).on("data", onData);
}
