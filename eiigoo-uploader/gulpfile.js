var gulp = require('gulp');

require('./task/dist.js');

gulp.task('default', ['dist']);
