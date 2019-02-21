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
          'is-success': isSuccess,
          'is-warning': isWarning,
          'is-danger': isDanger
        }"
        v-bind:value="progress"
        max="100"
      >{ progress }%</progress>
    </td>
    <td class="has-text-centered">
      <a href="#" class="icon is-small has-text-warning" v-if="isRunning" title="Pause job">
        <font-awesome-icon icon="pause"/>
      </a>
      <a href="#" class="icon is-small has-text-success" v-if="isPaused" title="Continue job">
        <font-awesome-icon icon="play"/>
      </a>
      <a href="#" class="icon is-small" v-if="isCompleted" title="Redo job">
        <font-awesome-icon icon="redo"/>
      </a>
    </td>
    <td class="has-text-right">
      <a href="#" class="icon is-small has-text-danger" title="Cancel job">
        <font-awesome-icon icon="times"/>
      </a>
    </td>
  </tr>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["job"],
  computed: mapState({
    isRunning() {
      return this.job.status === "PROCESSING";
    },
    isCompleted() {
      return this.job.progress >= 1;
    },
    isSuccess() {
      return this.job.status === "COMPLETED";
    },
    isWarning() {
      return false;
    },
    isDanger() {
      return false;
    },
    isPaused() {
      return !this.isCompleted && !this.isRunning;
    },
    progress() {
      return Math.floor(this.job.progress * 100);
    }
  }),
  methods: {
    openComic() {
      this.$store.dispatch("openComic", {
        comic: this.job.comic
      });
    },
    openChapter() {
      this.$store.dispatch("openChapter", {
        comic: this.job.comic,
        chapter: this.job.chapter
      });
    }
  }
};
</script>
