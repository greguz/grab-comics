import "./index.scss";

import Vue from "vue";

import store from "./store";
import App from "./components/App.vue";

import Queue from "./queue/queue";

window.store = store;

setTimeout(() => {
  window.queue = new Queue(store);
}, 1000);

new Vue({
  el: "#app",
  store,
  render: h => h(App)
});
