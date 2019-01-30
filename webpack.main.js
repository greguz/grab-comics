const path = require("path");
const { dependencies } = require("./package.json");

module.exports = {
  target: "electron-main",
  mode: "development",
  entry: "./src/main/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    libraryTarget: "commonjs2"
  },
  node: {
    __dirname: false
  },
  externals: Object.keys(dependencies)
};
