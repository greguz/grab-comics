<template>
  <div class="container">
    <input type="text" id="search" placeholder="Search" v-model="text" v-on:change="search">
    <hr>
    <img
      v-for="comic in comics"
      v-bind:key="comic.id"
      v-bind:title="comic.title"
      v-bind:src="comic.thumbnail"
      v-on:click="selectComic(comic)"
      height="300"
      width="200"
    >
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    text: ""
  }),
  computed: mapState({
    comics: "comics"
  }),
  methods: {
    search() {
      this.$store.dispatch("searchComics", this.text);
    },
    selectComic(comic) {
      this.$store.dispatch("selectComic", comic);
    }
  }
};
</script>
