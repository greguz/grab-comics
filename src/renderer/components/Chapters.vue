<template>
  <div>
    <h1>{ comic.title }</h1>
    <table>
      <tbody>
        <tr v-for="chapter in chapters" v-bind:key="chapter.number">
          <td>{ chapter.title }</td>
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
    if (this.chapters.length <= 0) {
      this.$store.dispatch("fetchChapters");
    }
  }
};
</script>
