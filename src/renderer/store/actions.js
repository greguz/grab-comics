import addPlugins from "../plugin/plugins";
import searchComics from "../plugin/comics";

export default {
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
  }
};
