import { handle } from "../rpc/main";

// import addPlugins from "./libs/plugins";
import searchComics from "./libs/comics";
// import fetchChapters from "./libs/chapters";
// import fetchPages from "./libs/pages";

handle("COMICS", (stream, { language, plugin, text }) => {
  searchComics(plugin, language, text, stream).catch(err => console.error(err));
});
