import JSONStream from "JSONStream";

import pageSchema from "../schema/page";

import { ctxToEnv, map, matchSchema, pump, tplToCmd } from "../libs/helpers";
import { Process } from "../libs/process";

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

  return new Process(cmd[0], cmd.splice(1));
}

export default function pages(plugin, comic, chapter, target) {
  return pump(
    // Process standard output
    toProcess(plugin, comic, chapter),
    // Parse stdout as JSON
    JSONStream.parse("*"),
    // Get only valid pages
    matchSchema(pageSchema),
    // Extend page data
    map(page => extend(page, chapter, comic, plugin)),
    // Target stream where to collect the output
    target
  );
}
