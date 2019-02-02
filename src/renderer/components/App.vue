<template>
  <div class="container">
    <component v-bind:is="component"></component>
  </div>
</template>

<script>
import Comics from "./Comics.vue";
import Chapters from "./Chapters.vue";
import Pages from "./Pages.vue";

export default {
  computed: {
    component() {
      switch (this.$store.state.location) {
        case "pages":
          return "Pages";
        case "chapters":
          return "Chapters";
        default:
          return "Comics";
      }
    }
  },
  components: {
    Comics,
    Chapters,
    Pages
  }
};
</script>
