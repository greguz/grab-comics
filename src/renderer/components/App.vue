<template>
  <section class="section" style="padding-bottom: 0;">
    <navbar></navbar>
    <component v-bind:is="component"></component>
  </section>
</template>

<script>
import Chapters from "./Chapters.vue";
import Queue from "./queue/Queue.vue";
import NavBar from "./NavBar.vue";
import Reader from "./reader/Reader.vue";
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
          return "queue";
        default:
          return "search";
      }
    }
  },
  components: {
    Chapters,
    queue: Queue,
    navbar: NavBar,
    reader: Reader,
    search: Search
  }
};
</script>
