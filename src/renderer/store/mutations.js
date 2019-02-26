import remove from "lodash/remove";

export default {
  navigate(state, location) {
    state.location = location;
  },

  setSearchedText(state, text) {
    state.text = text;
  },

  pushPlugin(state, plugin) {
    state.plugins.push(plugin);
  },

  pullPlugin(state, { id }) {
    remove(state.plugins, plugin => plugin.id === id);
  },

  disablePlugin(state, { id }) {
    for (const plugin of state.plugins) {
      if (plugin.id === id) {
        plugin.disabled = true;
      }
    }
  },

  enablePlugin(state, { id }) {
    for (const plugin of state.plugins) {
      if (plugin.id === id) {
        plugin.disabled = undefined;
      }
    }
  },

  clearComics(state) {
    state.comics.items.splice(0, state.comics.items.length);
  },

  pushComic(state, comic) {
    const items = state.comics.items;
    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      if (comic.distance < current.distance) {
        return items.splice(i, 0, comic);
      }
    }
    items.push(comic);
  },

  setCurrentComic(state, comic) {
    state.comics.active = comic;
  },

  unsetCurrentComic(state) {
    state.comics.active = undefined;
  },

  clearChapters(state) {
    state.chapters.items.splice(0, state.chapters.items.length);
  },

  pushChapter(state, chapter) {
    const items = state.chapters.items;
    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      if (chapter.number > current.number) {
        return items.splice(i, 0, chapter);
      }
    }
    items.push(chapter);
  },

  setCurrentChapter(state, chapter) {
    state.chapters.active = chapter;
  },

  unsetCurrentChapter(state) {
    state.chapters.active = undefined;
  },

  clearPages(state) {
    state.pages.items.splice(0, state.pages.items.length);
  },

  pushPage(state, page) {
    const items = state.pages.items;
    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      if (page.number < current.number) {
        return items.splice(i, 0, page);
      }
    }
    items.push(page);
  },

  clearQueue(state) {
    state.queue.splice(0, state.queue.length);
  },

  syncQueue(state) {
    for (const job of state.queue) {
      if (job.status === "PROCESSING") {
        job.status = "PENDING";
      }
      for (const task of job.tasks) {
        if (task.status === "PROCESSING") {
          task.status = "PENDING";
        }
      }
    }
  },

  pushJob(state, job) {
    state.queue.push(job);
  },

  pullJob(state, { id }) {
    remove(state.queue, job => job.id === id);
  },

  updateJob(state, { id, update }) {
    if (typeof update === "string") {
      update = { status: update };
    }
    const job = state.queue.find(e => e.id === id);
    if (job) {
      Object.assign(job, update);
    }
  },

  updateTask(state, { id, index, update }) {
    if (typeof update === "string") {
      update = { status: update };
    }
    const job = state.queue.find(e => e.id === id);
    if (job) {
      const task = job.tasks[index];
      if (task) {
        Object.assign(task, update);
      }
    }
  },

  handleError(state, err) {
    if (err !== undefined && err !== null) {
      console.error(err);
    }
  }
};
