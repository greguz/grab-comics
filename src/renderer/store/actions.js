import { request } from "../../rpc/renderer";

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
      request(
        "grab:comics",
        {
          plugin,
          language: state.language,
          text: state.text
        },
        comic => commit("pushComic", comic),
        err => commit("handleError", err)
      );
    }
  },

  selectComic({ commit, dispatch }, comic) {
    commit("setCurrentComic", comic);
    dispatch("fetchChapters");
    commit("navigate", "chapters");
  },

  fetchChapters({ commit, getters, state }) {
    commit("clearChapters");

    request(
      "grab:chapters",
      {
        plugin: getters.plugin,
        comic: state.comic
      },
      chapter => commit("pushChapter", chapter),
      err => commit("handleError", err)
    );
  },

  selectChapter({ commit, dispatch }, chapter) {
    commit("setCurrentChapter", chapter);
    dispatch("fetchPages");
    commit("navigate", "pages");
  },

  fetchPages({ commit, getters, state }) {
    commit("clearPages");

    request(
      "grab:pages",
      {
        plugin: getters.plugin,
        comic: state.comic,
        chapter: state.chapter
      },
      page => commit("pushPage", page),
      err => commit("handleError", err)
    );
  }
};
