export default {
  type: "object",
  required: ["name", "languages", "commands"],
  properties: {
    name: {
      type: "string"
    },
    link: {
      type: "string"
    },
    thumbnail: {
      type: "string"
    },
    languages: {
      type: "array",
      items: {
        type: "string"
      }
    },
    commands: {
      type: "object",
      required: ["comics", "chapters", "pages"],
      properties: {
        comics: {
          type: "string"
        },
        chapters: {
          type: "string"
        },
        pages: {
          type: "string"
        }
      }
    }
  }
};
