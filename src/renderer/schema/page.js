export default {
  type: "object",
  required: ["number", "url"],
  properties: {
    number: {
      type: "number",
      minimum: 1
    },
    url: {
      type: "string"
    }
  }
};
