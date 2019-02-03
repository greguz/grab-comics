import addPlugins from "../libs/plugins";
import searchComics from "../libs/comics";
import fetchChapters from "../libs/chapters";
import fetchPages from "../libs/pages";

export default {
  goToHome({ commit }) {
    commit("navigate", "comics");
  },

  addPlugin({ commit }, file) {
    addPlugins(
      file,
      true,
      plugin => {
        commit("pullPlugin", plugin);
        commit("pushPlugin", plugin);
      },
      err => commit("handleError", err)
    );
  },

  searchComics({ commit, getters, state }, text) {
    commit("clearComics");
    searchComics(
      getters.activePlugins,
      state.language,
      text,
      comic => commit("pushComic", comic),
      err => commit("handleError", err)
    );
  },

  selectComic({ commit }, comic) {
    commit("clearChapters");
    commit("unsetCurrentChapter");

    commit("setCurrentComic", comic);
    commit("navigate", "chapters");
  },

  fetchChapters({ commit, getters, state }) {
    commit("clearChapters");
    fetchChapters(
      getters.plugin,
      state.comic,
      chapter => commit("pushChapter", chapter),
      err => commit("handleError", err)
    );
  },

  selectChapter({ commit }, chapter) {
    commit("clearPages");
    commit("unsetCurrentPage");

    commit("setCurrentChapter", chapter);
    commit("navigate", "pages");
  },

  fetchPages({ commit, getters, state }) {
    commit("clearPages");
    fetchPages(
      getters.plugin,
      state.comic,
      state.chapter,
      page => commit("pushPage", page),
      err => commit("handleError", err)
    );
  },

  nextPage({ commit, state }) {
    const max = state.pages.reduce(
      (acc, page) => (page.number > acc ? page.number : acc),
      1
    );
    if (state.page < max) {
      commit("setCurrentPage", state.page + 1);
    }
  },

  previousPage({ commit, state }) {
    if (state.page > 1) {
      commit("setCurrentPage", state.page - 1);
    }
  }
};
