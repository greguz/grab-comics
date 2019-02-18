import Vue from "vue";

import store from "./store";
import App from "./components/App.vue";

import queue from "./queue/queue";

window.store = store;

setTimeout(() => queue(store), 1000);

new Vue({
  el: "#app",
  store,
  render: h => h(App)
});
