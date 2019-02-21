<template>
  <div>
    <h1>{{ comic.title }}</h1>

    <table>
      <tbody>
        <tr
          v-for="chapter in chapters"
          v-bind:key="chapter.number"
          v-on:click="openChapter(chapter)"
        >
          <td>{{ chapter.title }}</td>
        </tr>
        <tr v-if="moreAvailable">
          <td>
            <button v-on:click="showMoreChapters">More</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    displayed: 20
  }),
  computed: mapState({
    comic: "comic",
    chapters(state) {
      return state.chapters.filter((chapter, index) => index < this.displayed);
    },
    moreAvailable(state) {
      return this.displayed < state.chapters.length;
    }
  }),
  methods: {
    openChapter(chapter) {
      this.$store.dispatch("openChapter", { chapter });
    },
    showMoreChapters() {
      this.displayed += 20;
    }
  }
};
</script>
