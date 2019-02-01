export default {
  activePlugins(state) {
    return state.plugins.filter(
      plugin =>
        plugin.disabled !== true && plugin.languages.includes(state.language)
    );
  },

  currentComic(state) {
    return state.comics.find(comic => comic.active === true);
  },

  currentChapter(state) {
    return state.chapters.find(chapter => chapter.active === true);
  }
};
