const path = require("path");

module.exports = {
  target: "electron-main",
  mode: "development",
  entry: "./src/main/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  node: {
    __dirname: false
  }
};
