import JSONStream from "JSONStream";
import { pipeline } from "stream";
import spawn from "cross-spawn";

import chapterSchema from "../schema/chapter";

import { ctxToEnv, map, matchSchema, tplToCmd } from "../libs/helpers";

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

  return spawn(cmd[0], cmd.splice(1));
}

export default function chapters(plugin, comic, target) {
  return new Promise((resolve, reject) => {
    pipeline(
      // Process standard output
      toProcess(plugin, comic).stdout,
      // Parse stdout as JSON
      JSONStream.parse("*"),
      // Get only valid chapters
      matchSchema(chapterSchema),
      // Extend chapter data
      map(chapter => extend(chapter, comic, plugin)),
      // Target stream where to collect the output
      target,
      // End callback
      err => (err ? reject(err) : resolve())
    );
  });
}
