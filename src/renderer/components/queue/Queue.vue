<template>
  <div class="container">
    <table class="table is-fullwidth is-striped is-hoverable is-narrow">
      <thead>
        <tr>
          <th>Comic</th>
          <th width="100" class="has-text-right">Chapter</th>
          <th width="250">Status</th>
          <th></th>
          <th></th>
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
