export default {
  type: "object",
  required: ["number"],
  properties: {
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
