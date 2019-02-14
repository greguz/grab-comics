import JSONStream from "JSONStream";

import chapterSchema from "../schema/chapter";

import { ctxToEnv, map, matchSchema, pump, tplToCmd } from "../libs/helpers";
import { Process } from "../libs/process";

function extend(chapter, comic, plugin) {
  return {
    ...chapter,
    comic: comic.id,
    plugin: plugin.id,
    title: chapter.title ? chapter.title : `Chapter ${chapter.number}`,
    path: `${comic.path}:${chapter.number}`
  };
}

function toProcess(plugin, comic) {
  const cmd = tplToCmd(
    plugin.commands.chapters,
    ctxToEnv({
      plugin,
      comic
    })
  );

  return new Process(cmd[0], cmd.splice(1));
}

export default function chapters(plugin, comic, target) {
  return pump(
    // Process standard output
    toProcess(plugin, comic),
    // Parse stdout as JSON
    JSONStream.parse("*"),
    // Get only valid chapters
    matchSchema(chapterSchema),
    // Extend chapter data
    map(chapter => extend(chapter, comic, plugin)),
    // Target stream where to collect the output
    target
  );
}
