const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { dependencies } = require("./package.json");

module.exports = {
  target: "electron-renderer",
  mode: "development",
  entry: "./src/renderer/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "renderer.js",
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [new VueLoaderPlugin()],
  externals: Object.keys(dependencies)
};
