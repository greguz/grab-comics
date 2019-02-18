import { call } from "../../rpc/renderer";

function first(arr) {
  return (
    arr.find(entry => entry.status === "PROCESSING") ||
    arr.find(entry => entry.status === "PENDING")
  );
}

function getJobStatus(job) {
  for (const task of job.tasks) {
    if (task.status !== "COMPLETED") {
      return "FAILED";
    }
  }
  return "COMPLETED";
}

async function next(store) {
  const { commit, state } = store;

  const job = first(state.queue);

  if (!job) {
    return;
  }

  const { id } = job;

  commit("updateJob", {
    id,
    update: "PROCESSING"
  });

  const task = first(job.tasks);

  if (!task) {
    commit("updateJob", {
      id,
      update: getJobStatus(job)
    });

    return setImmediate(next, store);
  }

  const index = job.tasks.findIndex(entry => entry === task);

  commit("updateTask", {
    id,
    index,
    update: "PROCESSING"
  });

  let update;
  try {
    update = await call("download", task);
  } catch (error) {
    update = { status: "FAILED", error };
  }

  commit("updateTask", {
    id,
    index,
    update
  });

  setImmediate(next, store);
}

export default function queue(store) {
  setImmediate(next, store);
}
