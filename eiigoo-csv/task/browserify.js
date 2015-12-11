var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var buffer = require('vinyl-buffer');
var watchify = require('@maizuo-fe/gulp-watchify');

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

`

gulp.task('userscript', watchify(function (browserify) {
  return gulp.src('./src/userscript.js')
    .pipe(browserify({
      watch: false,
      debug: false,
      fullPaths: false
    }))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(header(banner, pkg))
    .pipe(rename('eiigoo-csv.user.js'))
    .pipe(gulp.dest('./dist/'));
}));

gulp.task('watch', watchify(function (browserify) {
  return gulp.src('./src/userscript.js')
    .pipe(browserify({
      watch: true,
      debug: true,
      fullPaths: true
    }))
    .pipe(rename('eiigoo-csv.debug.js'))
    .pipe(gulp.dest('./dist/'));
}));

gulp.task('example-watch', watchify(function (browserify) {
  return gulp.src('./example/eiigoo-csv.js', {
      base: './example'
    })
    .pipe(browserify({
      watch: true,
      debug: true,
      fullPaths: true
    }))
    .pipe(rename({suffix: '.bundle'}))
    .pipe(gulp.dest('./example'));
}));
