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
const insertLines = require('gulp-insert-lines');
const gulpif = require ('gulp-if');
var gulpmatch = require('gulp-match');
var map = require('map-stream');
var prependFile = require('prepend-file');

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
 * Inject a string into a gulp file stream. Takes a string or buffer, returns a buffer.
 * @param  {String|Buffer} contents     - File stream: either a string or the original buffer.
 * @param  {String}        injectString - string to insert at beginning of file.
 * @return {Buffer} Buffer, suitable for output back to gulp.
 */
const prependString = (contents, injectString) => (
  contents.toString().match(/'use strict';/)
    ? Buffer.from(contents.replace(/'use strict';/, "'use strict;'\n\n" + injectString))
    : file._contents = Buffer.from(injectString + file._contents.toString())
);

/**
 * requestAnimationFrame does not work in NodeJS. It thus does not work with Enzyme unless we
 * replace it with an equivalent. Module 'raf' is exactly this.
 * Usage: gulp.src(...)
 *            .pipe(...)
 *            .pipe(replaceRequestAnimationFrameWithRaf())
 *            .pipe(...)
 * @param  {Gulp Stream} Gulp file stream containing a single file
 * @return {Gulp Stream} Modified Gulp file stream (with requestAnimationFrame fixed)
 */
const replaceRequestAnimationFrameWithRaf = ((file, cb) => map((file, cb) => {
  let contents = file._contents.toString();
  if (contents.match(/requestAnimationFrame/) &&
      !contents.match(/require\(['"]raf['"]\)/)) {
    file._contents = prependString(contents, "var raf = require('raf');");
  }
  cb(null, file);
}));

/**
 * Render typescript files to javascript - for NodeJS-only (non-browser) code
 */
gulp.task('typescript', () => {
  return gulp.src(PATHS.typescript)
    .pipe(ts(tsConfig))
    .pipe(gulp.dest(PATHS.js_build));
});

/**
 * Build app and tests such that mocha can run on them.
 */
gulp.task('test-build', () => {
  return gulp.src(PATHS.appAllTsx)
    .pipe(plumber())
    .pipe(tsbabel({incremental: true, configFile: 'tsconfig.json' }, babelConfig))
    .pipe(replace(/(require\(.+)\.tsx([\'"]\))/g, '$1.js$2'))
    .pipe(replace(/(require\(.+)\.css([\'"]\))/g, ''))
    .pipe(replaceRequestAnimationFrameWithRaf())
    .pipe(replace(/requestAnimationFrame\(([^\)]*)\)/g, 'raf($1)'))
    .pipe(gulp.dest('./testbuild'));
});

gulp.task('mocha', ['test-build'], () => {
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
