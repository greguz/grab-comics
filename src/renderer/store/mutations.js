export default {
  addPlugin(state, plugin) {
    state.plugins.push(plugin);
  },

  addComic(state, comic) {
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
