import JSONStream from "JSONStream";
import { pipeline } from "stream";
import spawn from "cross-spawn";

import pageSchema from "../schema/page";

import { ctxToEnv, map, matchSchema, tplToCmd } from "../libs/helpers";

function extend(page, chapter, comic, plugin) {
  return {
    ...page,
    chapter: chapter.number,
    comic: comic.id,
    plugin: plugin.id,
    path: `${chapter.path}:${page.number}`
  };
}

function toProcess(plugin, comic, chapter) {
  const cmd = tplToCmd(
    plugin.commands.pages,
    ctxToEnv({
      plugin,
      comic,
      chapter
    })
  );

  return spawn(cmd[0], cmd.splice(1));
}

export default function pages(plugin, comic, chapter, target) {
  return new Promise((resolve, reject) => {
    pipeline(
      // Process standard output
      toProcess(plugin, comic, chapter).stdout,
      // Parse stdout as JSON
      JSONStream.parse("*"),
      // Get only valid pages
      matchSchema(pageSchema),
      // Extend page data
      map(page => extend(page, chapter, comic, plugin)),
      // Target stream where to collect the output
      target,
      // End callback
      err => (err ? reject(err) : resolve())
    );
  });
}
