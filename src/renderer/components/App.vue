<template>
  <div class="container">
    <component v-bind:is="component"></component>
  </div>
</template>

<script>
import Search from "./search/Search.vue";
import Chapters from "./Chapters.vue";
import Reader from "./Reader.vue";

export default {
  computed: {
    component() {
      switch (this.$store.state.location) {
        case "pages":
          return "Reader";
        case "chapters":
          return "Chapters";
        default:
          return "search";
      }
    }
  },
  components: {
    search: Search,
    Chapters,
    Reader
  }
};
</script>
