<template>
  <div>
    <h1>
      {{ comic.title }}
      <small>{{ chapter.title }}</small>
    </h1>
    <hr>
    <img v-for="page in pages" v-bind:key="page.number" v-bind:src="page.url">
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState({
    comic: "comic",
    chapter: "chapter",
    pages: "pages",
    currentPage: "page"
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
