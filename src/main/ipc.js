import { ipcMain } from "electron";

import handle from "./handle";

// import addPlugins from "./libs/plugins";
import searchComics from "./libs/comics";
// import fetchChapters from "./libs/chapters";
// import fetchPages from "./libs/pages";

handle("COMICS", (stream, { language, plugins, text }) => {
  searchComics(plugins, language, text).pipe(stream);
});
