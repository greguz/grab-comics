export default {
  currentComic(state) {
    return state.comics.find(comic => comic.active === true);
  },

  currentChapter(state) {
    return state.chapters.find(chapter => chapter.active === true);
  }
};
