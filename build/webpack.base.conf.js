const path = require('path')
const config = require('../config')
const utils = require('./utils')
const projectRoot = path.resolve(__dirname, '../')

const env = process.env.NODE_ENV
// check env & config/index.js to decide whether to enable CSS source maps for the
// various preprocessor loaders added to vue-loader at the end of this file
const cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
const cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
const useCssSourceMap = cssSourceMapDev || cssSourceMapProd

const eslintFormatter = require('eslint-friendly-formatter')
const vueLoaderOptions = {
  loaders: utils.cssLoaders({sourceMap: useCssSourceMap}),
  postcss: [
    require('autoprefixer')({
      browsers: ['last 2 versions']
    })
  ]
}

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/main.js')
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  resolveLoader: {},
  module: {
    rules: [
      {
        test: /\.vue$/,
        enforce: "pre",
        loader: 'eslint-loader',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/,
        options: {
          formatter: eslintFormatter
        }
      },
      {
        test: /\.js$/,
        enforce: "pre",
        loader: 'eslint-loader',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/,
        options: {
          formatter: eslintFormatter
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderOptions
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
