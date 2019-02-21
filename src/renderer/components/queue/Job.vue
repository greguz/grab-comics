<template>
  <tr>
    <td>
      <a href="#" v-on:click="openComic">{{ job.comic.title }}</a>
    </td>
    <td class="has-text-right">
      <a href="#" v-on:click="openChapter">{{ job.chapter.number }}</a>
    </td>
    <td>
      <progress
        style="margin-top: 4px;"
        v-bind:class="{
          progress: true,
          'is-primary': isRunning,
          'is-success': hasCompleted,
          'is-warning': hasWarnings,
          'is-danger': hasFailed
        }"
        v-bind:value="progress"
        max="100"
      >{ progress }%</progress>
    </td>
    <td class="has-text-right">
      <a href="#">
        <font-awesome-icon icon="coffee"/>
      </a>
    </td>
  </tr>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["job"],
  computed: mapState({
    hasCompleted() {
      return this.job.status === "COMPLETED";
    },
    hasWarnings() {
      return false;
    },
    hasFailed() {
      return this.job.status === "FAILED";
    },
    isRunning() {
      return this.job.progress < 1;
    },
    progress() {
      return Math.floor(this.job.progress * 100);
    }
  }),
  methods: {
    openComic() {
      this.$store.dispatch("selectComic", this.job.comic);
    },
    openChapter() {
      this.$store.commit("setCurrentComic", this.job.comic);
      this.$store.dispatch("selectChapter", this.job.chapter);
    }
  }
};
</script>
