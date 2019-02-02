<template>
  <h1>TODO</h1>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("fetchChapters");
  }
};
</script>
