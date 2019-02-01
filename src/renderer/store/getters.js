export default {
  activePlugins(state) {
    return state.plugins.filter(
      plugin =>
        plugin.disabled !== true && plugin.languages.includes(state.language)
    );
  },

  activeComic(state) {
    return state.comics.find(comic => comic.active === true);
  },

  activeChapter(state) {
    return state.chapters.find(chapter => chapter.active === true);
  }
};
