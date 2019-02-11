import { handle } from "../rpc/main";

// import addPlugins from "./grabber/plugins";
import searchComics from "./grabber/comics";
import fetchChapters from "./grabber/chapters";
import fetchPages from "./grabber/pages";

handle("grab:comics", (stream, { language, plugin, text }) => {
  searchComics(plugin, language, text, stream).catch(err => console.error(err));
});

handle("grab:chapters", (stream, { comic, plugin }) => {
  fetchChapters(plugin, comic, stream).catch(err => console.error(err));
});

handle("grab:pages", (stream, { chapter, comic, plugin }) => {
  fetchPages(plugin, comic, chapter, stream).catch(err => console.error(err));
});
