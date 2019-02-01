import remove from "lodash/remove";

export default {
  pushPlugin(state, plugin) {
    state.plugins.push(plugin);
  },

  pullPlugin(state, { id }) {
    remove(state.plugins, plugin => plugin.id === id);
  },

  disablePlugin(state, { id }) {
    for (const plugin of state.plugins) {
      if (plugin.id === id) {
        plugin.disabled = true;
      }
    }
  },

  enablePlugin(state, { id }) {
    for (const plugin of state.plugins) {
      if (plugin.id === id) {
        plugin.disabled = undefined;
      }
    }
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
  },

  handleError(state, err) {
    if (err !== undefined && err !== null) {
      console.error(err);
    }
  }
};
