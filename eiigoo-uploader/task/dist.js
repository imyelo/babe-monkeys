var gulp = require('gulp');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var through = require('through2');

var pkg = require('../package.json');
var banner =
`// ==UserScript==
// @name         <%= name %>
// @namespace    <%= userscript.namespace %>
// @version      <%= version %>
// @description  <%= description %>
// @author       <%= author %>
// @match        <%= userscript.match %>
// @grant        <%= userscript.grant %>
// ==/UserScript==
/* jshint -W097 */
'use strict';

`

var gulpBrowserify = function () {
  var plugin = function (file, encoding, callback) {
    var streamer = through();
    streamer.on('error', this.emit.bind(this, 'error'));

    file.contents = browserified(file.path).pipe(streamer);

    callback(null, file);
  };
  var browserified = function (filepath) {
    var b = browserify(filepath, {debug: false});
    return b.bundle();
  };
  return through.obj(plugin);
};

gulp.task('dist', function () {
  return gulp.src([
      './src/eiigoo-uploader.js'
    ], {
      base: './src/'
    })
    .pipe(gulpBrowserify())
    .pipe(rename({basename: 'eiigoo-uploader.debug'}))
    .pipe(gulp.dest('dist/'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(header(banner, pkg))
    .pipe(rename({basename: 'eiigoo-uploader'}))
    .pipe(gulp.dest('dist/'));
});
