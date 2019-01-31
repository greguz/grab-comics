import addPlugin from "../plugin/plugins";
import searchComics from "../plugin/comics";

export default {
  addPlugins({ commit }, file) {
    const onData = plugin => commit("addPlugin", plugin);

    addPlugin(file, onData).catch(err => console.error(err));
  },

  searchComics({ state, commit }, text) {
    commit("clearComics");

    const language = "en";

    const onData = comic => commit("addComic", comic);

    searchComics(state.plugins, language, text, onData).catch(err =>
      console.error(err)
    );
  }
};
