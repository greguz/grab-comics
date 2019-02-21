<template>
  <div class="container">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        <job v-for="job in jobs" v-bind:key="job.id" v-bind:job="job"></job>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Job from "./Job.vue";

export default {
  computed: mapState({
    jobs: "queue"
  }),
  components: {
    job: Job
  }
};
</script>
