<template>
  <nav>
    <button v-on:click="home">HOME</button>
    <button v-on:click="queue">QUEUE</button>
    <input type="text" id="search" placeholder="Search" v-model="temp" v-on:change="search">
  </nav>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      temp: this.$store.state.text
    };
  },
  computed: mapState({
    text: "text"
  }),
  methods: {
    home() {
      this.$store.commit("navigate", "home");
    },
    queue() {
      this.$store.commit("navigate", "queue");
    },
    search() {
      this.home();
      this.$store.dispatch("searchComics", this.temp);
    }
  },
  watch: {
    text(newText) {
      this.temp = newText;
    }
  }
};
</script>
