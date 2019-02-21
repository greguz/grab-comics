<template>
  <div class="container is-fluid">
    <h1 style="width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
      {{ comic.title }}
      <small>{{ chapter.title }}</small>
    </h1>
    <page v-bind:currentPage="currentPage" v-on:ready="onPageReady"></page>
  </div>
</template>

<script>
import { mapState } from "vuex";

import PageSingle from "./PageSingle.vue";
import PageDouble from "./PageDouble.vue";

export default {
  data: () => ({
    pageReady: false,
    currentPage: 1
  }),
  computed: mapState({
    comic: "comic",
    chapter: "chapter",
    firstPage() {
      return 1;
    },
    lastPage(state) {
      return state.pages.reduce(
        (acc, page) => (page.number > acc ? page.number : acc),
        this.firstPage
      );
    }
  }),
  methods: {
    onPageReady() {
      this.pageReady = true;
    },
    toPage(number) {
      if (
        this.pageReady &&
        number >= this.firstPage &&
        number <= this.lastPage
      ) {
        this.pageReady = false;
        this.currentPage = number;
      }
    },
    toFirstPage() {
      this.toPage(this.firstPage);
    },
    toPreviousPage() {
      this.toPage(this.currentPage - 1);
    },
    toNextPage() {
      this.toPage(this.currentPage + 1);
    },
    toLastPage() {
      this.toPage(this.lastPage);
    }
  },
  components: {
    page: PageSingle
  }
};
</script>
