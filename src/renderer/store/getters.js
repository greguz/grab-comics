export default {
  activePlugins(state) {
    return state.plugins; // TODO: disabled !== true && languages.includes(current)
  },

  currentComic(state) {
    return state.comics.find(comic => comic.active === true);
  },

  currentChapter(state) {
    return state.chapters.find(chapter => chapter.active === true);
  }
};
