import { request } from "../../rpc/renderer";

import toJob from "../queue/job";

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

  openComic({ commit, dispatch }, { comic }) {
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
        comic: state.comics.active
      },
      chapter => commit("pushChapter", chapter),
      err => commit("handleError", err)
    );
  },

  openChapter({ commit, dispatch }, { comic, chapter }) {
    if (comic) {
      commit("setCurrentComic", comic);
    }
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
        comic: state.comics.active,
        chapter: state.chapters.active
      },
      page => commit("pushPage", page),
      err => commit("handleError", err)
    );
  },

  pushJob({}, job) {
    window.queue.push(job);
  },

  startJob({}, { id }) {
    //
  },

  stopJob({}, { id }) {
    //
  },

  cancelJob({}, { id }) {
    //
  },

  pullJob({}, { id }) {
    //
  },

  downloadCurrentChapter({ commit, dispatch, getters, state }) {
    toJob(getters.plugin, state.comics.active, state.chapters.active)
      .then(job => dispatch("pushJob", job))
      .catch(err => commit("handleError", err));
  }
};
