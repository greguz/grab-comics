export default {
  // Current app location (main rendered component)
  location: "comics",
  // Loaded plugins
  plugins: [],
  // Cached comics from last search and engine status
  comics: {
    // Engine status
    status: "READY",
    // Last encountered error
    error: undefined,
    // Comics data
    items: [],
    // Active comic
    active: undefined
  },
  // Cached active comic's chapters and engine status
  chapters: {
    // Engine status
    status: "READY",
    // Last encountered error
    error: undefined,
    // Chapters data
    items: [],
    // Active chapter
    active: undefined
  },
  // Cached active chapter's pages and engine status
  pages: {
    // Engine status
    status: "READY",
    // Last encountered error
    error: undefined,
    // Pages data
    items: [],
    // Active page number
    active: 1
  },
  // Wanted comic language, ISO 639-1: two-letter code
  language: "en",
  // Last searched text
  text: "",
  // Download queue
  queue: []
};
