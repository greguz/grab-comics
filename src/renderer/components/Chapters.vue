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
  computed: mapState({
    comic: "comic",
    chapters: "chapters"
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
