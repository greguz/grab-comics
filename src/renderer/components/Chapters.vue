<template>
  <div>
    <h1>{{ comic.title }}</h1>
    <table>
      <tbody>
        <tr
          v-for="chapter in chapters"
          v-bind:key="chapter.number"
          v-on:click="selectChapter(chapter)"
        >
          <td>{{ chapter.title }}</td>
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
    displayedAll(state) {
      return this.displayed >= state.chapters.length;
    }
  }),
  mounted() {
    this.$store.dispatch("fetchChapters");
  },
  methods: {
    selectChapter(chapter) {
      this.$store.dispatch("selectChapter", chapter);
    }
  }
};
</script>
