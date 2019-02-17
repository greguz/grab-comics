import * as os from "os";
import * as path from "path";
import shortid from "shortid";

import { request } from "../../rpc/renderer";

async function toQueueEntry(plugin, comic, chapter) {
  const dir = path.join(os.tmpdir(), shortid.generate());
  const jobs = [];

  await new Promise((resolve, reject) => {
    request(
      "grab:pages",
      { plugin, comic, chapter },
      ({ number, url }) =>
        jobs.push({
          type: "DOWNLOAD",
          status: "PENDING",
          url,
          file: path.join(dir, number.toString().padStart(5, "0"))
        }),
      err => (err ? reject(err) : resolve())
    );
  });

  return {
    comic,
    chapter,
    jobs
  };
}

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
  },

  downloadCurrentChapter({ commit, getters, state }) {
    toQueueEntry(getters.plugin, state.comic, state.chapter)
      .then(entry => commit("pushQueueEntry", entry))
      .catch(err => commit("handleError", err));
  }
};
