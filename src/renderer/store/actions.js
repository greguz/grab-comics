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

    call("grab:comics", {
      plugin: getters.activePlugins[0], // TODO split by plugin with separate spinners
      language: state.language,
      text
    }).on("data", comic => commit("pushComic", comic));
    // TODO: handle errors
  },

  selectComic({ commit, dispatch }, comic) {
    commit("setCurrentComic", comic);
    dispatch("fetchChapters");
    commit("navigate", "chapters");
  },

  fetchChapters({ commit, getters, state }) {
    commit("clearChapters");

    call("grab:chapters", {
      plugin: getters.plugin,
      comic: state.comic
    }).on("data", chapter => commit("pushChapter", chapter));
    // TODO: handle errors
  },

  selectChapter({ commit, dispatch }, chapter) {
    commit("setCurrentChapter", chapter);
    dispatch("fetchPages");
    commit("navigate", "pages");
  },

  fetchPages({ commit, getters, state }) {
    commit("clearPages");

    call("grab:pages", {
      plugin: getters.plugin,
      comic: state.comic,
      chapter: state.chapter
    }).on("data", page => commit("pushPage", page));
    // TODO: handle errors
  }
};
