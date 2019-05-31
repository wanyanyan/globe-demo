// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

const CONFIG = {
  mode: 'development',

  entry: {
    app: resolve('./app.js')
  },
  output: {
    path: resolve(__dirname, './dist'),
    publicPath: 'dist/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  // Optional: Enables reading mapbox token from environment variable
  plugins: []
};

// This line enables bundling against src in this repo rather than installed module
module.exports = CONFIG
