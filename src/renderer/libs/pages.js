import JSONStream from "JSONStream";

import pageSchema from "../schema/page";

import {
  ctxToEnv,
  map,
  matchSchema,
  spawnPluginProcess,
  tplToCmd
} from "./helpers";

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

  spawnPluginProcess(
    cmd,
    [
      // Parse stdout as JSON
      JSONStream.parse("*"),
      // Get only valid pages
      matchSchema(pageSchema),
      // Extend page data
      map(page => extend(page, chapter, comic, plugin))
    ],
    onData,
    onEnd
  );
}
