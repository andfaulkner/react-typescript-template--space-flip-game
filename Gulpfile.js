process.setMaxListeners(0);
require('events').EventEmitter.prototype._maxListeners = 100;
require('rootpath')();

var _ = require('lodash');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var tsbabel = require('gulp-typescript-babel');
var replace = require('gulp-replace');
var path = require('path');
var fs = require('fs');
const mocha = require('gulp-mocha');
const plumber = require('gulp-plumber');

var babelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc')).toString());
var tsConfig = { configFile: 'test/tsconfig.json' };

var PATHS = {
  typescript: ['./docs_guides/src_typescript/**/*.ts', './docs_guides/src_typescript/**/*.tsx'],
  js_build:   './docs_guides/build_js',
  appAllTsx: 'app/**/*.tsx',
  appAllSpec: 'app/**/*.spec.tsx',
  testOutSpec: 'testbuild/**/*.spec.js'
};

/**
 * Render typescript files to javascript - for NodeJS-only (non-browser) code
 */
gulp.task('typescript', () => {
  return gulp.src(PATHS.typescript)
    .pipe(ts(tsConfig))
    .pipe(gulp.dest(PATHS.js_build));
});

gulp.task('test', () => {
  return gulp.src(PATHS.appAllTsx)
    .pipe(plumber())
    .pipe(tsbabel({incremental: true, configFile: 'tsconfig.json' }, babelConfig))
    .pipe(replace(/(require\(.+)\.tsx([\'"]\))/, '$1.js$2'))
    .pipe(replace(/(require\(.+)\.css([\'"]\))/, ''))
    .pipe(gulp.dest('./testbuild'));
});

gulp.task('mocha', ['test'], () => {
  return gulp.src(PATHS.testOutSpec)
    .pipe(mocha({reporter: 'spec'}));
});

/**
 * Watch for changes
 */
var rerunOnChange = (() => {
  gulp.watch(PATHS.appAllTsx, ['mocha']);
});

/**
 * Task to watch for changes and build app on change
 */
gulp.task('mocha-watch', ['mocha'], function() {
  return rerunOnChange();
});
