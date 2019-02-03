import spawn from "cross-spawn";
import JSONStream from "JSONStream";
import { pipeline } from "stream";
import levenshtein from "js-levenshtein";
import partial from "lodash/partial";
import after from "lodash/after";

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

function run(plugin, language, text, onData, onEnd) {
  const cmd = tplToCmd(plugin.commands.comics, ctxToEnv({ language, text }));
  const match = buildStringMatcher(text);
  const process = spawn(cmd[0], cmd.splice(1));

  pipeline(
    // Spawn configured command
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
    // Final callback
    err => onEnd(err)
  ).on("data", onData);

  return function kill(err) {
    onEnd = partial(onEnd, err);
    process.kill("SIGTERM");
  };
}

export default function comics(plugins, language, text, onData, onEnd) {
  if (plugins.length <= 0) {
    setImmediate(onEnd);
    return () => {};
  }
  onEnd = after(plugins.length, onEnd);
  return plugins
    .map(plugin => run(plugin, language, text, onData, onEnd))
    .reduce((acc, killer) => err => {
      acc(err);
      killer(err);
    });
}
