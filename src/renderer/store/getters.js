export default {
  activePlugins(state) {
    // TODO: get current language
    const language = "en";
    return state.plugins.filter(
      plugin => plugin.disabled !== true && plugin.languages.includes(language)
    );
  },

  currentComic(state) {
    return state.comics.find(comic => comic.active === true);
  },

  currentChapter(state) {
    return state.chapters.find(chapter => chapter.active === true);
  }
};
