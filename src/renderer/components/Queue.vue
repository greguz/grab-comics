<template>
  <div>
    <table>
      <tbody>
        <tr v-for="job in jobs" v-bind:key="job.id">
          <td>{{ job.id }}</td>
          <td>{{ job.status }}</td>
          <td>{{ job.progress }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState({
    jobs: "queue"
  })
};
</script>
