import Vue from "vue";
import store from "./store";
import App from "./components/App.vue";

window.store = store;

new Vue({
  el: "#app",
  store,
  render: h => h(App)
});
