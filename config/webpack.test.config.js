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
  // context: path.join(__dirname, "app"),
  entry: [
    srcFilePath('root.tsx')
  ],

  output: {
    path: buildPath,
    filename: "app.js",
    hotUpdateMainFilename: "[hash]/update.json",
    hotUpdateChunkFilename: "[hash]/js/[id].update.js"
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
        // exclude: ['node_modules','typings'],
        // loaders: 'react-hot!ts-loader'
        loaders: ['babel', 'ts-loader']
        // loaders: ['ts-loader', 'babel']
      },
      { test: /\.((hbs)|(handlebars))$/, loader: "handlebars-loader" },
      // {
      //   test: /\.[jt]sx?$/,
      //   include: [path.resolve(__dirname, 'app')],
      //   exclude: ['node_modules','typings'],
      //   query: {
      //     presets: ["react"]
      //   },
      //   loader: 'babel?cacheDirectory=cache'
      { test: /\.json$/, loader: 'json' },
      { test: /\.css$/, loader: "style-loader!css-loader!postcss-loader" },
      // {
      //   test: /.*\.(gif|png|jpe?g|svg)$/i,
      //   loaders: [
      //     'file?hash=sha512&digest=hex&name=[hash].[ext]',
      //     'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
      //   ]
      // }

      // {
      //   test: /\.(jpg|png)$/,
      //   loader: 'file?name=[path][name].[hash].[ext]',
      //   include:  path.join(srcPath, 'components')
      // }

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

      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   loaders: [
      //       'file' + 
      //         '?hash' +   '=' + 'sha512' +
      //         '&digest' + '=' + 'hex' +
      //         '&name'   + '=' + '[hash].[ext]',
      //       'image-webpack' + 
      //         '?bypassOnDebug' +
      //         '&optimizationLevel' + '=' + '7' +
      //         '&interlaced' +        '=' + 'false'
      //   ]
      // }

      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      //   // loaders: ['style',
      //   //      /**/ 'css?modules' +
      //   //              '&importLoaders=1']
      //           // +
      //           // '!' +
      //           //  'postcss-loader' +
      //           //        '?sourceMap=inline'
      // }
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
      // require('postcss-mixins'),
      // require('postcss-nested'),
      // require('postcss-current-selector'),
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
    // new HtmlWebpackPlugin({
    //   title: 'My test react project',
    //   template: srcFilePath('index.html')
    // }),
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
