import got from "got";
import { createWriteStream, ensureDir } from "fs-extra";
import * as path from "path";
import mime from "mime-types";

import { pump } from "../libs/helpers";

async function getFileExtension(url) {
  // TODO: throw readable errors
  const res = await got.head(url);
  return mime.extension(res.headers["content-type"]);
}

async function download(url, file) {
  // Guess the file extension
  const extension = await getFileExtension(url);

  // Set file extension
  file = file + "." + extension;

  // Ensure target dir
  await ensureDir(path.dirname(file));

  // Download the file
  await pump(
    // Source HTTP(S) stream
    got.stream(url),
    // Target FS stream
    createWriteStream(file)
  );

  // Return the file path
  return file;
}

export default async function run(task) {
  const { url, file } = task;
  try {
    return {
      ...task,
      status: "SUCCEEDED",
      file: await download(url, file)
    };
  } catch (error) {
    return {
      ...task,
      status: "FAILED",
      error
    };
  }
}
