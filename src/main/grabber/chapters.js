import JSONStream from "JSONStream";

import chapterSchema from "../schema/chapter";

import {
  ctxToEnv,
  map,
  matchSchema,
  spawnPluginProcess,
  tplToCmd
} from "../libs/helpers";

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

  spawnPluginProcess(
    cmd,
    [
      // Parse stdout as JSON
      JSONStream.parse("*"),
      // Get only valid chapters
      matchSchema(chapterSchema),
      // Extend chapter data
      map(chapter => extend(chapter, comic, plugin))
    ],
    onData,
    onEnd
  );
}
