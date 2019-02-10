import { ipcMain } from "electron";

// import addPlugins from "./libs/plugins";
import searchComics from "./libs/comics";
import fetchChapters from "./libs/chapters";
import fetchPages from "./libs/pages";

// const connections = {};

// ipcMain.on("CONNECT", event => {
//   const window = event.sender;
//   const id = window.id;

//   connections[id] = window;

//   window.on("destroyed", () => (connections[id] = undefined));
// });

ipcMain.on("COMICS", (event, data) => {
  const { sender } = event;
  const { language, plugins, text } = data;

  searchComics(
    plugins,
    language,
    text,
    comic => sender.send("COMIC", comic),
    err => console.error(err)
  );
});

ipcMain.on("CHAPTERS", (event, data) => {
  const { sender } = event;
  const { comic, plugin } = data;

  //
});

ipcMain.on("PAGES", (event, data) => {
  const { chapter, comic, plugin } = data;

  //
});
