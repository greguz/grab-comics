import JSONStream from "JSONStream";
import levenshtein from "js-levenshtein";
import { pipeline } from "stream";
import spawn from "cross-spawn";

import comicSchema from "../schema/comic";

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

export default function comics(plugin, language, text, target) {
  return new Promise((resolve, reject) => {
    const match = buildStringMatcher(text);

    return pipeline(
      // Process standard output
      toProcess(plugin, language, text).stdout,
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
      // Target stream where to collect the output
      target,
      // End callback
      err => (err ? reject(err) : resolve())
    );
  });
}
