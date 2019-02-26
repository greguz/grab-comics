<template>
  <div class="container">
    <h1 class="title is-1">{{ comic.title }}</h1>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-6 is-child box">
          <table class="table is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <td width="50" class="has-text-right">#</td>
                <td>Title</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="chapter in chapters"
                v-bind:key="chapter.number"
                v-on:click="openChapter(chapter)"
              >
                <td class="has-text-right">{{ chapter.number }}</td>
                <td>{{ chapter.title }}</td>
              </tr>
              <tr v-if="moreAvailable">
                <td></td>
                <td>
                  <button v-on:click="showMoreChapters">More</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="tile is-6 is-child box">
          <p class="title">Two</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    displayed: 20
  }),
  computed: mapState({
    comic(state) {
      return state.comics.active;
    },
    chapters(state) {
      return state.chapters.items.filter(
        (chapter, index) => index < this.displayed
      );
    },
    moreAvailable(state) {
      return this.displayed < state.chapters.items.length;
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
