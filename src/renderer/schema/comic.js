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
    meta: {
      // type: "any"
    }
  }
};
