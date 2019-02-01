<template>
  <div class="container">
    <input type="text" id="search" placeholder="Search" v-model="text" v-on:change="search">
    <hr>
    <img
      v-for="comic in comics"
      v-bind:key="comic.id"
      v-bind:src="comic.thumbnail"
      height="300"
      width="200"
    >
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    text: "",
    searching: false
  }),
  computed: mapState({
    comics: "comics"
  }),
  methods: {
    search() {
      // TODO: abort on new search
      this.$store.dispatch("searchComics", this.text);
    }
  }
};
</script>
