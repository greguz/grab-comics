import JSONStream from "JSONStream";
import levenshtein from "js-levenshtein";
import { pipeline } from "stream";
import spawn from "cross-spawn";

import comicSchema from "../schema/comic";

import ComposedReadable from "./composed";
import {
  buildStringMatcher,
  ctxToEnv,
  filter,
  limit,
  map,
  matchSchema,
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

function toProcess(plugin, language, text) {
  const cmd = tplToCmd(
    plugin.commands.comics,
    ctxToEnv({
      language,
      text
    })
  );
  return spawn(cmd[0], cmd.splice(1));
}

function toStream(process, plugin, language, text) {
  const match = buildStringMatcher(text);

  return pipeline(
    // Process standard output
    process.stdout,
    // Parse stdout as JSON
    JSONStream.parse("*"),
    // Get only valid comics
    matchSchema(comicSchema),
    // Filter by searched text and selected language
    filter(comic => comic.language === language && match(comic.title)),
    // Limit by 20 comics per plugin
    limit(20),
    // Extend comic data with levenshtein distance and plugin ID
    map(comic => extend(comic, text, plugin)),
    // TODO: do something
    err => console.error(err)
  );
}

export default function comics(plugins, language, text) {
  const sources = plugins
    .map(plugin => ({ plugin, process: toProcess(plugin, language, text) }))
    .map(({ plugin, process }) => toStream(process, plugin, language, text));

  return new ComposedReadable(sources, { objectMode: true });
}
