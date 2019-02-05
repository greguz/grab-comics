import Ajv from "ajv";
import shell from "shell-quote";
import { pipeline, Transform } from "stream";
import traverse from "traverse";
import spawn from "cross-spawn";

import escapeRegExp from "lodash/escapeRegExp";
import noop from "lodash/noop";
import partial from "lodash/partial";
import uniq from "lodash/uniq";

export function buildStringMatcher(search) {
  const terms = search.match(/\S+/g) || [];
  if (terms.length <= 0) {
    return () => false;
  }
  const exps = uniq(terms).map(term => new RegExp(escapeRegExp(term), "i"));
  return function match(title) {
    for (const exp of exps) {
      if (!exp.test(title)) {
        return false;
      }
    }
    return true;
  };
}

export function ctxToEnv(ctx) {
  const env = {};

  for (const path of traverse.paths(ctx)) {
    const key = path.map(key => key.toUpperCase()).join("_");
    const value = traverse.get(ctx, path);

    if (typeof value === "string") {
      env[key] = value;
    }
  }

  return env;
}

export function tplToCmd(tpl, env) {
  const cmd = shell.parse(tpl, env);
  for (const chunk of cmd) {
    if (typeof chunk !== "string") {
      throw new Error(`Invalid command: ${cmd}`);
    }
  }
  return cmd;
}

export function mapAsync(fn) {
  return new Transform({
    objectMode: true,
    transform(data, encoding, callback) {
      fn(data, (err, result) => {
        if (
          (err === undefined || err === null) &&
          result !== undefined &&
          result !== null
        ) {
          this.push(result);
        }
        callback(err);
      });
    }
  });
}

export function map(fn) {
  return mapAsync((data, callback) => {
    callback(null, fn(data));
  });
}

export function filterAsync(fn) {
  return new Transform({
    objectMode: true,
    transform(data, encoding, callback) {
      fn(data, (err, result) => {
        if ((err === undefined || err === null) && result === true) {
          this.push(data);
        }
        callback(err);
      });
    }
  });
}

export function filter(fn) {
  return filterAsync((data, callback) => {
    callback(null, fn(data));
  });
}

export function matchSchema(schema) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  return filter(data => {
    const valid = validate(data);

    if (!valid) {
      console.error(data);
      console.error(validate.errors);
    }

    return valid;
  });
}

export function limit(count) {
  return filter(() => count-- > 0);
}

export function spawnPluginProcess(cmd, line, onData, onEnd) {
  // Spawn the sub-process
  const process = spawn(cmd[0], cmd.splice(1));

  pipeline(
    // Process stdout as stream source
    process.stdout,
    // Apply stream pipeline
    ...line,
    // Handle final callback
    err => onEnd(err)
    // Handle result callback
  ).on("data", data => onData(data));

  return function kill(err) {
    // Prevent other results
    onData = noop;
    // Force final callback argument
    onEnd = partial(onEnd, err);
    // Kill plugin process
    process.kill("SIGTERM");
  };
}
