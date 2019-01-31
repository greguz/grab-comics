import spawn from "cross-spawn";
import JSONStream from "JSONStream";
import { pipeline } from "stream";
import levenshtein from "js-levenshtein";

import comicSchema from "../schema/comic";

import { buildStringMatcher, ctxToEnv, filter, map, tplToCmd } from "./helpers";

function addDistance(comic, text) {
  return {
    ...comic,
    distance: levenshtein(comic.title, text)
  };
}

function run(command, language, text, onData) {
  const match = buildStringMatcher(text);

  return new Promise((resolve, reject) => {
    pipeline(
      // Spawn configured command
      spawn(command[0], command.splice(1)).stdout,
      // Parse stdout as JSON
      JSONStream.parse("*"),
      // Get only valid comics
      matchSchema(comicSchema),
      // Filter by searched text and selected language
      filter(comic => comic.language === language && match(comic.title)),
      // Add levenshtein distance to comic object
      map(comic => addDistance(comic, text)),
      // Final callback
      err => (err ? reject(err) : resolve())
    ).on("data", onData);
  });
}

export default function comics(plugins, language, text, onData) {
  const env = ctxToEnv({ language, text });

  return Promise.all(
    plugins
      .map(plugin => tplToCmd(plugin.commands.comics, env))
      .map(command => run(command, language, text, onData))
  );
}
