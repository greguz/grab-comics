<template>
  <nav class="navbar is-fixed-top is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://bulma.io">
        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
      </a>

      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item" v-on:click="home">Home</a>
        <a class="navbar-item" v-on:click="queue">Queue</a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field">
            <div class="control">
              <input
                class="input is-rounded"
                type="text"
                placeholder="Search"
                v-model="temp"
                v-on:change="search"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
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
