<template>
  <div>
    <h1>
      {{ comic.title }}
      <small>{{ chapter.title }}</small>
    </h1>
    <hr>
    <img
      v-bind:src="pageUrl"
      v-bind:width="pageWidth"
      v-bind:height="pageHeight"
      v-on:click="onPageClick"
      v-on:load="onPageLoad"
      style="object-fit: cover;"
    >
  </div>
</template>

<script>
import { mapState } from "vuex";

function parseRatio(ratio) {
  if (!/^\d+:\d+$/.test(ratio)) {
    throw new Error(`Invalid ratio: ${ratio}`);
  }
  return ratio.match(/\d+/g).map(data => parseInt(data, 10));
}

function toHeight(ratio, width) {
  return Math.floor((width * ratio[1]) / ratio[0]);
}

function toWidth(ratio, height) {
  return Math.floor((height * ratio[0]) / ratio[1]);
}

function guessSize(ratio, width, height) {
  if (width < 200) {
    width = 200;
  }
  if (height < 300) {
    height = 300;
  }
  const _width = toWidth(ratio, height);
  const _height = toHeight(ratio, width);
  return _width < width ? [_width, height] : [width, _height];
}

export default {
  data: () => ({
    pageLoaded: false,
    pageRatio: [2, 3],
    pageWidth: 200,
    pageHeight: 300,
    currentPage: 1
  }),
  created() {
    window.addEventListener("resize", this.syncPageSize);
  },
  mounted() {
    this.syncPageSize();
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
        1
      );
    }
  }),
  methods: {
    syncPageSize() {
      const [width, height] = guessSize(
        this.pageRatio,
        window.innerWidth - 200,
        window.innerHeight - 200
      );
      this.pageWidth = width;
      this.pageHeight = height;
    },
    onPageLoad() {
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
