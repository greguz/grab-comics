<template>
  <div class="container">
    <navbar></navbar>
    <component v-bind:is="component"></component>
  </div>
</template>

<script>
import Chapters from "./Chapters.vue";
import Queue from "./Queue.vue";

import NavBar from "./NavBar.vue";
import Reader from "./Reader.vue";
import Search from "./search/Search.vue";

export default {
  computed: {
    component() {
      switch (this.$store.state.location) {
        case "pages":
          return "reader";
        case "chapters":
          return "Chapters";
        case "queue":
          return "Queue";
        default:
          return "search";
      }
    }
  },
  components: {
    Chapters,
    Queue,
    navbar: NavBar,
    reader: Reader,
    search: Search
  }
};
</script>
