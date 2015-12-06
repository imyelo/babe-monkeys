var gulp = require('gulp');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var through = require('through2');

var banner =
`// ==UserScript==
// @name         eiigoo-uploader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  i love my babe.
// @author       yelo
// @match        http://www.eiigoo.com/sadmin.php?module=taobao&action=add
// @grant        none
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

gulp.task('eiigoo-uploader', function () {
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
    .pipe(header(banner))
    .pipe(rename({basename: 'eiigoo-uploader'}))
    .pipe(gulp.dest('dist/'));
});
