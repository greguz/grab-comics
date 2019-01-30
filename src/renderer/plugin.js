import spawn from "cross-spawn";
import JSONStream from "JSONStream";
import { Transform, pipeline } from "stream";
import Ajv from "ajv";
import get from "lodash/get";

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

function getCommand(template, context) {
  return template.replace(/\${(\w+)}/, (match, path) =>
    get(context, path, "").toString()
  );
}

function spawnCommand(cmd) {
  const chunks = cmd.match(/\S+/g) || [];
  if (chunks.length <= 0) {
    throw new Error(cmd);
  }
  return spawn(chunks[0], chunks.splice(1));
}

export function run({ context, onData, onEnd, schema, template }) {
  const cmd = getCommand(template, context);

  const process = spawnCommand(cmd);

  pipeline(
    process.stdout,
    JSONStream.parse("*"),
    matchSchema(schema),
    onEnd
  ).on("data", onData);
}
