<template>
  <img
    id="page"
    v-bind:src="pageUrl"
    v-bind:width="pageWidth"
    v-bind:height="pageHeight"
    v-on:load="onPageReady"
    v-on:error="onPageReady"
    style="object-fit: cover; display: block; margin: auto;"
  >
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
  props: ["currentPage"],
  data: () => ({
    pageWidth: 100,
    pageHeight: 100
  }),
  created() {
    window.addEventListener("resize", this.syncPageSize);
  },
  destroyed() {
    window.removeEventListener("resize", this.syncPageSize);
  },
  computed: mapState({
    pages: "pages",
    pageUrl() {
      const target = this.pages.find(page => page.number === this.currentPage);
      if (target) {
        return target.url;
      }
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
    onPageReady() {
      this.syncPageSize();
      this.$emit("ready");
    }
  }
};
</script>
