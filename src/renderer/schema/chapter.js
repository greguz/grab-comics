export default {
  type: "object",
  required: ["id", "number"],
  properties: {
    id: {
      type: "string"
    },
    number: {
      type: "number",
      minimum: 1
    },
    title: {
      type: "string"
    },
    meta: {
      // type: "any"
    }
  }
};
