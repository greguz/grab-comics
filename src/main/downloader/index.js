import download from "./download";

export default async function run(task) {
  switch (task.type) {
    case "DOWNLOAD":
      return download(task);
    default:
      throw new Error();
  }
}
