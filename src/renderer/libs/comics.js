import spawn from "cross-spawn";
import JSONStream from "JSONStream";
import { pipeline } from "stream";
import levenshtein from "js-levenshtein";

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
    plugin: plugin.id
  };
}

function run(plugin, language, text, onData) {
  return new Promise((resolve, reject) => {
    const cmd = tplToCmd(plugin.commands.comics, ctxToEnv({ language, text }));
    const match = buildStringMatcher(text);

    pipeline(
      // Spawn configured command
      spawn(cmd[0], cmd.splice(1)).stdout,
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
      // Final callback
      err => (err ? reject(err) : resolve())
    ).on("data", onData);
  });
}

export default function comics(plugins, language, text, onData, onEnd) {
  Promise.all(plugins.map(plugin => run(plugin, language, text, onData)))
    .then(() => onEnd())
    .catch(err => onEnd(err));
}

// TODO: abort (kill all processes) on new search
// TODO: limit to 10 results (kill plugin process when reach correct 10 results)
