import JSONStream from "JSONStream";
import levenshtein from "js-levenshtein";

import after from "lodash/after";

import comicSchema from "../schema/comic";

import {
  buildStringMatcher,
  ctxToEnv,
  filter,
  limit,
  map,
  matchSchema,
  spawnPluginProcess,
  tplToCmd
} from "./helpers";

function extend(comic, text, plugin) {
  return {
    ...comic,
    distance: levenshtein(comic.title.toLowerCase(), text.toLowerCase()),
    plugin: plugin.id,
    path: `${plugin.path}:${comic.id}`
  };
}

function run(plugin, language, text, onData, onEnd) {
  const cmd = tplToCmd(plugin.commands.comics, ctxToEnv({ language, text }));
  const match = buildStringMatcher(text);

  return spawnPluginProcess(
    cmd,
    [
      // Parse stdout as JSON
      JSONStream.parse("*"),
      // Get only valid comics
      matchSchema(comicSchema),
      // Filter by searched text and selected language
      filter(comic => comic.language === language && match(comic.title)),
      // Limit by 20 comics per plugin
      limit(20),
      // Extend comic data with levenshtein distance and plugin ID
      map(comic => extend(comic, text, plugin))
    ],
    onData,
    onEnd
  );
}

let KILLER;

export default function comics(plugins, language, text, onData, onEnd) {
  if (KILLER) {
    KILLER();
  }
  if (plugins.length <= 0) {
    onEnd();
  }
  onEnd = after(plugins.length, onEnd);
  KILLER = plugins
    .map(plugin => run(plugin, language, text, onData, onEnd))
    .reduce((acc, killer) => err => {
      acc(err);
      killer(err);
    });
}
