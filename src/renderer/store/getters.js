export default {
  activePlugins(state) {
    return state.plugins.filter(
      plugin =>
        plugin.disabled !== true && plugin.languages.includes(state.language)
    );
  }
};
