<template>
  <div>
    <h1>
      {{ comic.title }}
      <small>{{ chapter.title }}</small>
    </h1>
    <hr>
    <img v-if="currentPageUrl" v-bind:src="currentPageUrl">
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState({
    comic: "comic",
    chapter: "chapter",
    pages: "pages",
    currentPage: "page",
    currentPageUrl(state) {
      const { pages } = this;
      const number = 1;
      const target = pages.find(page => page.number === number);
      if (target) {
        return target.url;
      }
    }
  }),
  mounted() {
    this.$store.dispatch("fetchPages");
  },
  methods: {
    previousPage() {
      this.$store.dispatch("previousPage");
    },
    nextPage() {
      this.$store.dispatch("nextPage");
    }
  }
};
</script>
