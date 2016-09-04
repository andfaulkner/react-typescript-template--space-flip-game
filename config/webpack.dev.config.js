let path = require('path');
let webpack = require('webpack');

// let HtmlWebpackPlugin = require('html-webpack-plugin');
let HandlebarsPlugin = require('handlebars-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let srcPath = path.join(__dirname, '..', 'app');
let buildPath = path.join(__dirname, '..', 'build');
let libPath = path.join(__dirname, '..', 'node_modules');
let configFile = "./config.json";

function buildFilePath(currentPath) {
  return path.join(buildPath, currentPath);
}

function srcFilePath(currentPath) {
  return path.join(srcPath, currentPath);
}

const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

module.exports = {

  entry: [
    srcFilePath('root.tsx')
  ],

  output: {
    path: buildPath,
    filename: "app.js",
    // hotUpdateMainFilename: "[hash]/update.json",
    // hotUpdateChunkFilename: "[hash]/js/[id].update.js"
  },

  resolveLoader: {
    root: libPath
  },

  resolve: {
    modulesDirectories: ["./node_modules", "./node_modules/babel"],
    extensions: ['', '.js', '.jsx', '.tsx', '.ts', '.css']
  },

  watch: true,

  progress: true,

  colors: true,

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: ['babel', 'ts-loader']
      },
      { test: /\.((hbs)|(handlebars))$/, loader: "handlebars-loader" },
      { test: /\.json$/, loader: 'json' },
      { test: /\.css$/, loader: "style-loader!css-loader!postcss-loader" },
      {
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000',
        include: path.join(srcPath, 'components')
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },

  postcss: function(webpack) {
    return [
      // !------ ALREADY INCLUDED BY cssnext: require('autoprefixer'),
      // require('precss'),
      // require('postcss-import')({
      //   addDependencyTo: webpack
      // }),
      // require('lost'),
      // require('postcss-for'),
      // require('postcss-nested'),
      // require('postcss-current-selector'),
      require('postcss-mixins')({
        mixinsFiles: path.join(__dirname, '..', 'app/assets/mixins.css')
      }),
      require('postcss-partial-import')({
        addDependencyTo: webpack
      }),
      require('postcss-simple-vars'),
      require('postcss-cssnext')
      // require('postcss-conditionals'),
      // require('postcss-extend'),
      // require('postcss-current-selector'),
      // require('postcss-math'),
      // require('postcss-property-lookup')
    ];
  },

  plugins: [
    new ExtractTextPlugin("[name].css"),
    new HandlebarsPlugin({
      // path to main hbs template
      entry: srcFilePath("index.hbs"),
      // filepath to result
      output: buildFilePath("index.html"),
      // data passed to main hbs template: `main-template(data)`
      data: require(configFile)['index-data']
    })
  ],

  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },

  devServer: {
    contentBase: buildPath,
    progress: true,
    colors: true
  }
};
