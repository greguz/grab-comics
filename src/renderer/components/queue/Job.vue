<template>
  <tr>
    <td>{{ job.id }}</td>
    <td>{{ job.status }}</td>
    <td>
      <progress class="progress" v-bind:value="progress" max="100">{ progress }%</progress>
    </td>
  </tr>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["job"],
  computed: mapState({
    progress() {
      return Math.floor((this.job.progress || 0) * 100);
    }
  })
};
</script>
