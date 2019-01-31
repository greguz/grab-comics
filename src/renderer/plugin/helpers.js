import spawn from "cross-spawn";
import JSONStream from "JSONStream";
import { Transform, pipeline } from "stream";
import Ajv from "ajv";
import shell from "shell-quote";
import traverse from "traverse";

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

function getSchemaError(errors, data, schema) {
  const err = new Error("Found invalid JSON object");
  err.data = data;
  err.schema = schema;
  err.errors = errors;
  return err;
}

function matchSchema(schema) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  return new Transform({
    objectMode: true,
    transform(data, encoding, callback) {
      if (validate(data) === true) {
        this.push(data);
        callback();
      } else {
        callback(getSchemaError(validate.errors, data, schema));
      }
    }
  });
}

export function run(command, schema, onData) {
  return new Promise((resolve, reject) => {
    pipeline(
      spawn(command[0], command.splice(1)).stdout,
      JSONStream.parse("*"),
      matchSchema(schema),
      err => (err ? reject(err) : resolve())
    ).on("data", onData);
  });
}
