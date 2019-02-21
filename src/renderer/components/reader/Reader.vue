<template>
  <div class="container is-fluid">
    <h1 style="width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
      {{ comic.title }}
      <small>{{ chapter.title }}</small>
    </h1>
    <img
      id="page"
      v-bind:src="pageUrl"
      v-bind:width="pageWidth"
      v-bind:height="pageHeight"
      v-on:click="onPageClick"
      v-on:load="onPageLoad"
      v-on:error="onPageLoad"
      style="object-fit: cover; display: block; margin: auto;"
    >
  </div>
</template>

<script>
import { mapState } from "vuex";

function toRatio(width, height) {
  return width / height;
}

function toHeight(ratio, width) {
  return width / ratio;
}

function toWidth(ratio, height) {
  return ratio * height;
}

function guessSize(ratio, maxWidth, maxHeight) {
  const width = toWidth(ratio, maxHeight);
  const height = toHeight(ratio, maxWidth);
  return width > maxWidth ? [maxWidth, height] : [width, maxHeight];
}

export default {
  data: () => ({
    pageLoaded: false,
    pageWidth: 100,
    pageHeight: 100,
    currentPage: 1
  }),
  created() {
    window.addEventListener("resize", this.syncPageSize);
  },
  destroyed() {
    window.removeEventListener("resize", this.syncPageSize);
  },
  computed: mapState({
    comic: "comic",
    chapter: "chapter",
    pages: "pages",
    pageUrl() {
      const target = this.pages.find(page => page.number === this.currentPage);
      if (target) {
        return target.url;
      }
    },
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
    syncPageSize() {
      const img = document.getElementById("page");
      const imgWidth = img.naturalWidth || 100;
      const imgHeight = img.naturalHeight || 100;
      const ratio = toRatio(imgWidth, imgHeight);

      const [width, height] = guessSize(
        ratio,
        window.innerWidth - 40,
        window.innerHeight - 160
      );
      this.pageWidth = width;
      this.pageHeight = height;
    },
    onPageLoad() {
      this.syncPageSize();
      this.pageLoaded = true;
    },
    onPageClick(event) {
      if (event.x < this.pageWidth / 2) {
        this.toPreviousPage();
      } else {
        this.toNextPage();
      }
    },
    toPage(number) {
      if (
        this.pageLoaded &&
        number >= this.firstPage &&
        number <= this.lastPage
      ) {
        this.pageLoaded = false;
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
  }
};
</script>
