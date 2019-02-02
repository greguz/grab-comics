export default {
  activePlugins(state) {
    return state.plugins.filter(
      plugin =>
        plugin.disabled !== true && plugin.languages.includes(state.language)
    );
  },

  plugin(state) {
    if (state.comic) {
      return state.plugins.find(plugin => plugin.id === state.comic.plugin);
    }
  }
};
