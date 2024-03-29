const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

process.env.NODE_ENV="development";

module.exports = {
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [new TsconfigPathsPlugin()],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      stats: "minimal",
      overlay: true,
      historyApiFallback: true,
      disableHostCheck: true,
      headers: { "Access-Control-Allow-Origin": "*" },
      https: false
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.API_URL": JSON.stringify("http://localhost:3004"),
        "process.env.API_USERNAME": JSON.stringify("admin"),
        "process.env.API_PASSWORD": JSON.stringify("admin"),
        "process.env.SONARR_API_URL": JSON.stringify("http://localhost:3004"),
        "process.env.SONARR_API_KEY": JSON.stringify("api_key")
      }),
      new HtmlWebpackPlugin({
        template: "src/index.html",
        publicPath: "/",
        favicon: "src/favicon.ico"
      })
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader", "eslint-loader"]
        },
        {
          test: /(\.css)$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.png$/,
          use: {
            loader: 'url-loader'
          }
        }
      ]
    }
};