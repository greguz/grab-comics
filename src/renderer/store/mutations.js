import remove from "lodash/remove";

export default {
  pushPlugin(state, plugin) {
    state.plugins.push(plugin);
  },

  pullPlugin(state, { id }) {
    remove(state.plugins, plugin => plugin.id === id);
  },

  pushComic(state, comic) {
    state.comics.push(comic);
  },

  clearComics(state) {
    state.comics.splice(0, state.comics.length);
  },

  addChapter(state, chapter) {
    state.chapters.push(chapter);
  },

  addPage(state, page) {
    state.pages.push(page);
  }
};
