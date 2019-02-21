<template>
  <div class="container">
    <plsctn v-for="plugin in plugins" v-bind:key="plugin.id" v-bind:plugin="plugin"></plsctn>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Section from "./Section.vue";

export default {
  computed: mapState({
    plugins(state) {
      return this.$store.getters.activePlugins;
    }
  }),
  components: {
    plsctn: Section
  }
};
</script>
