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
      minItems: 1,
      items: {
        type: "string",
        pattern: "^[a-z][a-z]$" // ISO 639-1: two-letter codes
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
