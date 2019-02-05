<template>
  <div class="container">
    <input type="text" id="search" placeholder="Search" v-model="text" v-on:change="search">
    <hr>

    <div style="display: flex; flex-wrap: wrap; justify-content: space-evenly;">
      <div v-for="comic in comics" v-bind:key="comic.id">
        <img
          v-bind:title="comic.title"
          v-bind:src="comic.thumbnail"
          v-on:click="selectComic(comic)"
          v-on:error="setFallbackThumbnail(comic)"
          height="280"
          width="200"
          style="object-fit: cover;"
        >
      </div>
    </div>
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
    },
    setFallbackThumbnail(comic) {
      comic.thumbnail =
        "https://res.cloudinary.com/teepublic/image/private/s--Fq3Bvjo5--/t_Preview/b_rgb:6e2229,c_limit,f_jpg,h_630,q_90,w_630/v1494751362/production/designs/1602004_1.jpg";
    }
  }
};
</script>
