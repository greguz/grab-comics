import { ctxToEnv, run, tplToCmd } from "./helpers";
import comicSchema from "../schema/comic";
import levenshtein from "js-levenshtein";

function addDistance(comic, text) {
  return {
    ...comic,
    distance: levenshtein(comic.title, text)
  };
}

export default function comics(plugins, text, onData) {
  const env = ctxToEnv({ text });

  const _onData = comic => onData(addDistance(comic, text));

  return Promise.all(
    plugins
      .map(plugin => tplToCmd(plugin.commands.comics, env))
      .map(command => run(command, comicSchema, _onData))
  );
}
