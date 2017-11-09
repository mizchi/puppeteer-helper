const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  entry: {
    index: [path.join(__dirname, 'src/index.js')]
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: __dirname + '/public',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/ssr/index.ejs'),
      minify: false,
      inject: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    })
  ].concat(
    ENV === 'production'
      ? [
          new UglifyJSPlugin({
            parallel: {
              cache: true,
              workers: 2 // for e.g
            }
          }),
          new CompressionPlugin()
        ]
      : []
  )
}
