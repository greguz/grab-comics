import * as rpc from "../../rpc/renderer";

async function execTask(store, id, index) {
  const job = store.state.queue.find(entry => entry.id === id);
  const task = job.tasks[index];

  store.commit("updateTask", {
    id,
    index,
    update: "PROCESSING"
  });

  let update;
  try {
    update = await rpc.call("download", task);
  } catch (error) {
    update = { status: "FAILED", error };
  }

  store.commit("updateTask", {
    id,
    index,
    update
  });
}

async function execJob(store, id) {
  const job = store.state.queue.find(entry => entry.id === id);
  const tick = Math.floor(100 / job.tasks.length) / 100;

  store.commit("updateJob", {
    id,
    update: "PROCESSING"
  });

  for (let i = 0; i < job.tasks.length && job.status === "PROCESSING"; i++) {
    const task = job.tasks[i];

    if (task.status === "PENDING") {
      await execTask(store, id, i);

      store.commit("updateJob", {
        id,
        update: {
          progress: job.progress + tick
        }
      });
    }
  }

  if (job.status === "PROCESSING") {
    store.commit("updateJob", {
      id,
      update: {
        status: "SUCCEEDED",
        progress: 1
      }
    });
  }
}

export default class Queue {
  constructor(store) {
    this._store = store;
    this._store.commit("syncQueue");
    this._fill();
  }

  get concurrency() {
    return 5;
  }

  get jobs() {
    return this._store.state.queue.filter(job => job.status === "PROCESSING");
  }

  _fill() {
    if (this.jobs.length < this.concurrency) {
      const next = this._store.state.queue.find(
        job => job.status === "PENDING"
      );
      if (next) {
        this.start(next);
        this._fill();
      }
    }
  }

  push(job) {
    this._store.commit("pushJob", job);
    this._fill();
  }

  start({ id }) {
    while (this.jobs.length >= this.concurrency) {
      const { id } = this.jobs.pop();
      this._store.commit("updateJob", {
        id,
        update: "PENDING"
      });
    }
    execJob(this._store, id).then(() => this._fill());
  }

  stop({ id }) {
    this._store.commit("updateJob", {
      id,
      update: "PENDING"
    });
    this._fill();
  }

  cancel({ id }) {
    this._store.commit("updateJob", {
      id,
      update: "CANCELED"
    });
    this._fill();
  }

  pull({ id }) {
    this.cancel({ id });
    this._store.commit("pullJob", { id });
  }
}
