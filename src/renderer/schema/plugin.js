export default {
  type: "object",
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
        type: "string" // TODO: what ISO?
      }
    },
    commands: {
      type: "object",
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
