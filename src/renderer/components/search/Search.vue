<template>
  <div class="container">
    <input type="text" id="search" placeholder="Search" v-model="a" v-on:change="search">
    <hr>
    <plsctn v-for="plugin in plugins" v-bind:key="plugin.id" v-bind:plugin="plugin" v-bind:text="b"></plsctn>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Section from "./Section.vue";

export default {
  data: () => ({
    a: "",
    b: ""
  }),
  computed: mapState({
    plugins(state) {
      return this.$store.getters.activePlugins;
    }
  }),
  methods: {
    search() {
      this.b = this.a;
    }
  },
  components: {
    plsctn: Section
  }
};
</script>
