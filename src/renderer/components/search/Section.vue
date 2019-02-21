<template>
  <section class="section">
    <div class="container">
      <img v-if="plugin.thumbnail" v-bind:title="plugin.name" v-bind:src="plugin.thumbnail">

      <h1 v-else>{{ plugin.name }}</h1>

      <div style="display: flex; flex-wrap: wrap; justify-content: flex-start;">
        <div
          v-for="comic in comics"
          v-bind:key="comic.id"
          style="height: 280px; flex-basis: 160px; flex-grow: 0; flex-shrink: 0;"
        >
          <img
            v-bind:title="comic.title"
            v-bind:src="comic.thumbnail"
            v-on:click="openComic(comic)"
            v-on:error="setFallbackThumbnail(comic)"
            height="280"
            width="100%"
            style="object-fit: cover;"
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    text: String,
    plugin: Object
  },
  computed: mapState({
    comics(state) {
      return state.comics.filter(comic => comic.plugin === this.plugin.id);
    }
  }),
  methods: {
    openComic(comic) {
      this.$store.dispatch("openComic", { comic });
    },
    setFallbackThumbnail(comic) {
      comic.thumbnail =
        "https://res.cloudinary.com/teepublic/image/private/s--Fq3Bvjo5--/t_Preview/b_rgb:6e2229,c_limit,f_jpg,h_630,q_90,w_630/v1494751362/production/designs/1602004_1.jpg";
    }
  },
  watch: {
    text(newText, oldText) {
      this.$store.dispatch("searchComics", {
        plugin: this.plugin,
        text: this.text
      });
    }
  }
};
</script>
