const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const PATHS = {
  entryPoint: path.resolve(__dirname, "src/index.ts"),
  bundles: path.resolve(__dirname, "_bundles"),
};

const config = {
  mode: "production",
  devtool: "source-map",
  // These are the entry point of our library. We tell webpack to use
  // the name we assign later, when creating the bundle. We also use
  // the name to filter the second entry point for applying code
  // minification via UglifyJS
  entry: {
    "dio-2-town-map": [PATHS.entryPoint],
  },
  // The output defines how and where we want the bundles. The special
  // value `[name]` in `filename` tell Webpack to use the name we defined above.
  // We target a UMD and name it MyLib. When including the bundle in the browser
  // it will be accessible at `window.MyLib`
  output: {
    path: PATHS.bundles,
    filename: "[name].js",
    libraryTarget: "umd",
    library: "Dio2TownMap",
    umdNamedDefine: true,
  },
  // Add resolve for `tsx` and `ts` files, otherwise Webpack would
  // only look for common JavaScript file extension (.js)
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        // "tsx" へ変更
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
};

module.exports = config;
