import { call } from "../../rpc/renderer";

export default {
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
    commit("setSearchedText", text);

    for (const plugin of getters.activePlugins) {
      call("grab:comics", {
        plugin,
        language: state.language,
        text: state.text
      }).on("data", comic => commit("pushComic", comic));
      // TODO: handle errors
    }
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
