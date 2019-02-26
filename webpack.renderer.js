const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { dependencies } = require("./package.json");
const CopyPlugin = require("copy-webpack-plugin");

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
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin([
      {
        from: path.join(__dirname, "src/index.html"),
        to: path.join(__dirname, "dist/index.html")
      },
      {
        from: path.join(__dirname, "src/assets"),
        to: path.join(__dirname, "dist/assets"),
        ignore: ".gitkeep"
      }
    ])
  ],
  externals: Object.keys(dependencies)
};
