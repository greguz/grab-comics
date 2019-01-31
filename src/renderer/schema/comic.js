export default {
  type: "object",
  required: ["id", "title"],
  properties: {
    id: {
      type: "string"
    },
    title: {
      type: "string"
    },
    thumbnail: {
      type: "string"
    },
    language: {
      type: "string",
      pattern: "^[a-z][a-z]$" // ISO 639-1: two-letter codes
    },
    meta: {
      // type: "any"
    }
  }
};
