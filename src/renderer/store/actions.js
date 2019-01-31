import addPlugin from "../plugin/plugins";
import searchComics from "../plugin/comics";

export default {
  addPlugins({ commit }, file) {
    const onData = plugin => {
      commit("pullPlugin", plugin);
      commit("pushPlugin", plugin);
    };
    addPlugin(file, onData).catch(err => console.error(err));
  },

  searchComics({ commit, getters, state }, text) {
    // Clear last search
    commit("clearComics");

    // TODO: get current language from state
    const language = "en";

    const onData = comic => commit("pushComic", comic);

    searchComics(getters.activePlugins, language, text, onData).catch(err =>
      console.error(err)
    );
  }
};
