import searchComics from "../plugin/comics";

export default {
  searchComics({ state, commit }, text) {
    commit("clearComics");

    const onData = comic => commit("addComic", comic);

    searchComics(state.plugins, "en", text, onData).catch(err => {
      if (err) {
        console.error(err);
      }
      console.log("END");
    });
  }
};
