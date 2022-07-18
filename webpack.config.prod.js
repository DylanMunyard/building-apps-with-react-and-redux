const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");

process.env.NODE_ENV="production";

module.exports = {
    mode: "production",
    entry: './src/index.tsx',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [new TsconfigPathsPlugin()],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'build'),
    },
    plugins: [
      // Display bundle stats
      new webpackBundleAnalyzer.BundleAnalyzerPlugin({ analyzerMode: "static" }),

      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css"
      }),

      new webpack.NormalModuleReplacementPlugin(
        /\/configureStore/,
        'configureStore.prod.ts'
      ),
      
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        "process.env.API_URL": JSON.stringify("http://localhost:3001"),
        "process.env.API_USERNAME": JSON.stringify("admin"),
        "process.env.API_PASSWORD": JSON.stringify("password")
      }),
      new HtmlWebpackPlugin({
        template: "src/index.html",
        favicon: "src/favicon.ico",
        minify: {
          // see https://github.com/kangax/html-minifier#options-quick-reference
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
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
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [() => [require("cssnano")]],
                },
                sourceMap: true,
              },
  
            }
          ]
        }
      ]
    }
};