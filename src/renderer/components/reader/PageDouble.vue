<template>
  <div>
    <h1 style="width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
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
      style="object-fit: cover; display: block; margin: auto;"
    >
  </div>
</template>

<script>
import { mapState } from "vuex";

function toRatio(size) {
  return size.width / size.height;
}

function isLandscape(size) {
  return size.width >= size.height;
}

function isPortrait(size) {
  return !isLandscape(size);
}

function toHeight(ratio, width) {
  return width / ratio;
}

function toWidth(ratio, height) {
  return ratio * height;
}

function guessSize(ratio, size) {
  const maxWidth = size.width;
  const maxHeight = size.height;
  const width = toWidth(ratio, maxHeight);
  const height = toHeight(ratio, maxWidth);
  return width > maxWidth ? [maxWidth, height] : [width, maxHeight];
}

function extendPage(page, size, ratio) {
  const [width, height] = guessSize(ratio, size);
  return {
    ...page,
    ratio,
    width,
    height
  };
}

function toSize(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onerror = () => resolve([200, 200]);
    img.onload = () => resolve([img.width, img.height]);
    img.src = src;
  });
}

async function getPagesToRender(wSize, lPage, rPage) {
  const lSize = await toSize(lPage.url);
  const lRatio = toRatio(lSize);

  if (rPage && isLandscape(wSize) && isPortrait(lSize)) {
    const rSize = await toSize(rPage.url);
    const rRatio = toRatio(rSize);

    if (isPortrait(rSize) && Math.abs(lRatio - rRatio) < 0.1) {
      const xSize = [wSize.width / 2, wSize.height];
      const xRatio = (lRatio + rRatio) / 2;

      return [
        extendPage(lPage, xSize, xRatio),
        extendPage(rPage, xSize, xRatio)
      ];
    }
  }

  return [extendPage(lPage, wSize, lRatio)];
}

export default {
  data: () => ({
    ready: false,
    currentPage: 1,
    view: []
  }),
  created() {
    window.addEventListener("resize", this.sync);
  },
  mounted() {
    this.sync();
  },
  destroyed() {
    window.removeEventListener("resize", this.sync);
  },
  computed: mapState({
    comic: "comic",
    chapter: "chapter",
    pages: "pages",
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
    sync() {
      const size = [window.innerWidth - 40, window.innerHeight - 160];

      const currentPage = this.currentPage;
      const nextPage = currentPage + 1;

      const lPage = this.pages.find(page => page.number === currentPage);
      const rPage = this.pages.find(page => page.number === nextPage);

      getPagesToRender(size, lPage, rPage).then(pages => {
        this.view = pages;
        this.ready = true;
      });
    },
    toPage(number) {
      if (this.ready && number >= this.firstPage && number <= this.lastPage) {
        this.currentPage = number;
        this.sync();
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
