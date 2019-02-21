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
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [new VueLoaderPlugin()],
  externals: Object.keys(dependencies)
};
