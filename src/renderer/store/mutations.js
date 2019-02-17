import remove from "lodash/remove";

export default {
  navigate(state, location) {
    state.location = location;
  },

  setSearchedText(state, text) {
    state.text = text;
  },

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

  clearComics(state) {
    state.comics.splice(0, state.comics.length);
  },

  pushComic(state, comic) {
    for (let i = 0; i < state.comics.length; i++) {
      const current = state.comics[i];
      if (comic.distance < current.distance) {
        return state.comics.splice(i, 0, comic);
      }
    }
    state.comics.push(comic);
  },

  setCurrentComic(state, comic) {
    state.comic = comic;
  },

  unsetCurrentComic(state) {
    state.comic = undefined;
  },

  clearChapters(state) {
    state.chapters.splice(0, state.chapters.length);
  },

  pushChapter(state, chapter) {
    for (let i = 0; i < state.chapters.length; i++) {
      const current = state.chapters[i];
      if (chapter.number > current.number) {
        return state.chapters.splice(i, 0, chapter);
      }
    }
    state.chapters.push(chapter);
  },

  setCurrentChapter(state, chapter) {
    state.chapter = chapter;
  },

  unsetCurrentChapter(state) {
    state.chapter = undefined;
  },

  clearPages(state) {
    state.pages.splice(0, state.pages.length);
  },

  pushPage(state, page) {
    for (let i = 0; i < state.pages.length; i++) {
      const current = state.pages[i];
      if (page.number < current.number) {
        return state.pages.splice(i, 0, page);
      }
    }
    state.pages.push(page);
  },

  pushQueueEntry(state, entry) {
    state.queue.push(entry);
  },

  handleError(state, err) {
    if (err !== undefined && err !== null) {
      console.error(err);
    }
  }
};
