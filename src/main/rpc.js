import { handle } from "../rpc/main";

// import addPlugins from "./grabber/plugins";
import searchComics from "./grabber/comics";
import fetchChapters from "./grabber/chapters";
// import fetchPages from "./grabber/pages";

handle("COMICS", (stream, { language, plugin, text }) => {
  searchComics(plugin, language, text, stream).catch(err => console.error(err));
});

handle("CHAPTERS", (stream, { comic, plugin }) => {
  fetchChapters(plugin, comic, stream).catch(err => console.error(err));
});
