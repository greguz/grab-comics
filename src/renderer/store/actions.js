import { ipcRenderer } from "electron";

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

    ipcRenderer.on("COMIC", (event, comic) => commit("pushComic", comic));

    ipcRenderer.send("COMICS", {
      plugins: getters.activePlugins,
      language: state.language,
      text
    });
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
