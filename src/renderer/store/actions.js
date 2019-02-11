import { call } from "../../rpc/renderer";

export default {
  goToHome({ commit }) {
    commit("navigate", "comics");
  },

  // addPlugin({ commit }, file) {
  //   addPlugins(
  //     file,
  //     true,
  //     plugin => {
  //       commit("pullPlugin", plugin);
  //       commit("pushPlugin", plugin);
  //     },
  //     err => commit("handleError", err)
  //   );
  // },

  searchComics({ commit, getters, state }, text) {
    commit("clearComics");

    call("COMICS", {
      plugin: getters.activePlugins[0], // TODO split by plugin with separate spinners
      language: state.language,
      text
    }).on("data", comic => commit("pushComic", comic));
  },

  selectComic({ commit, dispatch }, comic) {
    commit("setCurrentComic", comic);
    dispatch("fetchChapters");
    commit("navigate", "chapters");
  },

  fetchChapters({ commit, getters, state }) {
    commit("clearChapters");
    // fetchChapters(
    //   getters.plugin,
    //   state.comic,
    //   chapter => commit("pushChapter", chapter),
    //   err => commit("handleError", err)
    // );
  },

  selectChapter({ commit, dispatch }, chapter) {
    commit("setCurrentChapter", chapter);
    dispatch("fetchPages");
    commit("navigate", "pages");
  },

  fetchPages({ commit, getters, state }) {
    commit("clearPages");
    // fetchPages(
    //   getters.plugin,
    //   state.comic,
    //   state.chapter,
    //   page => commit("pushPage", page),
    //   err => commit("handleError", err)
    // );
  }
};
